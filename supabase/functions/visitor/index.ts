// Registra quem está acessando o site: IP, aparelho, navegador e localização
// aproximada (por IP). Também responde se aquele IP está bloqueado.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

type Geo = {
  pais: string;
  regiao: string;
  cidade: string;
  latitude: number | null;
  longitude: number | null;
  provedor: string;
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function limpar(valor: unknown, max: number): string {
  return typeof valor === "string" ? valor.trim().slice(0, max) : "";
}

function ipDoPedido(req: Request): string {
  const cf = req.headers.get("cf-connecting-ip");
  if (cf) return cf.trim();

  const encaminhado = req.headers.get("x-forwarded-for");
  if (encaminhado) return encaminhado.split(",")[0].trim();

  return (req.headers.get("x-real-ip") ?? "").trim();
}

function ipValido(ip: string) {
  if (!ip) return false;
  if (ip === "0.0.0.0" || ip === "::1") return false;
  if (/^(10\.|127\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.)/.test(ip)) return false;
  return /^[0-9a-fA-F:.]{3,45}$/.test(ip);
}

function navegadorDe(ua: string) {
  const texto = ua.toLowerCase();
  if (texto.includes("edg/")) return "Edge";
  if (texto.includes("opr/") || texto.includes("opera")) return "Opera";
  if (texto.includes("samsungbrowser")) return "Samsung Internet";
  if (texto.includes("firefox") || texto.includes("fxios")) return "Firefox";
  if (texto.includes("crios")) return "Chrome (iPhone)";
  if (texto.includes("chrome") || texto.includes("chromium")) return "Chrome";
  if (texto.includes("safari")) return "Safari";
  if (texto.includes("instagram")) return "Instagram";
  if (texto.includes("fbav") || texto.includes("facebook")) return "Facebook";
  if (texto.includes("tiktok")) return "TikTok";
  return "Outro";
}

function sistemaDe(ua: string) {
  const texto = ua.toLowerCase();
  if (texto.includes("android")) return "Android";
  if (/iphone|ipad|ipod/.test(texto)) return "iOS";
  if (texto.includes("windows")) return "Windows";
  if (texto.includes("mac os") || texto.includes("macintosh")) return "macOS";
  if (texto.includes("cros")) return "ChromeOS";
  if (texto.includes("linux")) return "Linux";
  return "Desconhecido";
}

function dispositivoDe(ua: string) {
  const texto = ua.toLowerCase();
  if (/ipad|tablet|kindle|silk/.test(texto)) return "Tablet";
  if (/mobi|iphone|android.*mobile|windows phone/.test(texto)) return "Celular";
  return "Computador";
}

/** Localização aproximada pelo IP (nível de cidade). */
async function localizar(ip: string): Promise<Geo | null> {
  try {
    const resposta = await fetch(`https://ipwho.is/${encodeURIComponent(ip)}`, {
      signal: AbortSignal.timeout(2500),
    });

    if (resposta.ok) {
      const dados = (await resposta.json()) as {
        success?: boolean;
        country?: string;
        region?: string;
        city?: string;
        latitude?: number;
        longitude?: number;
        connection?: { isp?: string };
      };

      if (dados?.success) {
        return {
          pais: limpar(dados.country, 80),
          regiao: limpar(dados.region, 80),
          cidade: limpar(dados.city, 80),
          latitude: typeof dados.latitude === "number" ? dados.latitude : null,
          longitude: typeof dados.longitude === "number" ? dados.longitude : null,
          provedor: limpar(dados.connection?.isp, 80),
        };
      }
    }
  } catch {
    // segue para o próximo serviço
  }

  try {
    const resposta = await fetch(`https://ipapi.co/${encodeURIComponent(ip)}/json/`, {
      signal: AbortSignal.timeout(2500),
      headers: { Accept: "application/json" },
    });

    if (resposta.ok) {
      const dados = (await resposta.json()) as {
        error?: boolean;
        country_name?: string;
        region?: string;
        city?: string;
        latitude?: number;
        longitude?: number;
        org?: string;
      };

      if (!dados?.error) {
        return {
          pais: limpar(dados.country_name, 80),
          regiao: limpar(dados.region, 80),
          cidade: limpar(dados.city, 80),
          latitude: typeof dados.latitude === "number" ? dados.latitude : null,
          longitude: typeof dados.longitude === "number" ? dados.longitude : null,
          provedor: limpar(dados.org, 80),
        };
      }
    }
  } catch {
    // sem localização: o resto do registro continua
  }

  return null;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return json({ error: "method_not_allowed" }, 405);
  }

  let corpo: Record<string, unknown>;
  try {
    corpo = await req.json();
  } catch {
    return json({ error: "invalid_json" }, 400);
  }

  const sessao = limpar(corpo.session_id, 64);
  if (sessao.length < 8) {
    return json({ error: "invalid_session" }, 400);
  }

  const ip = ipDoPedido(req);

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    { auth: { persistSession: false } },
  );

  // IP bloqueado: nem segue para o registro.
  if (ip) {
    const { data: bloqueio } = await supabase
      .from("spiritual_blocked_ips")
      .select("ip")
      .eq("ip", ip)
      .maybeSingle();

    if (bloqueio) {
      return json({ bloqueado: true });
    }
  }

  const ua = limpar(corpo.user_agent, 300) || req.headers.get("user-agent") || "";

  // Aproveita a localização já conhecida do mesmo IP (economiza consultas).
  let geo: Geo | null = null;

  if (ipValido(ip)) {
    const { data: anterior } = await supabase
      .from("spiritual_visitors")
      .select("pais, regiao, cidade, latitude, longitude, provedor")
      .eq("ip", ip)
      .not("cidade", "is", null)
      .order("visto_em", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (anterior?.cidade) {
      geo = {
        pais: anterior.pais ?? "",
        regiao: anterior.regiao ?? "",
        cidade: anterior.cidade ?? "",
        latitude: anterior.latitude ?? null,
        longitude: anterior.longitude ?? null,
        provedor: anterior.provedor ?? "",
      };
    } else {
      geo = await localizar(ip);
    }
  }

  const registro = {
    session_id: sessao,
    impressao: limpar(corpo.impressao, 64) || null,
    ip: ip || null,
    user_agent: ua.slice(0, 300) || null,
    navegador: navegadorDe(ua),
    sistema: sistemaDe(ua),
    dispositivo: dispositivoDe(ua),
    idioma: limpar(corpo.idioma, 24) || null,
    plataforma: limpar(corpo.plataforma, 40) || null,
    tela: limpar(corpo.tela, 24) || null,
    fuso: limpar(corpo.fuso, 60) || null,
    referencia: limpar(corpo.referencia, 250) || null,
    campanha: limpar(corpo.campanha, 250) || null,
    pais: geo?.pais ?? null,
    regiao: geo?.regiao ?? null,
    cidade: geo?.cidade ?? null,
    latitude: geo?.latitude ?? null,
    longitude: geo?.longitude ?? null,
    provedor: geo?.provedor ?? null,
    visto_em: new Date().toISOString(),
  };

  const { data: existente } = await supabase
    .from("spiritual_visitors")
    .select("id, visitas")
    .eq("session_id", sessao)
    .maybeSingle();

  if (existente?.id) {
    const { error } = await supabase
      .from("spiritual_visitors")
      .update({ ...registro, visitas: Number(existente.visitas ?? 1) + 1 })
      .eq("id", existente.id);

    if (error) {
      console.error("visitor_update_error", error.message);
    }
  } else {
    const { error } = await supabase.from("spiritual_visitors").insert(registro);

    if (error) {
      console.error("visitor_insert_error", error.message);
    }
  }

  return json({
    bloqueado: false,
    cidade: geo?.cidade ?? "",
    regiao: geo?.regiao ?? "",
    pais: geo?.pais ?? "",
  });
});
