import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, Play } from "lucide-react";
import { safeUrl } from "@/lib/security";
import { isDirectVideo, videoEmbedUrl, type VideoItem } from "@/lib/site-content";
import { VideoPlayer } from "@/components/site/video-player";

/** Card de vídeo: mostra a capa, toca no lugar e liga ao trabalho relacionado. */
export function VideoCard({ item }: { item: VideoItem }) {
  const [aberto, setAberto] = useState(false);
  const embed = videoEmbedUrl(item.url);
  const capa = safeUrl(item.cover, "/images/galeria-terreiro.jpg");
  const link = item.link.trim();

  return (
    <article className="flex flex-col overflow-hidden rounded-sm border border-border/70 bg-card/50">
      <div className="relative flex aspect-video items-center justify-center overflow-hidden border-b border-border/60 bg-[hsl(24_18%_4%)]">
        {aberto && embed ? (
          isDirectVideo(item.url) ? (
            <div className="absolute inset-0">
              <VideoPlayer src={embed} poster={item.cover} titulo={item.title} />
            </div>
          ) : (
            <iframe
              src={safeUrl(embed)}
              title={item.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 h-full w-full border-0"
            />
          )
        ) : (
          <>
            <img
              src={capa}
              alt={item.title}
              loading="lazy"
              className="h-full w-full object-cover opacity-85"
            />

            {embed ? (
              <button
                type="button"
                onClick={() => setAberto(true)}
                aria-label={`Assistir: ${item.title}`}
                className="absolute inset-0 flex items-center justify-center bg-background/35 transition-colors duration-300 hover:bg-background/15"
              >
                <span className="flex h-14 w-14 items-center justify-center rounded-full border border-secondary/70 bg-background/70 transition-transform duration-300 hover:scale-105">
                  <Play className="h-5 w-5 fill-current text-secondary" />
                </span>
              </button>
            ) : item.url ? (
              <a
                href={safeUrl(item.url, "#")}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 border border-secondary/40 px-2.5 py-1 text-[10px] uppercase tracking-[0.16em] text-secondary backdrop-blur-sm"
              >
                Abrir arquivo <ArrowUpRight className="h-3 w-3" />
              </a>
            ) : (
              <span className="absolute bottom-3 left-3 border border-secondary/40 px-2.5 py-1 text-[10px] uppercase tracking-[0.16em] text-secondary">
                Em breve
              </span>
            )}
          </>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-[22px] leading-tight text-foreground">{item.title}</h3>

        {item.text && (
          <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">{item.text}</p>
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
export function VideoSpotlight({ item }: { item: VideoItem }) {
  const [aberto, setAberto] = useState(false);
  const embed = videoEmbedUrl(item.url);
  const capa = safeUrl(item.cover, "/images/galeria-terreiro.jpg");
  const link = item.link.trim();

  return (
    <article className="overflow-hidden rounded-sm border border-border/70 bg-card/50">
      <div className="relative aspect-video w-full overflow-hidden bg-[hsl(24_18%_4%)]">
        {aberto && embed ? (
          isDirectVideo(item.url) ? (
            <VideoPlayer src={embed} poster={item.cover} titulo={item.title} />
          ) : (
            <iframe
              src={safeUrl(embed)}
              title={item.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 h-full w-full border-0"
            />
          )
        ) : (
          <>
            <img
              src={capa}
              alt={item.title}
              className="h-full w-full object-cover opacity-90"
            />

            {embed ? (
              <button
                type="button"
                onClick={() => setAberto(true)}
                aria-label={`Assistir: ${item.title}`}
                className="absolute inset-0 flex items-center justify-center bg-background/30 transition-colors duration-300 hover:bg-background/10"
              >
                <span className="flex h-20 w-20 items-center justify-center rounded-full border border-secondary/70 bg-background/70 transition-transform duration-300 hover:scale-105">
                  <Play className="h-7 w-7 fill-current text-secondary" />
                </span>
              </button>
            ) : item.url ? (
              <a
                href={safeUrl(item.url, "#")}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute bottom-4 left-4 inline-flex items-center gap-1.5 border border-secondary/40 px-2.5 py-1 text-[10px] uppercase tracking-[0.16em] text-secondary backdrop-blur-sm"
              >
                Abrir arquivo <ArrowUpRight className="h-3 w-3" />
              </a>
            ) : (
              <span className="absolute bottom-4 left-4 border border-secondary/40 px-2.5 py-1 text-[10px] uppercase tracking-[0.16em] text-secondary">
                Em breve
              </span>
            )}
          </>
        )}
      </div>

      <div className="flex flex-col gap-4 p-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-2xl">
          <h3 className="font-display text-2xl leading-tight text-foreground sm:text-3xl">
            {item.title}
          </h3>
          {item.text && (
            <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">
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
