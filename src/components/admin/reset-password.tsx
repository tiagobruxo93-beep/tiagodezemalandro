import { useState } from "react";
import { KeyRound, Loader2, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const ROTULO = "text-[10px] uppercase tracking-[0.16em] text-muted-foreground";
const CAMPO = "h-12 rounded-sm border-border bg-card/60 text-sm focus-visible:ring-secondary/50";

/** Tela mostrada quando a pessoa chega pelo link de recuperação do e-mail. */
export function ResetPassword({ onDone }: { onDone: () => void }) {
  const [nova, setNova] = useState("");
  const [confirma, setConfirma] = useState("");
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const salvar = async (evento: React.FormEvent) => {
    evento.preventDefault();
    setErro(null);

    if (nova.length < 8) {
      setErro("A senha precisa ter pelo menos 8 caracteres.");
      return;
    }

    if (nova !== confirma) {
      setErro("As duas senhas não conferem.");
      return;
    }

    setSalvando(true);

    try {
      const { error } = await supabase.auth.updateUser({ password: nova });

      if (error) throw new Error(error.message);

      toast.success("Senha definida. Entre com a nova senha.");
      await supabase.auth.signOut();
      onDone();
    } catch (err) {
      setErro(err instanceof Error ? err.message : "Não foi possível salvar a senha.");
    } finally {
      setSalvando(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-5 py-14">
      <div className="w-full max-w-[420px]">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center border border-secondary/40 text-secondary">
            <KeyRound className="h-4 w-4" />
          </span>
          <div>
            <p className="eyebrow">Recuperação</p>
            <h1 className="font-display text-3xl leading-tight text-foreground">
              Definir nova senha
            </h1>
          </div>
        </div>

        <form onSubmit={salvar} className="mt-8 space-y-5">
          <div className="space-y-2">
            <Label className={ROTULO}>Nova senha (mínimo 8 caracteres)</Label>
            <Input
              type="password"
              required
              minLength={8}
              autoComplete="new-password"
              maxLength={128}
              value={nova}
              onChange={(evento) => setNova(evento.target.value)}
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
              onChange={(evento) => setConfirma(evento.target.value)}
              className={CAMPO}
            />
          </div>

          {erro && (
            <p
              role="alert"
              className="border-l-2 border-destructive bg-destructive/10 px-3 py-2 text-[12px] text-destructive-foreground"
            >
              {erro}
            </p>
          )}

          <Button type="submit" variant="forward" size="xl" className="w-full" disabled={salvando}>
            {salvando ? <Loader2 className="animate-spin" /> : <ShieldCheck />}
            Salvar nova senha
          </Button>
        </form>

        <p className="mt-6 text-[11px] leading-relaxed text-muted-foreground">
          Depois de salvar, o painel desconecta e você entra novamente com a senha
          nova.
        </p>

        <button
          type="button"
          onClick={onDone}
          className="mt-3 text-[10px] uppercase tracking-[0.16em] text-secondary underline-offset-4 hover:underline"
        >
          Já defini / voltar para o login
        </button>
      </div>
    </div>
  );
}
