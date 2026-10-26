import type { SiteContent } from "@/lib/site-content";

export function GalleryStrip({ content }: { content: SiteContent }) {
  const galeria = content.galeria;

  if (galeria.photos.length === 0) return null;

  return (
    <section className="py-16 sm:py-20">
      <div className="section-shell">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow">Fotos</p>
            <h2 className="mt-3 font-display text-3xl text-foreground sm:text-4xl">
              {galeria.title}
            </h2>
          </div>
          <p className="max-w-xs text-[12px] leading-relaxed text-muted-foreground">
            {galeria.text}
          </p>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {galeria.photos.map((photo, index) => (
            <div
              key={`${photo.url}-${index}`}
              className="group relative overflow-hidden border border-border/60 bg-card/40 p-2"
            >
              <img
                src={photo.url}
                alt={photo.alt}
                loading="lazy"
                className="aspect-square w-full object-contain opacity-90 transition-opacity duration-700 group-hover:opacity-100"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
