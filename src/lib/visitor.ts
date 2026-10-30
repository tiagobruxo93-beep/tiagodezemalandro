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

const CHAVE_IP = "paitiago:ip-publico";

/**
 * Descobre o IP público do próprio visitante.
 * O servidor às vezes recebe apenas o IP interno do proxy; este valor garante
 * que o painel mostre o IP real de quem entrou no site.
 */
export async function descobrirIpPublico(): Promise<string> {
  try {
    const salvo = window.sessionStorage.getItem(CHAVE_IP);
    if (salvo) return salvo;
  } catch {
    // sem sessão
  }

  for (const servico of [
    "https://api64.ipify.org?format=json",
    "https://api.ipify.org?format=json",
  ]) {
    try {
      const resposta = await fetch(servico, { signal: AbortSignal.timeout(2500) });
      if (!resposta.ok) continue;

      const dados = (await resposta.json()) as { ip?: string };
      const ip = (dados?.ip ?? "").trim();

      if (ip) {
        try {
          window.sessionStorage.setItem(CHAVE_IP, ip);
        } catch {
          // sem armazenamento: consulta de novo na próxima página
        }
        return ip;
      }
    } catch {
      // tenta o próximo serviço
    }
  }

  return "";
}

/** Registra cada acesso (abertura ou navegação) e diz se o IP está bloqueado. */
export function registrarVisitante(opcoes: { pagina?: boolean } = {}): Promise<ResultadoVisitante> {
  const sessao = idDoVisitante();
  if (!sessao) return Promise.resolve(LIBERADO);

  return (async () => {
    try {
      const [impressao, ipPublico] = await Promise.all([
        impressaoDoAparelho(),
        descobrirIpPublico(),
      ]);

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
          ip_publico: ipPublico,
          pagina: opcoes.pagina === true,
        },
      });

      if (error) throw error;

      return (data as ResultadoVisitante) ?? LIBERADO;
    } catch {
      // Se o registro falhar, o site continua abrindo (nunca bloquear por erro de rede).
      return LIBERADO;
    }
  })();
}
