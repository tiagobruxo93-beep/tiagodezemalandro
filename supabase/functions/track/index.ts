// Registro de visitas e cliques com limite de requisições.
// Responde 429 + Retry-After quando o limite da rota é ultrapassado.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Expose-Headers": "Retry-After",
};

type Tipo = "visita" | "clique";

const CANAIS = ["forward", "checkout", "whatsapp", "view"];
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const LIMITES: Record<Tipo, { nome: string; janela: number; limite: number }[]> = {
  visita: [
    { nome: "sessao", janela: 60, limite: 20 },
    { nome: "ip", janela: 60, limite: 60 },
  ],
  clique: [
    { nome: "sessao", janela: 60, limite: 40 },
    { nome: "ip", janela: 60, limite: 120 },
  ],
};

function json(body: unknown, status = 200, extra: Record<string, string> = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json", ...extra },
  });
}

function limpar(valor: unknown, max: number): string {
  return typeof valor === "string" ? valor.trim().slice(0, max) : "";
}

async function hash(valor: string): Promise<string> {
  const dados = new TextEncoder().encode(valor);
  const digest = await crypto.subtle.digest("SHA-256", dados);
  return Array.from(new Uint8Array(digest))
    .slice(0, 10)
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return json({ error: "method_not_allowed" }, 405, { Allow: "POST" });
  }

  let corpo: Record<string, unknown>;
  try {
    corpo = await req.json();
  } catch {
    return json({ error: "invalid_json" }, 400);
  }

  const tipo = corpo.tipo === "clique" ? "clique" : "visita";
  const sessao = limpar(corpo.session_id, 64);
  const caminho = limpar(corpo.path, 120) || "/";
  const canal = CANAIS.includes(String(corpo.canal)) ? String(corpo.canal) : "forward";
  const anuncio = limpar(corpo.ad_id, 64);

  if (sessao.length < 8) {
    return json({ error: "invalid_session" }, 400);
  }

  if (tipo === "clique" && !UUID.test(anuncio)) {
    return json({ error: "invalid_ad" }, 400);
  }

  const ipBruto =
    req.headers.get("cf-connecting-ip") ??
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "0.0.0.0";
  const ip = await hash(ipBruto);
  const sessaoHash = await hash(sessao);

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    { auth: { persistSession: false } },
  );

  // Confere os limites da rota antes de gravar.
  let espera = 0;

  for (const regra of LIMITES[tipo]) {
    const chave = regra.nome === "sessao" ? sessaoHash : ip;
    const { data, error } = await supabase.rpc("spiritual_rate_hit", {
      p_chave: `${tipo}:${regra.nome}:${chave}`,
      p_janela_segundos: regra.janela,
      p_limite: regra.limite,
    });

    if (error) {
      console.error("rate_limit_error", error.message);
      return json({ error: "rate_limit_unavailable" }, 503);
    }

    const resultado = data as { permitido?: boolean; retry_after?: number } | null;

    if (!resultado?.permitido) {
      espera = Math.max(espera, Number(resultado?.retry_after ?? regra.janela));
    }
  }

  if (espera > 0) {
    return json(
      { error: "rate_limited", retry_after: espera },
      429,
      { "Retry-After": String(espera) },
    );
  }

  if (tipo === "clique") {
    const { error } = await supabase
      .from("spiritual_ad_clicks")
      .insert({ ad_id: anuncio, channel: canal });

    if (error) {
      console.error("clique_insert_error", error.message);
      return json({ error: "insert_failed" }, 400);
    }

    return json({ ok: true });
  }

  const { error } = await supabase
    .from("spiritual_page_views")
    .insert({ path: caminho, session_id: sessaoHash });

  if (error) {
    console.error("visita_insert_error", error.message);
    return json({ error: "insert_failed" }, 400);
  }

  return json({ ok: true });
});
