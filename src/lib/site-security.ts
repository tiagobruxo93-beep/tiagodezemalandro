import type { SiteContent } from "@/lib/site-content";

/** Configurações de segurança lidas rapidamente pelo login e pela sessão. */
export type SegurancaLocal = SiteContent["seguranca"];

export const CHAVE_SEGURANCA = "paitiago:seguranca";
export const EVENTO_SEGURANCA = "paitiago:seguranca-atualizada";

export const SEGURANCA_PADRAO: SegurancaLocal = {
  sessaoMinutos: 60,
  tentativasLogin: 5,
  exigirSenhaForte: true,
  acesso: {
    paisesBloqueados: "",
    ipsLiberados: "",
    bloquearBots: false,
    limitePorMinuto: 0,
  },
};

export function lerSeguranca(): SegurancaLocal {
  try {
    const bruto = window.localStorage.getItem(CHAVE_SEGURANCA);
    if (!bruto) return SEGURANCA_PADRAO;

    const dados = JSON.parse(bruto) as Partial<SegurancaLocal>;
    const minutos = Number(dados.sessaoMinutos);
    const tentativas = Number(dados.tentativasLogin);

    return {
      sessaoMinutos:
        Number.isFinite(minutos) && minutos >= 5 && minutos <= 480
          ? Math.round(minutos)
          : SEGURANCA_PADRAO.sessaoMinutos,
      tentativasLogin:
        Number.isFinite(tentativas) && tentativas >= 3 && tentativas <= 10
          ? Math.round(tentativas)
          : SEGURANCA_PADRAO.tentativasLogin,
      exigirSenhaForte:
        typeof dados.exigirSenhaForte === "boolean"
          ? dados.exigirSenhaForte
          : SEGURANCA_PADRAO.exigirSenhaForte,
      acesso: {
        paisesBloqueados:
          typeof dados.acesso?.paisesBloqueados === "string"
            ? dados.acesso.paisesBloqueados
            : SEGURANCA_PADRAO.acesso.paisesBloqueados,
        ipsLiberados:
          typeof dados.acesso?.ipsLiberados === "string"
            ? dados.acesso.ipsLiberados
            : SEGURANCA_PADRAO.acesso.ipsLiberados,
        bloquearBots:
          typeof dados.acesso?.bloquearBots === "boolean"
            ? dados.acesso.bloquearBots
            : SEGURANCA_PADRAO.acesso.bloquearBots,
        limitePorMinuto:
          typeof dados.acesso?.limitePorMinuto === "number"
            ? dados.acesso.limitePorMinuto
            : SEGURANCA_PADRAO.acesso.limitePorMinuto,
      },
    };
  } catch {
    return SEGURANCA_PADRAO;
  }
}

export function gravarSeguranca(valor: SegurancaLocal) {
  try {
    window.localStorage.setItem(CHAVE_SEGURANCA, JSON.stringify(valor));
  } catch {
    // Sem armazenamento: vale apenas para esta visita.
  }
  window.dispatchEvent(new Event(EVENTO_SEGURANCA));
}
