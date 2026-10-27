import { safeUrl } from "@/lib/security";
import { DEFAULT_CONTENT, type SiteContent } from "@/lib/site-content";

function GalleryItem({ foto }: { foto: { url: string; alt: string } }) {
  return (
    <div className="group relative overflow-hidden border border-border/60 bg-card/40 p-2">
      <div className="flex aspect-[4/5] items-center justify-center">
        <img
          src={foto.url}
          alt={foto.alt}
          loading="lazy"
          className="max-h-full w-full object-contain opacity-90 transition-opacity duration-700 group-hover:opacity-100"
        />
      </div>
    </div>
  );
}

export function GalleryStrip({ content }: { content: SiteContent }) {
  const galeria = content.galeria;
  const padrao = DEFAULT_CONTENT.galeria.photos;

  // Fotos sem endereço válido caem de volta para a imagem padrão do tema,
  // assim a galeria nunca aparece quebrada no site.
  const fotos = galeria.photos
    .map((photo, indice) => {
      const propria = safeUrl(photo.url);
      const reserva = padrao[indice] ? padrao[indice].url : "";
      const url = propria || reserva;

      if (!url) return null;

      return {
        url,
        alt: photo.alt || (padrao[indice] ? padrao[indice].alt : ""),
      };
    })
    .filter((item): item is { url: string; alt: string } => item !== null);

  if (fotos.length === 0) return null;

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
          {fotos.map((foto, indice) => (
            <GalleryItem key={`${foto.url}-${indice}`} foto={foto} />
          ))}
        </div>
      </div>
    </section>
  );
}
