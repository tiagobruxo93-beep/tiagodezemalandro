import { ArrowDown, ArrowUpRight, CalendarDays, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  buildWhatsAppLink,
  CATEGORY_META,
  forwardHref,
  type Ad,
  type SiteSettings,
} from "@/lib/ads";
import { Link } from "react-router-dom";

export function HeroSection({
  settings,
  featuredAd,
}: {
  settings: SiteSettings;
  featuredAd?: Ad;
}) {
  return (
    <section className="relative isolate overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <img
          src={settings.heroImageUrl}
          alt="Altar com velas, cartas e a estátua de Seu Zé Malandro"
          className="h-full w-full object-cover object-[70%_center] md:object-center"
        />
        <div className="absolute inset-0 bg-hero" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-background/10" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background to-transparent" />
        <div className="absolute inset-0 bg-candle animate-candle-flicker" />
      </div>

      <div className="section-shell relative flex min-h-[92svh] flex-col justify-center pb-16 pt-32 sm:pt-36">
        <div className="grid items-end gap-14 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="max-w-2xl animate-fade-up">
            <p className="eyebrow">{settings.heroEyebrow}</p>

            <h1 className="mt-5 font-display text-[46px] leading-[0.98] tracking-tight text-foreground sm:text-[64px] lg:text-[78px]">
              {settings.heroTitle}
              <br />
              <span className="italic text-primary">{settings.heroHighlight}</span>
            </h1>

            <p className="mt-7 max-w-xl text-[15px] leading-relaxed text-muted-foreground sm:text-base">
              {settings.heroSubtitle}
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Button asChild variant="forward" size="xl" className="min-w-[190px]">
                <a href="#trabalhos">
                  Ver os trabalhos
                  <ArrowDown />
                </a>
              </Button>
              <Button asChild variant="outline" size="xl" className="min-w-[190px]">
                <a href={buildWhatsAppLink(settings.whatsappNumber)} target="_blank" rel="noreferrer">
                  Falar no WhatsApp
                  <ArrowUpRight />
                </a>
              </Button>
            </div>

            <div className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-border/60 pt-6">
              <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                <ShieldCheck className="h-3.5 w-3.5 text-secondary" />
                Sigilo absoluto
              </div>
              <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                <CalendarDays className="h-3.5 w-3.5 text-secondary" />
                Gira toda semana
              </div>
              <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                1.000 nomes firmados
              </div>
            </div>
          </div>

          {featuredAd && (
            <div className="animate-fade-up [animation-delay:180ms] lg:justify-self-end">
              <div className="surface-panel relative w-full max-w-[380px] overflow-hidden p-6">
                <div className="hairline-gold absolute inset-x-0 top-0 h-px" />
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="eyebrow">Corrente aberta</p>
                    <p className="mt-2 font-display text-[26px] leading-tight text-foreground">
                      {featuredAd.title}
                    </p>
                  </div>
                  <span className="mt-1 rounded-full border border-secondary/40 px-2.5 py-1 text-[9px] uppercase tracking-[0.16em] text-secondary">
                    {CATEGORY_META[featuredAd.category].label}
                  </span>
                </div>

                <p className="mt-3 line-clamp-3 text-[13px] leading-relaxed text-muted-foreground">
                  {featuredAd.summary}
                </p>

                <div className="mt-6 flex items-end justify-between border-t border-border/60 pt-4">
                  <div>
                    <p className="text-[9px] uppercase tracking-[0.22em] text-muted-foreground">
                      Valor
                    </p>
                    <p className="mt-1 font-display text-2xl text-secondary">
                      {featuredAd.priceLabel}
                    </p>
                  </div>
                  <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground/70">
                    {featuredAd.badge ?? "Vagas abertas"}
                  </span>
                </div>

                <div className="mt-5 flex flex-col gap-2">
                  <Button asChild variant="forward" size="lg" className="w-full">
                    <a
                      href={forwardHref(featuredAd, settings)}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {featuredAd.forwardLabel}
                      <ArrowUpRight />
                    </a>
                  </Button>
                  <Button asChild variant="hairline" size="sm" className="w-full">
                    <Link to={`/anuncio/${featuredAd.slug}`}>
                      Ver ficha completa
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
