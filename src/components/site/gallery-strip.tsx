const PHOTOS = [
  {
    src: "/images/galeria-terreiro.jpg",
    alt: "Gira de trabalho coletivo no terreiro com velas e flores",
  },
  {
    src: "/images/galeria-nomes.jpg",
    alt: "Nomes sendo escritos para a firmeza da corrente",
  },
  {
    src: "/images/trabalho-caminhos.jpg",
    alt: "Firmeza de abertura de caminhos com velas e chaves",
  },
  {
    src: "/images/trabalho-demanda.jpg",
    alt: "Firmeza de quebra de demanda com correntes e velas",
  },
];

export function GalleryStrip() {
  return (
    <section className="py-16 sm:py-20">
      <div className="section-shell">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow">Fotos</p>
            <h2 className="mt-3 font-display text-3xl text-foreground sm:text-4xl">
              Do terreiro para você
            </h2>
          </div>
          <p className="max-w-xs text-[12px] leading-relaxed text-muted-foreground">
            Registros das firmezas, dos nomes e das oferendas preparadas em cada
            gira.
          </p>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {PHOTOS.map((photo) => (
            <div
              key={photo.src}
              className="group relative overflow-hidden border border-border/60 bg-card/40 p-2"
            >
              <img
                src={photo.src}
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
