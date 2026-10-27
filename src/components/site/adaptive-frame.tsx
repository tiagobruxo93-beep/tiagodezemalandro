import { useState } from "react";
import { cn } from "@/lib/utils";
import { safeUrl } from "@/lib/security";

/**
 * Moldura que assume a proporção real da foto: a imagem aparece inteira,
 * preenchendo o quadro, sem faixas pretas e sem cortes.
 */
export function AdaptiveFrame({
  src,
  alt,
  className,
  imgClassName,
  priority = false,
}: {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  priority?: boolean;
}) {
  const [razao, setRazao] = useState(4 / 3);

  return (
    <div
      className={cn(
        "relative border border-secondary/30 bg-card/40 p-2 shadow-elegant sm:p-3",
        className,
      )}
    >
      <img
        src={safeUrl(src)}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        onLoad={(evento) => {
          const imagem = evento.currentTarget;
          if (!imagem.naturalWidth || !imagem.naturalHeight) return;
          const proporcao = imagem.naturalWidth / imagem.naturalHeight;
          // mantém proporções extremas sob controle (fotos muito panorâmicas ou muito altas)
          setRazao(Math.min(1.7, Math.max(0.62, proporcao)));
        }}
        style={{ aspectRatio: String(razao) }}
        className={cn("w-full object-contain", imgClassName)}
      />
      <span className="hairline-gold pointer-events-none absolute inset-x-2 top-2 h-px" />
    </div>
  );
}
