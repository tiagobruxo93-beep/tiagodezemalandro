// Registra quem está acessando o site: IP, aparelho, navegador e localização
// aproximada (por IP). Também responde se aquele IP está bloqueado.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

type Regras = { paises: string[]; liberados: string[]; bots: boolean; limite: number };

type Geo = {
  codigo: string;
  pais: string;
  regiao: string;
  cidade: string;
  latitude: number | null;
  longitude: number | null;
  provedor: string;
};

const PADRAO_BOT =
  /bot|crawl|spider|slurp|scrapy|python-requests|curl\/|wget|headless|phantom|ahrefs|semrush|petalbot|bytespider|gptbot|ccbot|claude|perplexity/i;

let cacheRegras: { valor: Regras; expira: number } | null = null;

/** Lê as regras de acesso salvas no painel (cache de 1 minuto). */
async function carregarRegras(supabase: ReturnType<typeof createClient>): Promise<Regras> {
  if (cacheRegras && Date.now() < cacheRegras.expira) return cacheRegras.valor;

  let valor: Regras = { paises: [], liberados: [], bots: false, limite: 0 };

  try {
    const { data } = await supabase
      .from("spiritual_site_settings")
      .select("content")
      .eq("id", 1)
      .maybeSingle();

    const acesso = (data?.content as Record<string, unknown> | null)?.seguranca as
      | {
          acesso?: {
            paisesBloqueados?: string;
            ipsLiberados?: string;
            bloquearBots?: boolean;
            limitePorMinuto?: number;
          };
        }
      | undefined;

    const paises = String(acesso?.acesso?.paisesBloqueados ?? "")
      .split(/[,\s]+/)
      .map((item) => item.trim().toUpperCase())
      .filter((item) => item.length === 2);

    const liberados = String(acesso?.acesso?.ipsLiberados ?? "")
      .split(/[,\s]+/)
      .map((item) => item.trim())
      .filter((item) => item.length >= 7);

    valor = {
      paises,
      liberados,
      bots: Boolean(acesso?.acesso?.bloquearBots),
      limite: Number(acesso?.acesso?.limitePorMinuto ?? 0) || 0,
    };
  } catch {
    // sem regras: site continua aberto
  }

  cacheRegras = { valor, expira: Date.now() + 60_000 };
  return valor;
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function limpar(valor: unknown, max: number): string {
  return typeof valor === "string" ? valor.trim().slice(0, max) : "";
}

/** Junta todos os cabeçalhos que podem trazer o IP de quem chamou. */
function candidatosDeIp(req: Request): string[] {
  const lista: string[] = [];

  const adicionar = (valor: string | null | undefined) => {
    if (!valor) return;
    valor.split(",").forEach((parte) => {
      const limpo = parte.trim();
      if (limpo) lista.push(limpo);
    });
  };

  adicionar(req.headers.get("cf-connecting-ip"));
  adicionar(req.headers.get("true-client-ip"));
  adicionar(req.headers.get("x-client-ip"));
  adicionar(req.headers.get("x-envoy-external-address"));
  adicionar(req.headers.get("x-forwarded-for"));
  adicionar(req.headers.get("x-real-ip"));
  adicionar(req.headers.get("forwarded"));

  return lista
    .map((valor) => valor.replace(/^for=/i, "").replace(/^"|"$/g, "").replace(/[[\]]/g, ""))
    .map((valor) => (valor.includes(":") && valor.startsWith("::ffff:") ? valor.slice(7) : valor))
    .filter((valor) => valor.length > 0);
}

/** Primeiro IP público encontrado nos cabeçalhos (ignora rede interna do proxy). */
function ipDoPedido(req: Request): string {
  const Lista = candidatosDeIp(req);
  return Lista.find((valor) => ipValido(valor)) ?? "";
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
          codigo: limpar(dados.country_code, 2).toUpperCase(),
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
          codigo: limpar(dados.country_code, 2).toUpperCase(),
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

  // IP do cabeçalho (confiável, mas o proxy pode entregar o IP interno dele)
  // e IP público detectado no navegador do visitante (fallback).
  const ipServidorBruto = candidatosDeIp(req)[0] ?? "";
  const ipServidor = ipValido(ipServidorBruto) ? ipServidorBruto : "";
  const ipEnviado = limpar(corpo.ip_publico, 45);
  const ipCliente = ipValido(ipEnviado) ? ipEnviado : "";
  const ip = ipServidor || ipCliente;

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    { auth: { persistSession: false } },
  );

  // IP bloqueado: vale tanto o IP do cabeçalho quanto o detectado no navegador.
  const paraConferir = Array.from(new Set([ipServidor, ipCliente, ip].filter(Boolean)));

  if (paraConferir.length > 0) {
    const { data: bloqueios } = await supabase
      .from("spiritual_blocked_ips")
      .select("ip")
      .in("ip", paraConferir);

    if (bloqueios && bloqueios.length > 0) {
      return json({ bloqueado: true });
    }
  }

  const ua = limpar(corpo.user_agent, 300) || req.headers.get("user-agent") || "";

  // Navegação dentro do site: só soma um acesso na sessão já registrada.
  if (corpo.pagina === true) {
    const { data: sessaoExistente } = await supabase
      .from("spiritual_visitors")
      .select("id, visitas")
      .eq("session_id", sessao)
      .maybeSingle();

    if (sessaoExistente?.id) {
      await supabase
        .from("spiritual_visitors")
        .update({
          visitas: Number(sessaoExistente.visitas ?? 1) + 1,
          visto_em: new Date().toISOString(),
          ip: ip || undefined,
        })
        .eq("id", sessaoExistente.id);

      return json({ bloqueado: false });
    }
  }

  // Aproveita a localização já conhecida do mesmo IP (economiza consultas).
  let geo: Geo | null = null;

  if (ipValido(ip)) {
    const { data: anterior } = await supabase
      .from("spiritual_visitors")
      .select("pais, pais_codigo, regiao, cidade, latitude, longitude, provedor")
      .eq("ip", ip)
      .not("cidade", "is", null)
      .order("visto_em", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (anterior?.cidade) {
      geo = {
        codigo: String(anterior.pais_codigo ?? "").toUpperCase(),
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

  // ---- Regras de acesso definidas no painel ----
  const regras = await carregarRegras(supabase);
  const liberado =
    ip !== "" &&
    regras.liberados.some((item) => item === ip || item === ipServidor || item === ipCliente);

  if (!liberado && regras.bots && PADRAO_BOT.test(ua)) {
    return json({ bloqueado: true, motivo: "robo" });
  }

  if (!liberado && regras.paises.length > 0) {
    const codigo = (geo?.codigo || "").toUpperCase();

    if (codigo && regras.paises.includes(codigo)) {
      return json({ bloqueado: true, motivo: "pais" });
    }
  }

  if (!liberado && regras.limite > 0 && ip) {
    const { data: limite } = await supabase.rpc("spiritual_rate_hit", {
      p_chave: `visitor:minuto:${ip}`,
      p_janela_segundos: 60,
      p_limite: regras.limite,
    });

    const resultado = limite as { permitido?: boolean } | null;

    if (resultado && resultado.permitido === false) {
      return json({ bloqueado: true, motivo: "limite" });
    }
  }

  const registro = {
    session_id: sessao,
    impressao: limpar(corpo.impressao, 64) || null,
    ip: ip || null,
    ip_servidor: ipServidorBruto || null,
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
    pais_codigo: geo?.codigo || null,
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
