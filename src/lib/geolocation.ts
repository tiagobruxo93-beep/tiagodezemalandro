import { supabase } from "@/integrations/supabase/client";
import { idDoVisitante } from "@/lib/visits";

/** Decisão do visitante sobre a localização exata. */
const CHAVE_DECISAO = "paitiago:localizacao";
/** Evita que o pedido reapareça a cada página na mesma visita. */
const CHAVE_VISTA = "paitiago:localizacao-aviso";

export type DecisaoLocalizacao = "permitida" | "recusada" | null;

export type Coordenadas = {
  latitude: number;
  longitude: number;
  precisao: number;
};

export function decisaoDeLocalizacao(): DecisaoLocalizacao {
  try {
    const valor = window.localStorage.getItem(CHAVE_DECISAO);
    return valor === "permitida" || valor === "recusada" ? valor : null;
  } catch {
    return null;
  }
}

function guardar(decisao: "permitida" | "recusada") {
  try {
    window.localStorage.setItem(CHAVE_DECISAO, decisao);
  } catch {
    // Sem armazenamento: a decisão vale só para esta visita.
  }
}

/** O visitante recusou (ou já resolvemos nesta visita): não perguntar de novo. */
export function encerrarAvisoLocalizacao() {
  try {
    window.sessionStorage.setItem(CHAVE_VISTA, "1");
  } catch {
    // sem sessão
  }
}

export function avisoLocalizacaoJaMostrado() {
  try {
    return window.sessionStorage.getItem(CHAVE_VISTA) === "1";
  } catch {
    return false;
  }
}

export function recusarLocalizacao() {
  guardar("recusada");
  encerrarAvisoLocalizacao();
}

/** Pede a localização exata ao navegador (o visitante vê o pedido de permissão). */
export function obterCoordenadas(): Promise<Coordenadas | null> {
  return new Promise((resolve) => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      resolve(null);
      return;
    }

    let concluido = false;
    const terminar = (valor: Coordenadas | null) => {
      if (concluido) return;
      concluido = true;
      resolve(valor);
    };

    // Rede de segurança: alguns navegadores não chamam nem sucesso nem erro.
    const relogio = window.setTimeout(() => terminar(null), 15000);

    navigator.geolocation.getCurrentPosition(
      (posicao) => {
        window.clearTimeout(relogio);
        terminar({
          latitude: posicao.coords.latitude,
          longitude: posicao.coords.longitude,
          precisao: posicao.coords.accuracy,
        });
      },
      () => {
        window.clearTimeout(relogio);
        terminar(null);
      },
      { enableHighAccuracy: true, timeout: 13000, maximumAge: 0 },
    );
  });
}

/**
 * Autoriza no navegador, envia o ponto exato e guarda o endereço no painel.
 * Retorna true quando o registro foi salvo.
 */
export async function registrarLocalizacaoExata(): Promise<boolean> {
  const sessao = idDoVisitante();
  if (!sessao) return false;

  const coordenadas = await obterCoordenadas();

  if (!coordenadas) {
    recusarLocalizacao();
    return false;
  }

  try {
    const { error } = await supabase.functions.invoke("visitor", {
      body: { session_id: sessao, geo: coordenadas },
    });

    if (error) throw error;

    guardar("permitida");
    encerrarAvisoLocalizacao();
    return true;
  } catch {
    // Falha de rede: mantém a decisão em aberto para tentar na próxima visita.
    encerrarAvisoLocalizacao();
    return false;
  }
}
