import { Quote } from "lucide-react";
import { safeUrl } from "@/lib/security";
import { Button } from "@/components/ui/button";
import { buildWhatsAppLink, type SiteSettings } from "@/lib/ads";
import { DEFAULT_CONTENT, type SiteContent } from "@/lib/site-content";
import { AdaptiveFrame } from "@/components/site/adaptive-frame";

export function AboutSection({
  settings,
  content,
}: {
  settings: SiteSettings;
  content: SiteContent;
}) {
  const sobre = content.sobre;
  const paragrafos = sobre.text
    .split("\n")
    .map((linha) => linha.trim())
    .filter(Boolean);

  return (
    <section id="sobre" className="relative scroll-mt-24 py-20 sm:py-28">
      <div className="section-shell grid items-center gap-12 lg:grid-cols-[0.92fr_1.08fr] lg:gap-16">
        <div className="relative">
          <div className="pointer-events-none absolute -inset-3 -z-10 border border-secondary/20" />
          <div className="relative">
            <AdaptiveFrame
              src={safeUrl(sobre.image) || DEFAULT_CONTENT.sobre.image}
              alt={sobre.title}
            />
            <div className="pointer-events-none absolute inset-x-2 bottom-2 top-auto h-1/3 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between gap-4">
              <p className="font-display text-xl italic text-foreground/90">
                “{sobre.quote}”
              </p>
              <Quote className="h-6 w-6 shrink-0 text-secondary/60" />
            </div>
          </div>
        </div>

        <div>
          <p className="eyebrow">{sobre.eyebrow}</p>
          <h2 className="mt-4 font-display text-4xl leading-[1.05] text-foreground sm:text-5xl">
            {sobre.title}
          </h2>

          <div className="mt-6 space-y-4 text-sm leading-relaxed text-muted-foreground sm:text-[15px]">
            {paragrafos.map((paragrafo, index) => (
              <p key={index}>{paragrafo}</p>
            ))}
          </div>

          <div className="mt-10 grid grid-cols-3 gap-4 border-y border-border/70 py-6">
            {sobre.stats.map((stat) => (
              <div key={stat.label}>
                <p className="font-display text-3xl leading-none text-secondary sm:text-4xl">
                  {stat.value}
                </p>
                <p className="mt-2 text-[9px] uppercase leading-tight tracking-[0.18em] text-muted-foreground">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>

          <Button asChild variant="outline" size="lg" className="mt-8">
            <a href={buildWhatsAppLink(settings.whatsappNumber)} target="_blank" rel="noopener noreferrer">
              {sobre.button}
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}
