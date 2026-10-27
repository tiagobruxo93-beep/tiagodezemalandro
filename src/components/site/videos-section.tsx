import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { VideoCard } from "@/components/site/video-card";
import type { SiteContent } from "@/lib/site-content";

const LIMITE_NA_HOME = 3;

export function VideosSection({ videos }: { videos: SiteContent["videos"] }) {
  const itens = videos.items.filter(
    (item) => item.url.trim() !== "" || item.title.trim() !== "",
  );

  if (!videos.enabled || itens.length === 0) return null;

  const mostrados = itens.slice(0, LIMITE_NA_HOME);

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
          {mostrados.map((item, indice) => (
            <VideoCard key={`${item.title}-${indice}`} item={item} />
          ))}
        </div>

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
