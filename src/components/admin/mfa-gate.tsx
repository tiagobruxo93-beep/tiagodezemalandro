import { useState } from "react";
import { KeyRound, Loader2, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { confirmar2fa, fatoresTotp } from "@/lib/mfa";

/** Tela de código de 6 dígitos exigida quando a verificação em duas etapas está ativa. */
export function MfaGate({
  onVerified,
  onSair,
}: {
  onVerified: () => void;
  onSair: () => void;
}) {
  const [codigo, setCodigo] = useState("");
  const [enviando, setEnviando] = useState(false);

  const confirmar = async (evento: React.FormEvent) => {
    evento.preventDefault();

    const limpo = codigo.replace(/\D/g, "").slice(0, 6);
    if (limpo.length !== 6) {
      toast.error("Digite os 6 dígitos que aparecem no aplicativo.");
      return;
    }

    setEnviando(true);

    try {
      const fatores = await fatoresTotp();
      const ativo = fatores[0];

      if (!ativo) {
        toast.error("Nenhuma verificação ativa encontrada. Entre novamente.");
        return;
      }

      await confirmar2fa(ativo.id, limpo);
      toast.success("Confirmado. Bem-vindo de volta.");
      onVerified();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Código inválido.");
      setCodigo("");
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-5 py-14">
      <div className="w-full max-w-[420px]">
        <span className="flex h-10 w-10 items-center justify-center border border-secondary/40 text-secondary">
          <ShieldCheck className="h-4 w-4" />
        </span>

        <p className="mt-6 eyebrow">Verificação em duas etapas</p>
        <h1 className="mt-3 font-display text-4xl leading-tight text-foreground">
          Confirme que é você
        </h1>
        <p className="mt-3 text-[13px] leading-relaxed text-muted-foreground">
          Abra o aplicativo autenticador (Google Authenticator, Authy ou similar) e
          digite os 6 números do painel do Pai Tiago.
        </p>

        <form onSubmit={confirmar} className="mt-8 space-y-4">
          <div className="space-y-2">
            <Label className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              Código de 6 dígitos
            </Label>
            <Input
              inputMode="numeric"
              autoComplete="one-time-code"
              autoFocus
              maxLength={6}
              value={codigo}
              onChange={(evento) => setCodigo(evento.target.value.replace(/\D/g, ""))}
              placeholder="000000"
              className="h-14 rounded-sm border-border bg-card/60 text-center font-mono text-2xl tracking-[0.4em] focus-visible:ring-secondary/50"
            />
          </div>

          <Button type="submit" variant="forward" size="xl" className="w-full" disabled={enviando}>
            {enviando ? <Loader2 className="animate-spin" /> : <KeyRound />}
            Confirmar código
          </Button>
        </form>

        <button
          type="button"
          onClick={onSair}
          className="mt-6 text-[11px] uppercase tracking-[0.14em] text-muted-foreground transition-colors hover:text-secondary"
        >
          Sair desta conta
        </button>
      </div>
    </div>
  );
}
