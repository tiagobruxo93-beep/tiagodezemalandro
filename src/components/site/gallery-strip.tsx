const PHOTOS = [
  {
    src: "/images/galeria-terreiro.jpg",
    alt: "Gira de trabalho coletivo no terreiro com velas e flores",
    className: "md:col-span-2 md:row-span-1",
  },
  {
    src: "/images/galeria-nomes.jpg",
    alt: "Nomes sendo escritos para a firmeza da corrente",
    className: "",
  },
  {
    src: "/images/trabalho-caminhos.jpg",
    alt: "Firmeza de abertura de caminhos com velas e chaves",
    className: "",
  },
  {
    src: "/images/trabalho-demanda.jpg",
    alt: "Firmeza de quebra de demanda com correntes e velas",
    className: "md:col-span-2",
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

        <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-3">
          {PHOTOS.map((photo) => (
            <div
              key={photo.src}
              className={`group relative overflow-hidden border border-border/60 ${photo.className}`}
            >
              <img
                src={photo.src}
                alt={photo.alt}
                loading="lazy"
                className="h-[180px] w-full object-cover opacity-85 transition-all duration-700 group-hover:scale-105 group-hover:opacity-100 sm:h-[240px]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/70 to-transparent opacity-70" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
