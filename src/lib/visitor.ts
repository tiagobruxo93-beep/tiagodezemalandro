import { supabase } from "@/integrations/supabase/client";
import { idDoVisitante } from "@/lib/visits";

export type ResultadoVisitante = {
  bloqueado: boolean;
  cidade?: string;
  regiao?: string;
  pais?: string;
};

const LIBERADO: ResultadoVisitante = { bloqueado: false };

function campanhaDaUrl() {
  try {
    const params = new URLSearchParams(window.location.search);
    const chaves = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "gclid", "fbclid"];

    return chaves
      .map((chave) => {
        const valor = params.get(chave);
        return valor ? `${chave}=${valor.slice(0, 60)}` : "";
      })
      .filter(Boolean)
      .join("&")
      .slice(0, 250);
  } catch {
    return "";
  }
}

/**
 * Impressão digital aproximada do aparelho.
 * MAC address não é acessível pelo navegador — isto é o mais próximo possível
 * de um identificador do dispositivo (navegador + tela + fuso + plataforma).
 */
async function impressaoDoAparelho() {
  const partes = [
    navigator.userAgent,
    `${window.screen.width}x${window.screen.height}`,
    String(window.screen.colorDepth ?? ""),
    Intl.DateTimeFormat().resolvedOptions().timeZone ?? "",
    navigator.platform ?? "",
    String(navigator.hardwareConcurrency ?? ""),
  ].join("|");

  try {
    const buffer = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(partes));
    return Array.from(new Uint8Array(buffer))
      .slice(0, 8)
      .map((byte) => byte.toString(16).padStart(2, "0"))
      .join("");
  } catch {
    return "";
  }
}

let cache: Promise<ResultadoVisitante> | null = null;

/** Registra a visita (IP, aparelho e localização aproximada) e diz se o IP está bloqueado. */
export function registrarVisitante(): Promise<ResultadoVisitante> {
  if (cache) return cache;

  const sessao = idDoVisitante();
  if (!sessao) return Promise.resolve(LIBERADO);

  cache = (async () => {
    try {
      const impressao = await impressaoDoAparelho();

      const { data, error } = await supabase.functions.invoke("visitor", {
        body: {
          session_id: sessao,
          impressao,
          tela: `${window.screen.width}x${window.screen.height}`,
          idioma: navigator.language ?? "",
          plataforma: navigator.platform ?? "",
          fuso: Intl.DateTimeFormat().resolvedOptions().timeZone ?? "",
          referencia: document.referrer.slice(0, 250),
          campanha: campanhaDaUrl(),
          user_agent: navigator.userAgent.slice(0, 300),
        },
      });

      if (error) throw error;

      return (data as ResultadoVisitante) ?? LIBERADO;
    } catch {
      // Se o registro falhar, o site continua abrindo (nunca bloquear por erro de rede).
      return LIBERADO;
    }
  })();

  return cache;
}
