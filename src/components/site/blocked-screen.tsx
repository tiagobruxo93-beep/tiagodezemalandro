import { Ban, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSiteSettings } from "@/hooks/use-site-data";
import { buildWhatsAppLink } from "@/lib/ads";

/** Tela mostrada quando o IP do visitante está bloqueado no painel. */
export function BlockedScreen() {
  const { settings } = useSiteSettings();
  const contato = buildWhatsAppLink(
    settings.whatsappNumber,
    "Olá! Meu acesso ao site está bloqueado e gostaria de entender o motivo.",
  );

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6 py-16">
      <div className="w-full max-w-lg border border-border/70 bg-card/40 p-8 text-center">
        <span className="mx-auto flex h-12 w-12 items-center justify-center border border-destructive/50 text-destructive">
          <Ban className="h-5 w-5" />
        </span>

        <p className="mt-6 eyebrow">Acesso restrito</p>
        <h1 className="mt-3 font-display text-4xl leading-tight text-foreground">
          Sua conexão foi bloqueada
        </h1>
        <p className="mt-4 text-[13px] leading-relaxed text-muted-foreground">
          O acesso a este site a partir da sua rede foi interrompido pelo responsável.
          Se você acredita que isso foi um engano, entre em contato para liberar
          novamente.
        </p>

        <Button asChild variant="forward" size="lg" className="mt-8">
          <a href={contato} target="_blank" rel="noopener noreferrer">
            <MessageCircle />
            Falar com o responsável
          </a>
        </Button>
      </div>
    </main>
  );
}
