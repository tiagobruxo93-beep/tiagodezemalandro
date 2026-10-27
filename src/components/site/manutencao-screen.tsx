import { TridentMark } from "@/components/brand/trident-mark";
import { buildWhatsAppLink, type SiteSettings } from "@/lib/ads";

/** Tela exibida quando o painel coloca o site em manutenção. */
export function ManutencaoScreen({
  settings,
  mensagem,
}: {
  settings: SiteSettings;
  mensagem: string;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-5 text-center">
      <TridentMark className="h-14 w-14 text-secondary" />

      <p className="eyebrow mt-8">Um instante</p>
      <h1 className="mt-4 font-display text-4xl leading-tight text-foreground sm:text-5xl">
        Site em manutenção
      </h1>
      <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
        {mensagem}
      </p>

      <a
        href={buildWhatsAppLink(settings.whatsappNumber)}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-9 inline-flex items-center gap-2 rounded-sm bg-primary px-7 py-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-primary-foreground transition-colors hover:bg-primary/90"
      >
        Falar no WhatsApp
      </a>

      <p className="mt-10 text-[10px] uppercase tracking-[0.2em] text-muted-foreground/70">
        Pai Tiago de Zé Malandro
      </p>
    </div>
  );
}
