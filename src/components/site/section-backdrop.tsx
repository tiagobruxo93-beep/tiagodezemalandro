import { safeUrl } from "@/lib/security";

/** Foto de fundo suave das seções: evita áreas vazias escuras no site. */
export function SectionBackdrop({ src }: { src?: string }) {
  const url = safeUrl(src);
  if (!url) return null;

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <img
        src={url}
        alt=""
        loading="lazy"
        className="h-full w-full object-cover opacity-[0.26]"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/60 to-background" />
      <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-transparent to-background/90" />
    </div>
  );
}
