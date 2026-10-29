import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { safeUrl } from "@/lib/security";
import type { VideoItem } from "@/lib/site-content";
import { VideoStage } from "@/components/site/video-stage";

/** Card de vídeo na grade. */
export function VideoCard({ item, altura }: { item: VideoItem; altura?: number }) {
  const link = item.link.trim();

  return (
    <article className="flex flex-col overflow-hidden rounded-sm border border-border/70 bg-card/50">
      <VideoStage item={item} altura={altura} />

      <div className="flex flex-1 flex-col p-5">
        {item.text && (
          <p className="text-[13px] leading-relaxed text-muted-foreground">{item.text}</p>
        )}

        {link && (
          <div className="mt-5 flex flex-wrap gap-2 border-t border-border/60 pt-4">
            {link.startsWith("/") ? (
              <Link
                to={link}
                className="inline-flex items-center gap-2 border border-secondary/40 px-3.5 py-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-secondary transition-colors hover:border-secondary hover:bg-secondary/10 hover:text-foreground"
              >
                Ver o trabalho <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            ) : (
              <a
                href={safeUrl(link, "#")}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 border border-secondary/40 px-3.5 py-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-secondary transition-colors hover:border-secondary hover:bg-secondary/10 hover:text-foreground"
              >
                Ver o trabalho <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
            )}
          </div>
        )}
      </div>
    </article>
  );
}

/** Vídeo em destaque: ocupa a largura toda, no tamanho de um anúncio. */
export function VideoSpotlight({ item, altura }: { item: VideoItem; altura?: number }) {
  const link = item.link.trim();

  return (
    <article className="overflow-hidden rounded-sm border border-border/70 bg-card/50">
      <VideoStage item={item} altura={altura} destaque />

      <div className="flex flex-col gap-4 p-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-2xl">
          {item.text && (
            <p className="text-[13px] leading-relaxed text-muted-foreground">
              {item.text}
            </p>
          )}
        </div>

        {link && (
          <Link
            to={link.startsWith("/") ? link : "#"}
            className="inline-flex shrink-0 items-center gap-2 border border-secondary/40 px-4 py-2.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-secondary transition-colors hover:border-secondary hover:bg-secondary/10 hover:text-foreground"
          >
            Ver o trabalho <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        )}
      </div>
    </article>
  );
}
