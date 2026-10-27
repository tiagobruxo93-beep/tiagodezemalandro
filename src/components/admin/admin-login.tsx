import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, Eye, EyeOff, Loader2, Lock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { TridentMark } from "@/components/brand/trident-mark";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (authError) throw new Error(authError.message);
    } catch (err) {
      const mensagem = err instanceof Error ? err.message : "Não foi possível entrar";

      if (mensagem.includes("Invalid login credentials")) {
        setError("E-mail ou senha incorretos.");
      } else if (mensagem.includes("Email not confirmed")) {
        setError("Confirme o e-mail antes de entrar.");
      } else if (mensagem.toLowerCase().includes("rate") || mensagem.includes("too many")) {
        setError("Muitas tentativas. Aguarde alguns minutos e tente de novo.");
      } else {
        setError(mensagem);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-[1.05fr_0.95fr]">
      <div className="relative hidden overflow-hidden lg:block">
        <img
          src="/images/hero-altar-art.jpg"
          alt="Altar do terreiro"
          className="h-full w-full object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-background/20" />
        <div className="absolute inset-0 flex flex-col justify-between p-10">
          <Link to="/" className="flex items-center gap-3 leading-none">
            <TridentMark className="h-8 w-8 text-secondary" />
            <span className="flex flex-col">
              <span className="font-display text-2xl text-foreground">Pai Tiago</span>
              <span className="font-display text-sm italic text-primary">
                de Zé Malandro
              </span>
            </span>
          </Link>
          <div className="max-w-sm">
            <p className="eyebrow">Painel da casa</p>
            <p className="mt-4 font-display text-4xl leading-tight text-foreground">
              Cada anúncio, cada encaminhamento,
              <span className="block italic text-secondary">sob o seu controle.</span>
            </p>
            <p className="mt-4 text-[13px] leading-relaxed text-muted-foreground">
              Área restrita ao responsável. O acesso é individual e o cadastro de
              novas contas fica fechado.
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center px-5 py-14 sm:px-10">
        <div className="w-full max-w-[420px]">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:text-secondary"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Voltar ao site
          </Link>

          <div className="mt-8 flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center border border-secondary/40 text-secondary">
              <Lock className="h-4 w-4" />
            </span>
            <div>
              <p className="eyebrow">Acesso restrito</p>
              <h1 className="font-display text-3xl leading-tight text-foreground">
                Painel do Pai Tiago
              </h1>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="mt-10 space-y-5">
            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground"
              >
                E-mail
              </Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                required
                maxLength={160}
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="voce@terreiro.com"
                className="h-12 rounded-sm border-border bg-card/60 text-sm focus-visible:ring-secondary/50"
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="password"
                className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground"
              >
                Senha
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  minLength={8}
                  maxLength={128}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Sua senha"
                  className="h-12 rounded-sm border-border bg-card/60 pr-11 text-sm focus-visible:ring-secondary/50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {error && (
              <p
                role="alert"
                className="border-l-2 border-destructive bg-destructive/10 px-3 py-2 text-[12px] text-destructive-foreground"
              >
                {error}
              </p>
            )}

            <Button type="submit" variant="forward" size="xl" className="w-full" disabled={loading}>
              {loading ? <Loader2 className="animate-spin" /> : <ArrowRight />}
              Entrar no painel
            </Button>
          </form>

          <p className="mt-6 text-[11px] leading-relaxed text-muted-foreground">
            Painel de conta única: só esta conta entra, e o cadastro de novas
            contas está fechado. Depois de 60 minutos sem uso, o painel desconecta
            sozinho.
          </p>
        </div>
      </div>
    </div>
  );
}
