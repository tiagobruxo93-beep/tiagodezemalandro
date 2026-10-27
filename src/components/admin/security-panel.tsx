import { useState } from "react";
import { KeyRound, Loader2, LogOut, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const ROTULO = "text-[10px] uppercase tracking-[0.16em] text-muted-foreground";
const CAMPO = "rounded-sm border-border bg-background/70 text-sm focus-visible:ring-secondary/50";

function Cartao({
  titulo,
  descricao,
  icone,
  children,
}: {
  titulo: string;
  descricao: string;
  icone: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="border border-border/70 bg-card/40 p-5 sm:p-6">
      <div className="flex items-start gap-3">
        <span className="mt-0.5 text-secondary">{icone}</span>
        <div>
          <h2 className="font-display text-2xl leading-tight text-foreground">{titulo}</h2>
          <p className="mt-1 max-w-xl text-[12px] leading-relaxed text-muted-foreground">
            {descricao}
          </p>
        </div>
      </div>
      <div className="mt-5 space-y-4">{children}</div>
    </section>
  );
}

export function SecurityPanel({ email }: { email: string }) {
  const [atual, setAtual] = useState("");
  const [nova, setNova] = useState("");
  const [confirma, setConfirma] = useState("");
  const [salvando, setSalvando] = useState(false);
  const [encerrando, setEncerrando] = useState(false);

  const trocarSenha = async (evento: React.FormEvent) => {
    evento.preventDefault();

    if (nova.length < 8) {
      toast.error("A nova senha precisa de pelo menos 8 caracteres.");
      return;
    }

    if (nova !== confirma) {
      toast.error("A confirmação não confere com a nova senha.");
      return;
    }

    if (nova === atual) {
      toast.error("Escolha uma senha diferente da atual.");
      return;
    }

    setSalvando(true);

    try {
      // Confirma a senha atual antes de trocar (evita troca em sessão esquecida aberta).
      const { error: erroLogin } = await supabase.auth.signInWithPassword({
        email,
        password: atual,
      });

      if (erroLogin) {
        throw new Error("Senha atual incorreta.");
      }

      const { error } = await supabase.auth.updateUser({ password: nova });

      if (error) {
        throw new Error(error.message);
      }

      setAtual("");
      setNova("");
      setConfirma("");
      toast.success("Senha atualizada. Entre de novo nos outros aparelhos.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Não foi possível trocar a senha");
    } finally {
      setSalvando(false);
    }
  };

  const sairDeTodos = async () => {
    setEncerrando(true);

    try {
      const { error } = await supabase.auth.signOut({ scope: "global" });

      if (error) {
        throw new Error(error.message);
      }

      toast.success("Todas as sessões foram encerradas.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Não foi possível encerrar as sessões");
    } finally {
      setEncerrando(false);
    }
  };

  return (
    <div className="space-y-5">
      <Cartao
        titulo="Conta autorizada"
        descricao="Este painel aceita uma única conta. Qualquer outra sessão é desconectada automaticamente e não consegue ler nem alterar nada."
        icone={<ShieldCheck className="h-5 w-5" />}
      >
        <div className="border border-border/60 bg-background/40 px-4 py-3">
          <p className={ROTULO}>E-mail do administrador</p>
          <p className="mt-1 break-all text-sm text-foreground">{email}</p>
        </div>

        <div className="grid gap-2 text-[12px] leading-relaxed text-muted-foreground sm:grid-cols-2">
          <p>• Cadastro de novas contas: fechado</p>
          <p>• Desconexão automática: 60 min sem uso</p>
          <p>• Link do painel: fora de menus e do Google</p>
          <p>• Banco: regras de acesso por conta</p>
        </div>

        <Button
          type="button"
          variant="hairline"
          onClick={() => void sairDeTodos()}
          disabled={encerrando}
        >
          {encerrando ? <Loader2 className="animate-spin" /> : <LogOut />}
          Sair de todos os dispositivos
        </Button>
      </Cartao>

      <Cartao
        titulo="Trocar a senha"
        descricao="Use uma senha longa e só sua. Ao trocar, os outros aparelhos precisam entrar de novo."
        icone={<KeyRound className="h-5 w-5" />}
      >
        <form onSubmit={trocarSenha} className="grid gap-4 sm:max-w-md">
          <div className="space-y-2">
            <Label className={ROTULO}>Senha atual</Label>
            <Input
              type="password"
              required
              autoComplete="current-password"
              maxLength={128}
              value={atual}
              onChange={(event) => setAtual(event.target.value)}
              className={CAMPO}
            />
          </div>

          <div className="space-y-2">
            <Label className={ROTULO}>Nova senha (mínimo 8 caracteres)</Label>
            <Input
              type="password"
              required
              minLength={8}
              autoComplete="new-password"
              maxLength={128}
              value={nova}
              onChange={(event) => setNova(event.target.value)}
              className={CAMPO}
            />
          </div>

          <div className="space-y-2">
            <Label className={ROTULO}>Repita a nova senha</Label>
            <Input
              type="password"
              required
              minLength={8}
              autoComplete="new-password"
              maxLength={128}
              value={confirma}
              onChange={(event) => setConfirma(event.target.value)}
              className={CAMPO}
            />
          </div>

          <Button type="submit" variant="forward" disabled={salvando}>
            {salvando ? <Loader2 className="animate-spin" /> : <ShieldCheck />}
            Salvar nova senha
          </Button>
        </form>
      </Cartao>

      <Cartao
        titulo="O que já está protegido"
        descricao="Resumo das travas ativas neste site."
        icone={<ShieldCheck className="h-5 w-5" />}
      >
        <ul className="grid gap-2 text-[12px] leading-relaxed text-muted-foreground sm:grid-cols-2">
          <li>• Só a conta autorizada lê ou grava dados</li>
          <li>• Fotos: upload restrito ao administrador</li>
          <li>• Links do painel filtrados (bloqueia scripts)</li>
          <li>• Cliques com limite por minuto e limpeza automática</li>
          <li>• Tentativas de login com espera progressiva</li>
          <li>• Site mantém cópia local se o backend cair</li>
        </ul>
      </Cartao>
    </div>
  );
}
