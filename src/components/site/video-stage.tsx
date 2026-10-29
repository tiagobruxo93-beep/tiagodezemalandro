import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { safeUrl } from "@/lib/security";
import { isDirectVideo, videoEmbedUrl, type VideoItem } from "@/lib/site-content";

/**
 * Mostra o vídeo direto, no formato do próprio arquivo e sem faixas pretas:
 * vertical usa um quadro em pé com a altura vinda do painel;
 * horizontal ocupa a largura com a proporção do vídeo.
 */
export function VideoStage({
  item,
  altura = 480,
  destaque = false,
  onRazao,
}: {
  item: VideoItem;
  altura?: number;
  destaque?: boolean;
  onRazao?: (razao: number) => void;
}) {
  const [razao, setRazao] = useState<number | null>(null);

  const embed = videoEmbedUrl(item.url);
  const direto = isDirectVideo(item.url);
  const proporcao = razao ?? 16 / 9;
  const vertical = proporcao < 0.95;

  const alturaDoQuadro = destaque ? altura : Math.round(altura * 0.8);

  const conteudo = embed ? (
    direto ? (
      <video
        src={`${safeUrl(embed)}#t=0.6`}
        poster={item.cover ? safeUrl(item.cover) : undefined}
        controls
        playsInline
        preload="metadata"
        onLoadedMetadata={(evento) => {
          const video = evento.currentTarget;
          if (video.videoWidth && video.videoHeight) {
            const medida = video.videoWidth / video.videoHeight;
            setRazao(medida);
            onRazao?.(medida);
          }
        }}
        className="h-full w-full bg-black object-contain"
      />
    ) : (
      <iframe
        src={safeUrl(embed)}
        title={item.title || "Vídeo do trabalho"}
        allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="h-full w-full border-0"
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
  );

  // Horizontal: ocupa a largura, com a proporção do vídeo (sem faixas).
  if (!vertical) {
    return (
      <div
        className="relative w-full overflow-hidden bg-black"
        style={{ aspectRatio: String(proporcao) }}
      >
        {conteudo}
      </div>
    );
  }

  // Vertical: quadro em pé, centralizado, sem sobras pretas nas laterais.
  return (
    <div className="flex w-full justify-center py-4">
      <div
        className={cn("relative overflow-hidden rounded-sm bg-black shadow-elegant")}
        style={{ height: alturaDoQuadro, aspectRatio: String(proporcao) }}
      >
        {conteudo}
      </div>
    </div>
  );
}
