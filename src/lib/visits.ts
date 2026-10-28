import { supabase } from "@/integrations/supabase/client";

const CHAVE_VISITANTE = "paitiago:visitante";

/** Identificador anônimo do visitante (sem IP, sem dado pessoal). */
export function idDoVisitante(): string {
  try {
    const salvo = window.localStorage.getItem(CHAVE_VISITANTE);
    if (salvo && salvo.length >= 8) return salvo;

    const novo = (
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `${Date.now()}${Math.random().toString(36).slice(2)}`
    ).replace(/-/g, "");

    window.localStorage.setItem(CHAVE_VISITANTE, novo);
    return novo;
  } catch {
    return "";
  }
}

let jaEnviado = false;

/** Registra uma abertura do site (uma vez por carregamento de página). */
export async function registrarVisita() {
  if (jaEnviado) return;

  const caminho = window.location.pathname;

  // O painel e o editor não entram na contagem.
  if (caminho.startsWith("/painel")) return;

  const sessao = idDoVisitante();
  if (!sessao) return;

  jaEnviado = true;

  try {
    await supabase.from("spiritual_page_views").insert({
      path: caminho.slice(0, 120),
      session_id: sessao,
    });
  } catch {
    // Contagem nunca deve atrapalhar o site.
  }
}

export interface ResumoAcessos {
  total: number;
  hoje: number;
  semana: number;
  unicos: number;
  dias: { dia: string; total: number }[];
}

/** Números do painel (só o administrador consegue ler). */
export async function fetchResumoAcessos(): Promise<ResumoAcessos | null> {
  const { data, error } = await supabase.rpc("spiritual_resumo_acessos");

  if (error || !data) return null;

  return data as unknown as ResumoAcessos;
}
