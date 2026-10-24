import { ArrowUpRight } from "lucide-react";
import { buildWhatsAppLink, type SiteSettings } from "@/lib/ads";

export function SiteFooter({ settings }: { settings: SiteSettings }) {
  return (
    <footer className="relative mt-24 border-t border-border/70">
      <div className="hairline-gold absolute inset-x-0 -top-px h-px" />
      <div className="section-shell py-14">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <p className="font-display text-2xl text-foreground">
              Pai Tiago <span className="italic text-primary">de Zé Malandro</span>
            </p>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
              {settings.footerNote} Trabalhos conduzidos com responsabilidade,
              tradição e respeito a quem procura a casa.
            </p>
          </div>

          <div>
            <p className="eyebrow">Navegar</p>
            <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
              <li>
                <a className="transition-colors hover:text-secondary" href="/#trabalhos">
                  Trabalhos
                </a>
              </li>
              <li>
                <a className="transition-colors hover:text-secondary" href="/#como-funciona">
                  Como funciona
                </a>
              </li>
              <li>
                <a className="transition-colors hover:text-secondary" href="/#sobre">
                  Sobre o Pai Tiago
                </a>
              </li>
              <li>
                <a className="transition-colors hover:text-secondary" href="/#duvidas">
                  Perguntas frequentes
                </a>
              </li>
            </ul>
          </div>

          <div>
            <p className="eyebrow">Atendimento</p>
            <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
              <li>
                <a
                  className="inline-flex items-center gap-1.5 transition-colors hover:text-secondary"
                  href={buildWhatsAppLink(settings.whatsappNumber)}
                  target="_blank"
                  rel="noreferrer"
                >
                  WhatsApp do terreiro
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </a>
              </li>
              <li>{settings.paymentNote}</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-border/60 pt-6 text-[11px] uppercase tracking-[0.18em] text-muted-foreground/70 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Pai Tiago de Zé Malandro</p>
          <p>Umbanda · Fé · Tradição</p>
        </div>
      </div>
    </footer>
  );
}
