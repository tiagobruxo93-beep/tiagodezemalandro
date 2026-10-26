import { useState } from "react";
import { safeUrl } from "@/lib/security";
import { ArrowUpRight, Play } from "lucide-react";
import { isDirectVideo, videoEmbedUrl, type SiteContent, type VideoItem } from "@/lib/site-content";

function VideoCard({ item }: { item: VideoItem }) {
  const [open, setOpen] = useState(false);
  const embed = videoEmbedUrl(item.url);

  return (
    <article className="overflow-hidden rounded-sm border border-border/70 bg-card/50">
      <div className="relative flex aspect-video items-center justify-center overflow-hidden border-b border-border/60 bg-[hsl(24_18%_4%)]">
        {open && embed ? (
          isDirectVideo(item.url) ? (
            <video
              src={safeUrl(embed)}
              controls
              autoPlay
              playsInline
              className="absolute inset-0 h-full w-full bg-black"
            />
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
            {item.cover ? (
              <img
                src={safeUrl(item.cover) || "/images/galeria-terreiro.jpg"}
                alt={item.title}
                loading="lazy"
                className="h-full w-full object-cover opacity-85"
              />
            ) : (
              <span className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                Vídeo do terreiro
              </span>
            )}

            {embed ? (
              <button
                type="button"
                onClick={() => setOpen(true)}
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
                Abrir vídeo <ArrowUpRight className="h-3 w-3" />
              </a>
            ) : (
              <span className="absolute bottom-3 left-3 border border-secondary/40 px-2.5 py-1 text-[10px] uppercase tracking-[0.16em] text-secondary">
                Em breve
              </span>
            )}
          </>
        )}
      </div>

      <h3 className="mt-5 px-5 font-display text-[22px] leading-tight text-foreground">
        {item.title}
      </h3>
      {item.text && (
        <p className="px-5 pb-5 pt-2 text-[13px] leading-relaxed text-muted-foreground">
          {item.text}
        </p>
      )}
    </article>
  );
}

export function VideosSection({ videos }: { videos: SiteContent["videos"] }) {
  if (!videos.enabled || videos.items.length === 0) return null;

  return (
    <section id="videos" className="scroll-mt-24 py-20 sm:py-24">
      <div className="section-shell">
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">{videos.eyebrow}</p>
          <h2 className="mt-4 font-display text-4xl leading-tight text-foreground sm:text-5xl">
            {videos.title}
          </h2>
          <p className="mt-5 text-sm leading-relaxed text-muted-foreground sm:text-base">
            {videos.text}
          </p>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {videos.items.map((item) => (
            <VideoCard key={`${item.title}-${item.url}`} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}
