import { safeUrl } from "@/lib/security";

/** Foto de fundo suave das seções: evita áreas vazias escuras no site. */
export function SectionBackdrop({
  src,
  opacidade = 45,
}: {
  src?: string;
  opacidade?: number;
}) {
  const url = safeUrl(src);
  if (!url) return null;

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <img
        src={url}
        alt=""
        loading="lazy"
        style={{ opacity: Math.min(0.9, Math.max(0.05, opacidade / 100)) }}
        className="h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-background/95 via-background/20 to-background" />
      <div className="absolute inset-0 bg-gradient-to-r from-background/70 via-transparent to-background/70" />
    </div>
  );
}
