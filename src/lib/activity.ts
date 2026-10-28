import { supabase } from "@/integrations/supabase/client";
import type { Json } from "@/integrations/supabase/types";

export interface Atividade {
  id: number;
  acao: string;
  detalhes: Record<string, unknown>;
  quem: string | null;
  created_at: string;
}

/** Nome amigável de cada ação registrada. */
export const ACOES: Record<string, string> = {
  login: "Entrou no painel",
  conteudo_salvo: "Salvou textos, fotos ou vídeos",
  anuncio_criado: "Criou um anúncio",
  anuncio_editado: "Editou um anúncio",
  anuncio_excluido: "Excluiu um anúncio",
  anuncio_duplicado: "Duplicou um anúncio",
  senha_trocada: "Trocou a senha do painel",
  sessoes_encerradas: "Encerrou todas as sessões",
  manutencao_ativada: "Colocou o site em manutenção",
  manutencao_desativada: "Tirou o site da manutenção",
  backup_baixado: "Baixou uma cópia de segurança",
};

/** Registra uma ação no histórico. Nunca bloqueia a ação principal. */
export async function registrarAtividade(
  acao: string,
  detalhes: Record<string, unknown> = {},
  quem = "",
) {
  try {
    await supabase.from("spiritual_activity_log").insert({
      acao,
      detalhes: (detalhes ?? {}) as unknown as Json,
      quem: quem || null,
    });
  } catch {
    // O histórico é opcional: se falhar, o painel continua funcionando.
  }
}

/** Últimas ações registradas. */
export async function fetchAtividade(limite = 20): Promise<Atividade[]> {
  const { data, error } = await supabase
    .from("spiritual_activity_log")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limite);

  if (error) return [];
  return (data ?? []) as Atividade[];
}
