import { Quote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { buildWhatsAppLink, type SiteSettings } from "@/lib/ads";

const STATS = [
  { value: "1.000", label: "Nomes firmados" },
  { value: "13", label: "Trabalhos ativos" },
  { value: "Toda", label: "Semana, gira" },
];

export function AboutSection({ settings }: { settings: SiteSettings }) {
  return (
    <section id="sobre" className="relative scroll-mt-24 py-20 sm:py-28">
      <div className="section-shell grid items-center gap-12 lg:grid-cols-[0.92fr_1.08fr] lg:gap-16">
        <div className="relative">
          <div className="absolute -inset-3 -z-10 border border-secondary/20" />
          <div className="relative overflow-hidden">
            <img
              src="/images/pai-tiago.jpg"
              alt="Pai Tiago de Zé Malandro no terreiro"
              loading="lazy"
              className="h-[420px] w-full object-cover object-top sm:h-[560px]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
            <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-4">
              <p className="font-display text-xl italic text-foreground/90">
                “A fé, a palavra e o respeito abrem qualquer porta.”
              </p>
              <Quote className="h-6 w-6 shrink-0 text-secondary/60" />
            </div>
          </div>
        </div>

        <div>
          <p className="eyebrow">Sobre mim</p>
          <h2 className="mt-4 font-display text-4xl leading-[1.05] text-foreground sm:text-5xl">
            {settings.aboutTitle}
          </h2>

          <div className="mt-6 space-y-4 text-sm leading-relaxed text-muted-foreground sm:text-[15px]">
            <p>{settings.aboutText}</p>
            <p>
              Criei os trabalhos coletivos para que todos tenham acesso à força
              do terreiro, independente de onde estejam. Cada nome é recebido
              com carinho e firmado com a mesma seriedade de um trabalho
              individual.
            </p>
            <p className="text-foreground/90">
              Aqui não tem promessa vazia: tem tradição, compromisso e muito axé.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-3 gap-4 border-y border-border/70 py-6">
            {STATS.map((stat) => (
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
            <a href={buildWhatsAppLink(settings.whatsappNumber)} target="_blank" rel="noreferrer">
              Conversar com o Pai Tiago
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}
