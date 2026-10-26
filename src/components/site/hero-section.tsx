import { ArrowDown, ArrowUpRight, CalendarDays, ShieldCheck } from "lucide-react";
import { safeUrl } from "@/lib/security";
import { Button } from "@/components/ui/button";
import {
  buildWhatsAppLink,
  CATEGORY_META,
  forwardHref,
  type Ad,
  type SiteSettings,
} from "@/lib/ads";
import type { SiteContent } from "@/lib/site-content";
import { Link } from "react-router-dom";

export function HeroSection({
  settings,
  content,
  featuredAd,
}: {
  settings: SiteSettings;
  content: SiteContent;
  featuredAd?: Ad;
}) {
  return (
    <section className="relative isolate overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-candle animate-candle-flicker" />
      <div className="absolute inset-x-0 bottom-0 -z-10 h-40 bg-gradient-to-t from-background to-transparent" />

      <div className="section-shell relative flex min-h-[88svh] flex-col justify-center pb-16 pt-32 sm:pt-36">
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
          <div className="max-w-2xl animate-fade-up">
            <p className="eyebrow">{content.hero.eyebrow}</p>

            <h1 className="mt-5 font-display text-[44px] leading-[0.98] tracking-tight text-foreground sm:text-[60px] lg:text-[72px]">
              {content.hero.title}
              <br />
              <span className="italic text-primary">{content.hero.highlight}</span>
            </h1>

            <p className="mt-7 max-w-xl text-[15px] leading-relaxed text-muted-foreground sm:text-base">
              {content.hero.subtitle}
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Button asChild variant="forward" size="xl" className="min-w-[190px]">
                <a href="#trabalhos">
                  Ver os trabalhos
                  <ArrowDown />
                </a>
              </Button>
              <Button asChild variant="outline" size="xl" className="min-w-[190px]">
                <a href={buildWhatsAppLink(settings.whatsappNumber)} target="_blank" rel="noopener noreferrer">
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
                Trabalhos filmados e fotografados
              </div>
            </div>
          </div>

          <div className="relative animate-fade-up [animation-delay:180ms]">
            <div className="absolute -inset-3 -z-10 border border-secondary/20" />
            <div className="relative border border-secondary/30 bg-card/40 p-2 shadow-elegant">
              <img
                src={safeUrl(content.hero.image)}
                alt="Altar do terreiro sob a lua vermelha"
                className="aspect-video w-full object-contain"
              />
              <div className="hairline-gold absolute inset-x-2 top-2 h-px" />
            </div>
          </div>
        </div>

        {featuredAd && (
          <div className="mt-14 flex flex-col gap-5 border-y border-border/60 py-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-4">
              {featuredAd.imageUrl && (
                <div className="hidden h-20 w-16 shrink-0 border border-secondary/25 bg-card/40 p-1 sm:block">
                  <img
                    src={featuredAd.imageUrl}
                    alt={featuredAd.title}
                    className="h-full w-full object-contain"
                  />
                </div>
              )}
              <div>
                <p className="eyebrow">
                  Corrente aberta · {CATEGORY_META[featuredAd.category].label}
                </p>
                <p className="mt-1.5 font-display text-[26px] leading-tight text-foreground">
                  {featuredAd.title}
                </p>
                <p className="mt-1 text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                  {featuredAd.badge ?? "Vagas abertas"}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-end gap-6">
              <div>
                <p className="text-[9px] uppercase tracking-[0.22em] text-muted-foreground">
                  Valor
                </p>
                <p className="mt-1 font-display text-3xl leading-none text-secondary">
                  {featuredAd.priceLabel}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button asChild variant="forward" size="lg">
                  <a href={forwardHref(featuredAd, settings)} target="_blank" rel="noopener noreferrer">
                    {featuredAd.forwardLabel}
                    <ArrowUpRight />
                  </a>
                </Button>
                <Button asChild variant="hairline" size="lg">
                  <Link to={`/anuncio/${featuredAd.slug}`}>Ver ficha completa</Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
