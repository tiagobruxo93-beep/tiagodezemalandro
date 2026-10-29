import { supabase } from "@/integrations/supabase/client";

export type FatorTotp = { id: string; nome: string; criadoEm: string };

function mensagemDeErro(mensagem: string) {
  const texto = (mensagem || "").toLowerCase();

  if (texto.includes("already exists") || texto.includes("already enrolled")) {
    return "Já existe uma verificação em duas etapas ativa. Desative a anterior antes de criar outra.";
  }
  if (texto.includes("invalid")) {
    return "Código inválido ou expirado. Confira o número no aplicativo e tente de novo.";
  }
  if (texto.includes("mfa") && texto.includes("disabled")) {
    return "A verificação em duas etapas não está disponível neste momento. Fale com o suporte.";
  }

  return mensagem || "Não foi possível concluir a verificação.";
}

/** Fatores TOTP já confirmados nesta conta. */
export async function fatoresTotp(): Promise<FatorTotp[]> {
  const { data, error } = await supabase.auth.mfa.listFactors();
  if (error) throw new Error(mensagemDeErro(error.message));

  return (data?.totp ?? [])
    .filter((fator) => fator.status === "verified")
    .map((fator) => ({
      id: fator.id,
      nome: fator.friendly_name ?? "Aplicativo autenticador",
      criadoEm: fator.created_at ?? "",
    }));
}

/** Cria um novo fator e devolve o QR Code e o segredo para guardar. */
export async function iniciar2fa(): Promise<{ id: string; qr: string; segredo: string }> {
  // Um cadastro abandonado deixa um fator "não confirmado" que impede criar outro.
  const { data: existentes } = await supabase.auth.mfa.listFactors();
  const pendentes = (existentes?.all ?? []).filter((fator) => fator.status === "unverified");

  for (const pendente of pendentes) {
    await supabase.auth.mfa.unenroll({ factorId: pendente.id });
  }

  const { data, error } = await supabase.auth.mfa.enroll({
    factorType: "totp",
    friendlyName: "Painel do Pai Tiago",
  });

  if (error) throw new Error(mensagemDeErro(error.message));
  if (!data?.totp) throw new Error("O servidor não devolveu o QR Code. Tente novamente.");

  return {
    id: data.id,
    qr: data.totp.qr_code,
    segredo: data.totp.secret,
  };
}

/** Confirma o código de 6 dígitos e ativa a verificação. */
export async function confirmar2fa(fatorId: string, codigo: string) {
  const { data: desafio, error } = await supabase.auth.mfa.challenge({
    factorId: fatorId,
  });

  if (error) throw new Error(mensagemDeErro(error.message));

  const { error: erroVerificacao } = await supabase.auth.mfa.verify({
    factorId: fatorId,
    challengeId: desafio.id,
    code: codigo.replace(/\D/g, "").slice(0, 6),
  });

  if (erroVerificacao) throw new Error(mensagemDeErro(erroVerificacao.message));
}

export async function desativar2fa(fatorId: string) {
  const { error } = await supabase.auth.mfa.unenroll({ factorId: fatorId });
  if (error) throw new Error(mensagemDeErro(error.message));
}

/** Nível da sessão: aal1 (só senha) ou aal2 (senha + código). */
export async function nivelDeAcesso() {
  const { data } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();

  return {
    atual: data?.currentLevel ?? "aal1",
    proximo: data?.nextLevel ?? "aal1",
  };
}
