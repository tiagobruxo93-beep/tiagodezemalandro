import { useEffect, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { safeUrl } from "@/lib/security";
import { isDirectVideo, videoEmbedUrl, type VideoItem } from "@/lib/site-content";

/**
 * Mostra o vídeo direto (sem capa antes): o próprio player aparece no card.
 * Vídeo vertical fica em pé, horizontal ocupa a largura.
 */
export function VideoStage({
  item,
  destaque = false,
}: {
  item: VideoItem;
  destaque?: boolean;
}) {
  const [razao, setRazao] = useState<number | null>(null);

  const embed = videoEmbedUrl(item.url);
  const direto = isDirectVideo(item.url);
  const vertical = (razao ?? 16 / 9) < 0.95;

  // Sonda o arquivo para já reservar o espaço no formato certo.
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

  const altura = destaque ? "h-[74vh] max-h-[760px] min-h-[460px]" : "h-[420px]";

  return (
    <div
      className={cn(
        "relative flex w-full items-center justify-center overflow-hidden bg-black",
        embed && direto && vertical ? altura : "aspect-video",
      )}
    >
      {embed ? (
        direto ? (
          <video
            src={`${safeUrl(embed)}#t=0.6`}
            controls
            playsInline
            preload="metadata"
            onLoadedMetadata={(evento) => {
              const video = evento.currentTarget;
              if (video.videoWidth && video.videoHeight) {
                setRazao(video.videoWidth / video.videoHeight);
              }
            }}
            className={cn("bg-black", vertical ? "h-full w-auto" : "h-full w-full")}
            style={vertical ? { aspectRatio: String(razao ?? 9 / 16) } : undefined}
          />
        ) : (
          <iframe
            src={safeUrl(embed)}
            title={item.title || "Vídeo do trabalho"}
            allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 h-full w-full border-0"
          />
        )
      ) : item.url ? (
        <a
          href={safeUrl(item.url, "#")}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 border border-secondary/40 px-3 py-2 text-[10px] uppercase tracking-[0.16em] text-secondary"
        >
          Abrir arquivo <ArrowUpRight className="h-3 w-3" />
        </a>
      ) : (
        <span className="border border-secondary/40 px-3 py-2 text-[10px] uppercase tracking-[0.16em] text-secondary">
          Em breve
        </span>
      )}
    </div>
  );
}
