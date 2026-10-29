import { ArrowUpRight, Sparkles, ShieldCheck, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { buildWhatsAppLink, type SiteSettings } from "@/lib/ads";
import { safeUrl } from "@/lib/security";
import type { SiteContent } from "@/lib/site-content";

const ICONES = [Crown, Sparkles, ShieldCheck];

/** Contato profissional: presença VIP em eventos, com encaminhamento ao WhatsApp. */
export function EventosSection({
  content,
  settings,
}: {
  content: SiteContent;
  settings: SiteSettings;
}) {
  const bloco = content.eventos;
  const imagem = safeUrl(bloco.imagem, "/images/fundo-evento.jpg");
  const opacidade = Math.min(100, Math.max(10, bloco.opacidade ?? 70)) / 100;

  if (!bloco.ativo) return null;

  return (
    <section id="eventos" className="relative isolate scroll-mt-24 overflow-hidden border-y border-border/60">
      <img
        src={imagem}
        alt="Preparação de ritual para evento privado"
        loading="lazy"
        style={{ opacity: opacidade }}
        className="absolute inset-0 -z-20 h-full w-full object-cover object-center"
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-background via-background/85 to-background/20" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-background via-background/20 to-background/40" />

      <div className="section-shell relative py-20 sm:py-24">
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="max-w-xl">
            <p className="eyebrow">{bloco.eyebrow}</p>
            <h2 className="mt-4 font-display text-4xl leading-[1.05] text-foreground sm:text-5xl">
              {bloco.titulo}
              <span className="mt-1 block italic text-primary">{bloco.destaque}</span>
            </h2>
            <p className="mt-5 max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base">
              {bloco.texto}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button asChild variant="forward" size="lg">
                <a
                  href={buildWhatsAppLink(settings.whatsappNumber, bloco.mensagem)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {bloco.botao}
                  <ArrowUpRight />
                </a>
              </Button>
              <span className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                Hora marcada · deslocamento combinado
              </span>
            </div>
          </div>

          <div className="space-y-3">
            {bloco.beneficios.map((item, indice) => {
              const Icone = ICONES[indice % ICONES.length];
              return (
                <div
                  key={`${item.titulo}-${indice}`}
                  className="flex items-start gap-3 border border-border/70 bg-card/50 p-4 backdrop-blur-sm"
                >
                  <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-secondary/40 text-secondary">
                    <Icone className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="font-display text-lg leading-tight text-foreground">
                      {item.titulo}
                    </p>
                    <p className="mt-1 text-[12px] leading-relaxed text-muted-foreground">
                      {item.texto}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
