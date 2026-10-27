import { Link } from "react-router-dom";
import { ArrowUpRight, Film, Flame, MoonStar, Sparkles } from "lucide-react";
import { safeUrl } from "@/lib/security";
import { Button } from "@/components/ui/button";
import {
  CATEGORY_META,
  forwardHref,
  isExternalForward,
  trackForward,
  type Ad,
  type AdCategory,
  type SiteSettings,
} from "@/lib/ads";

const FALLBACK_ICON = {
  coletivo: Flame,
  individual: Sparkles,
  consulta: MoonStar,
} as const;

function ImageFallback({
  title,
  category,
}: {
  title: string;
  category: AdCategory;
}) {
  const Icon = FALLBACK_ICON[category];
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-6">
      <div className="absolute h-40 w-40 rounded-full border border-secondary/15" />
      <div className="absolute h-56 w-56 rounded-full border border-secondary/10" />
      <div className="relative flex h-16 w-16 items-center justify-center rounded-full border border-secondary/30 bg-background/40">
        <Icon className="h-6 w-6 text-secondary/80" />
      </div>
      <span className="relative max-w-[80%] text-center font-display text-[15px] uppercase tracking-[0.22em] text-secondary/60">
        {title}
      </span>
    </div>
  );
}

export function AdCard({
  ad,
  settings,
}: {
  ad: Ad;
  settings: SiteSettings;
}) {
  const external = isExternalForward(ad);
  const meta = CATEGORY_META[ad.category];

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-sm border border-border/80 bg-card/60 transition-[border-color,transform,box-shadow] duration-300 hover:-translate-y-1 hover:border-secondary/40 hover:shadow-elegant">
      <div className="relative border-b border-border/60 bg-[radial-gradient(70%_50%_at_50%_0%,hsl(38_45%_24%_/_0.35),transparent_70%)] px-5 pb-6 pt-11">
        {ad.imageUrl ? (
          <img
            src={safeUrl(ad.imageUrl)}
            alt={ad.title}
            loading="lazy"
            className="aspect-[4/5] w-full object-contain drop-shadow-[0_22px_40px_rgba(0,0,0,0.65)]"
          />
        ) : (
          <div className="relative flex aspect-[4/5] w-full items-center justify-center">
            <ImageFallback title={ad.title} category={ad.category} />
          </div>
        )}

        {ad.badge && (
          <span className="absolute left-4 top-3 rounded-sm border border-primary/40 bg-primary/20 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.16em] text-primary-foreground backdrop-blur-sm">
            {ad.badge}
          </span>
        )}
        <span className="absolute right-4 top-3 rounded-sm border border-secondary/30 bg-background/70 px-2.5 py-1 text-[9px] uppercase tracking-[0.18em] text-secondary backdrop-blur-sm">
          {meta.label}
        </span>

        {ad.videoUrl && (
          <span className="absolute bottom-3 left-4 inline-flex items-center gap-1.5 rounded-sm border border-secondary/40 bg-background/75 px-2.5 py-1 text-[9px] uppercase tracking-[0.16em] text-secondary backdrop-blur-sm">
            <Film className="h-3 w-3" />
            Vídeo
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        {ad.kicker && (
          <p className="text-[9px] uppercase tracking-[0.24em] text-secondary/80">
            {ad.kicker}
          </p>
        )}
        <h3 className="mt-2 font-display text-[26px] leading-[1.1] text-foreground transition-colors duration-300 group-hover:text-secondary">
          <Link to={`/anuncio/${ad.slug}`} className="focus-visible:underline">
            {ad.title}
          </Link>
        </h3>
        <p className="mt-2.5 line-clamp-3 text-[13px] leading-relaxed text-muted-foreground">
          {ad.summary}
        </p>

        <div className="mt-5 flex items-end justify-between border-t border-border/60 pt-4">
          <div>
            <p className="text-[9px] uppercase tracking-[0.22em] text-muted-foreground">
              Valor
            </p>
            <p className="mt-0.5 font-display text-[24px] leading-none text-secondary">
              {ad.priceLabel}
            </p>
          </div>
          <span className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground/70">
            {external ? "Checkout seguro" : "Atendimento direto"}
          </span>
        </div>

        <div className="mt-auto flex flex-col gap-2 pt-5">
          <Button asChild variant="forward" size="lg" className="w-full">
            <a
              href={forwardHref(ad, settings)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => void trackForward(ad.id, external ? "checkout" : "whatsapp")}
            >
              {ad.forwardLabel}
              <ArrowUpRight />
            </a>
          </Button>
          <Button asChild variant="hairline" size="sm" className="w-full">
            <Link to={`/anuncio/${ad.slug}`}>Ver ficha do anúncio</Link>
          </Button>
        </div>
      </div>
    </article>
  );
}
