import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowUpRight,
  Check,
  Clock,
  Lock,
  MessageCircle,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  buildWhatsAppLink,
  CATEGORY_META,
  forwardHref,
  isExternalForward,
  trackForward,
  type Ad,
  type SiteSettings,
} from "@/lib/ads";
import { AdCard } from "@/components/site/ad-card";

export function AdDetail({
  ad,
  settings,
  related,
}: {
  ad: Ad;
  settings: SiteSettings;
  related: Ad[];
}) {
  const meta = CATEGORY_META[ad.category];
  const external = isExternalForward(ad);
  const whatsapp = buildWhatsAppLink(
    settings.whatsappNumber,
    `Olá, Pai Tiago! Vim pelo site e quero saber mais sobre "${ad.title}".`,
  );

  return (
    <main className="pt-[74px]">
      <div className="relative isolate overflow-hidden border-b border-border/60">
        <div className="absolute inset-0 -z-10 bg-candle animate-candle-flicker" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-background via-background/60 to-transparent" />

        <div className="section-shell py-14 sm:py-16">
          <Link
            to="/#trabalhos"
            className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-secondary"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Todos os trabalhos
          </Link>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <span className="border border-secondary/40 px-2.5 py-1 text-[9px] uppercase tracking-[0.18em] text-secondary">
              {meta.label}
            </span>
            {ad.kicker && (
              <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                {ad.kicker}
              </span>
            )}
            {ad.badge && (
              <span className="border border-primary/50 bg-primary/10 px-2.5 py-1 text-[9px] uppercase tracking-[0.18em] text-primary-foreground">
                {ad.badge}
              </span>
            )}
          </div>

          <h1 className="mt-5 max-w-3xl font-display text-[44px] leading-[0.98] text-foreground sm:text-[64px]">
            {ad.title}
          </h1>
          <p className="mt-5 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            {ad.summary}
          </p>
        </div>
      </div>

      <div className="section-shell py-14">
        <div className="grid gap-12 lg:grid-cols-[1.25fr_0.75fr] lg:gap-16">
          <div>
            {ad.imageUrl && (
              <div className="relative mx-auto mb-12 max-w-[460px]">
                <div className="absolute -inset-3 -z-10 border border-secondary/20" />
                <div className="relative border border-secondary/30 bg-card/40 p-3 shadow-elegant">
                  <img
                    src={ad.imageUrl}
                    alt={ad.title}
                    className="aspect-[4/5] w-full object-contain"
                  />
                </div>
              </div>
            )}

            <div className="prose-invert max-w-none space-y-4 text-[15px] leading-relaxed text-muted-foreground">
              {ad.description
                .split("\n")
                .filter(Boolean)
                .map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
            </div>

            {ad.includes.length > 0 && (
              <div className="mt-10 border-t border-border/70 pt-8">
                <p className="eyebrow">O que está incluso</p>
                <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                  {ad.includes.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-3 border border-border/50 bg-card/40 px-4 py-3 text-[13px] leading-snug text-foreground/90"
                    >
                      <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-secondary" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mt-10 grid gap-4 border-t border-border/70 pt-8 sm:grid-cols-3">
              {[
                {
                  icon: ShieldCheck,
                  title: "Sigilo total",
                  text: "Seu nome e seu pedido ficam só entre você e o terreiro.",
                },
                {
                  icon: Clock,
                  title: "Data avisada",
                  text: "Você recebe no WhatsApp a data da firmeza.",
                },
                {
                  icon: Lock,
                  title: "Pagamento seguro",
                  text: settings.paymentNote,
                },
              ].map((item) => (
                <div key={item.title}>
                  <item.icon className="h-4 w-4 text-secondary" />
                  <p className="mt-2 font-display text-lg text-foreground">{item.title}</p>
                  <p className="mt-1 text-[12px] leading-relaxed text-muted-foreground">
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="surface-panel relative overflow-hidden p-6">
              <div className="hairline-gold absolute inset-x-0 top-0 h-px" />
              <p className="text-[9px] uppercase tracking-[0.24em] text-muted-foreground">
                Valor do trabalho
              </p>
              <p className="mt-1 font-display text-[42px] leading-none text-secondary">
                {ad.priceLabel}
              </p>
              <p className="mt-3 text-[12px] leading-relaxed text-muted-foreground">
                {external
                  ? "O botão abaixo encaminha direto para o checkout seguro. Depois é só enviar seu nome no WhatsApp."
                  : "Atendimento combinado direto no WhatsApp, com sigilo e orientação do Pai Tiago."}
              </p>

              <div className="mt-6 flex flex-col gap-2">
                <Button asChild variant="forward" size="xl" className="w-full">
                  <a
                    href={forwardHref(ad, settings)}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() =>
                      void trackForward(ad.id, external ? "checkout" : "whatsapp")
                    }
                  >
                    {ad.forwardLabel}
                    <ArrowUpRight />
                  </a>
                </Button>
                <Button asChild variant="whatsapp" size="lg" className="w-full">
                  <a href={whatsapp} target="_blank" rel="noreferrer">
                    <MessageCircle />
                    Tirar dúvida no WhatsApp
                  </a>
                </Button>
              </div>

              <div className="mt-6 space-y-2 border-t border-border/60 pt-4 text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                <p className="flex items-center gap-2">
                  <Check className="h-3 w-3 text-secondary" /> Nome firmado em corrente
                </p>
                <p className="flex items-center gap-2">
                  <Check className="h-3 w-3 text-secondary" /> Aviso da data no WhatsApp
                </p>
                <p className="flex items-center gap-2">
                  <Check className="h-3 w-3 text-secondary" /> Atendimento direto com o Pai Tiago
                </p>
              </div>

              <p className="mt-5 text-center text-[9px] uppercase tracking-[0.16em] text-muted-foreground/70">
                {settings.paymentNote}
              </p>
            </div>
          </aside>
        </div>

        {related.length > 0 && (
          <div className="mt-20 border-t border-border/70 pt-12">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="eyebrow">Na mesma frente</p>
                <h2 className="mt-3 font-display text-3xl text-foreground sm:text-4xl">
                  Outros {meta.plural.toLowerCase()}
                </h2>
              </div>
              <Link
                to="/#trabalhos"
                className="text-[10px] uppercase tracking-[0.18em] text-secondary transition-colors hover:text-foreground"
              >
                Ver todos
              </Link>
            </div>

            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((item) => (
                <AdCard key={item.id} ad={item} settings={settings} />
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
