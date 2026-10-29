import { safeUrl } from "@/lib/security";
import type { FundoItem } from "@/lib/site-content";

/**
 * Foto de fundo da seção, com dois modos:
 * - "sobreposicao": foto suave atrás do conteúdo (com véus para leitura)
 * - "normal": foto visível, com apenas uma base escura
 */
export function SectionBackdrop({ fundo }: { fundo?: FundoItem }) {
  const url = safeUrl(fundo?.src ?? "");
  if (!url) return null;

  const opacidade = Math.min(100, Math.max(5, fundo?.opacidade ?? 65)) / 100;
  const normal = fundo?.modo === "normal";

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <img
        src={url}
        alt=""
        loading="lazy"
        style={{ opacity: opacidade }}
        className="h-full w-full object-cover"
      />

      {normal ? (
        <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-transparent to-background/80" />
      ) : (
        <>
          <div className="absolute inset-0 bg-gradient-to-b from-background/95 via-background/20 to-background" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/70 via-transparent to-background/70" />
        </>
      )}
    </div>
  );
}
