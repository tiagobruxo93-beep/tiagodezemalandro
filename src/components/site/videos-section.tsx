import { Link } from "react-router-dom";
import { ArrowUpRight, Play } from "lucide-react";
import { VideoCard } from "@/components/site/video-card";
import type { FundoItem, SiteContent } from "@/lib/site-content";
import { SectionBackdrop } from "@/components/site/section-backdrop";

const LIMITE_NA_HOME = 6;

export function VideosSection({
  videos,
  fundo,
}: {
  videos: SiteContent["videos"];
  fundo?: FundoItem;
}) {
  const itens = videos.items.filter(
    (item) => item.url.trim() !== "" || item.title.trim() !== "",
  );

  if (!videos.enabled) return null;

  const mostrados = itens.slice(0, LIMITE_NA_HOME);

  return (
    <section id="videos" className="relative isolate scroll-mt-24 overflow-hidden py-20 sm:py-24">
      <SectionBackdrop fundo={fundo} />
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

        <div
          className={[
            "mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4",
            itens.length === 1 ? "lg:mx-auto lg:max-w-[440px]" : "",
            itens.length === 2 ? "lg:mx-auto lg:max-w-[880px]" : "",
          ]
            .filter(Boolean)
            .join(" ")}
        >
          {mostrados.map((item, indice) => (
            <VideoCard key={`${item.title}-${indice}`} item={item} altura={videos.alturaPlayer} />
          ))}

          {itens.length === 0 &&
            Array.from({ length: LIMITE_NA_HOME }).map((_, indice) => (
              <article
                key={`vazio-${indice}`}
                className="overflow-hidden rounded-sm border border-dashed border-border/70 bg-card/30"
              >
                <div className="relative flex aspect-video items-center justify-center border-b border-border/50 bg-[hsl(24_18%_4%)]">
                  <span className="flex h-14 w-14 items-center justify-center rounded-full border border-secondary/40 bg-background/60">
                    <Play className="h-5 w-5 text-secondary/70" />
                  </span>
                  <span className="absolute bottom-3 left-3 border border-secondary/40 px-2.5 py-1 text-[10px] uppercase tracking-[0.16em] text-secondary">
                    Em breve
                  </span>
                </div>
                <div className="p-5">
                  <h3 className="font-display text-[22px] leading-tight text-muted-foreground">
                    Vídeo do trabalho
                  </h3>
                  <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground/80">
                    Os vídeos das firmezas e das oferendas são publicados aqui.
                  </p>
                </div>
              </article>
            ))}
        </div>

        {itens.length === 0 && (
          <p className="mt-6 text-center text-[12px] leading-relaxed text-muted-foreground">
            Os primeiros vídeos já vão aparecer neste espaço. Quer receber o vídeo do
            seu trabalho? Fale com o Pai Tiago no WhatsApp.
          </p>
        )}

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/videos"
            className="inline-flex items-center gap-2 border border-secondary/50 px-6 py-3.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-foreground transition-colors hover:border-secondary hover:bg-secondary/10"
          >
            Ver todos os vídeos
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
