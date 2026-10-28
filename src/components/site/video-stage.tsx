import { useEffect, useState } from "react";
import { ArrowUpRight, Play } from "lucide-react";
import { cn } from "@/lib/utils";
import { safeUrl } from "@/lib/security";
import { isDirectVideo, videoEmbedUrl, type VideoItem } from "@/lib/site-content";
import { VideoPlayer } from "@/components/site/video-player";

/**
 * Área de vídeo que assume o formato real do arquivo:
 * vídeo vertical fica em pé (sem faixas nas laterais), horizontal ocupa a largura.
 */
export function VideoStage({
  item,
  destaque = false,
}: {
  item: VideoItem;
  destaque?: boolean;
}) {
  const [aberto, setAberto] = useState(false);
  const [razao, setRazao] = useState<number | null>(null);

  const embed = videoEmbedUrl(item.url);
  const direto = isDirectVideo(item.url);
  const capa = safeUrl(item.cover, "/images/galeria-terreiro.jpg");

  // Descobre a proporção do arquivo antes de tocar (para a capa já ficar certa).
  useEffect(() => {
    if (!embed || !direto) return;

    const sonda = document.createElement("video");
    sonda.preload = "metadata";
    sonda.src = safeUrl(embed);
    sonda.onloadedmetadata = () => {
      if (sonda.videoWidth && sonda.videoHeight) {
        setRazao(sonda.videoWidth / sonda.videoHeight);
      }
    };

    return () => {
      sonda.onloadedmetadata = null;
      sonda.removeAttribute("src");
    };
  }, [embed, direto]);

  const proporcao = razao ?? 16 / 9;
  const vertical = proporcao < 0.95;

  return (
    <div
      className={cn(
        "relative flex w-full items-center justify-center overflow-hidden bg-[#0a0807]",
        vertical ? "h-[74vh] max-h-[720px] min-h-[460px]" : "aspect-video",
      )}
    >
      {aberto && embed ? (
        direto ? (
          vertical ? (
            <div
              className="flex h-full items-center justify-center"
              style={{ aspectRatio: String(proporcao) }}
            >
              <VideoPlayer src={embed} poster={item.cover} titulo={item.title} />
            </div>
          ) : (
            <div className="absolute inset-0">
              <VideoPlayer src={embed} poster={item.cover} titulo={item.title} />
            </div>
          )
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
            className={cn(
              "h-full object-cover",
              vertical ? "w-auto max-w-full" : "w-full opacity-90",
            )}
          />

          {embed ? (
            <button
              type="button"
              onClick={() => setAberto(true)}
              aria-label={`Assistir: ${item.title}`}
              className="absolute inset-0 flex items-center justify-center bg-background/30 transition-colors duration-300 hover:bg-background/10"
            >
              <span
                className={cn(
                  "flex items-center justify-center rounded-full border border-secondary/70 bg-background/70 transition-transform duration-300 hover:scale-105",
                  destaque ? "h-20 w-20" : "h-14 w-14",
                )}
              >
                <Play
                  className={cn(
                    "fill-current text-secondary",
                    destaque ? "h-7 w-7" : "h-5 w-5",
                  )}
                />
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
  );
}
