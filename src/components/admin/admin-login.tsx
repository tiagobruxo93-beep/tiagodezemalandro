import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, Eye, EyeOff, Loader2, Lock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Mode = "login" | "signup";

export function AdminLogin() {
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setInfo(null);
    setLoading(true);
    try {
      if (mode === "login") {
        const { error: authError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (authError) throw new Error(authError.message);
      } else {
        const { error: authError } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/` },
        });
        if (authError) throw new Error(authError.message);
        setInfo("Acesso criado. Se for o primeiro acesso da casa, ele já é administrador.");
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Não foi possível entrar";
      setError(
        message.includes("Invalid login credentials")
          ? "E-mail ou senha incorretos."
          : message.includes("already registered")
            ? "Esse e-mail já tem acesso. Use a aba Entrar."
            : message,
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-[1.05fr_0.95fr]">
      <div className="relative hidden overflow-hidden lg:block">
        <img
          src="/images/hero-altar.jpg"
          alt="Altar do terreiro"
          className="h-full w-full object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-background/20" />
        <div className="absolute inset-0 flex flex-col justify-between p-10">
          <Link to="/" className="flex flex-col leading-none">
            <span className="font-display text-2xl text-foreground">Pai Tiago</span>
            <span className="font-display text-sm italic text-primary">
              de Zé Malandro
            </span>
          </Link>
          <div className="max-w-sm">
            <p className="eyebrow">Painel da casa</p>
            <p className="mt-4 font-display text-4xl leading-tight text-foreground">
              Cada anúncio, cada encaminhamento,
              <span className="block italic text-secondary">sob o seu controle.</span>
            </p>
            <p className="mt-4 text-[13px] leading-relaxed text-muted-foreground">
              Gerencie os trabalhos, os links de pagamento, as abas do site e o
              atendimento do WhatsApp em um só lugar.
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

          <div className="mt-8 grid grid-cols-2 gap-1 border border-border/70 bg-card/40 p-1">
            {(["login", "signup"] as Mode[]).map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => {
                  setMode(item);
                  setError(null);
                  setInfo(null);
                }}
                className={`rounded-sm px-3 py-2.5 text-[10px] font-semibold uppercase tracking-[0.16em] transition-colors ${
                  mode === item
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {item === "login" ? "Entrar" : "Primeiro acesso"}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                E-mail
              </Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="voce@terreiro.com"
                className="h-12 rounded-sm border-border bg-card/60 text-sm focus-visible:ring-secondary/50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                Senha
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete={mode === "login" ? "current-password" : "new-password"}
                  required
                  minLength={6}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Mínimo de 6 caracteres"
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
              <p className="border-l-2 border-destructive bg-destructive/10 px-3 py-2 text-[12px] text-destructive-foreground">
                {error}
              </p>
            )}
            {info && (
              <p className="border-l-2 border-secondary bg-secondary/10 px-3 py-2 text-[12px] text-foreground">
                {info}
              </p>
            )}

            <Button type="submit" variant="forward" size="xl" className="w-full" disabled={loading}>
              {loading ? <Loader2 className="animate-spin" /> : <ArrowRight />}
              {mode === "login" ? "Entrar no painel" : "Criar acesso"}
            </Button>
          </form>

          <p className="mt-6 text-[11px] leading-relaxed text-muted-foreground">
            {mode === "login"
              ? "Use o e-mail e a senha cadastrados pelo responsável da casa."
              : "O primeiro acesso criado se torna administrador. Os seguintes ficam sem permissão até serem liberados."}
          </p>
        </div>
      </div>
    </div>
  );
}
