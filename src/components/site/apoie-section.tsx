import { useState } from "react";
import { Check, Copy, Heart, ScanLine } from "lucide-react";
import { Button } from "@/components/ui/button";
import { QRCodeSVG } from "qrcode.react";
import { buildWhatsAppLink, type SiteSettings } from "@/lib/ads";
import { montarPix, pixConfigurado } from "@/lib/pix";
import { safeUrl } from "@/lib/security";
import type { SiteContent } from "@/lib/site-content";

/** Seção de apoio ao terreiro, com QR code gerado na hora (funciona offline). */
export function ApoieSection({
  content,
  settings,
}: {
  content: SiteContent;
  settings: SiteSettings;
}) {
  const bloco = content.apoie;
  const imagem = safeUrl(bloco.imagem, "/images/fundo-ajude.jpg");
  const opacidade = Math.min(100, Math.max(10, bloco.opacidade ?? 65)) / 100;

  const link =
    bloco.link.trim() ||
    buildWhatsAppLink(
      settings.whatsappNumber,
      "Olá, Pai Tiago! Quero ajudar o terreiro.",
    );

  const temPix = pixConfigurado(bloco.pix);
  const payload = temPix ? montarPix(bloco.pix) : link;
  const [copiado, setCopiado] = useState(false);

  const copiar = async () => {
    try {
      await navigator.clipboard.writeText(payload);
      setCopiado(true);
      window.setTimeout(() => setCopiado(false), 2500);
    } catch {
      setCopiado(false);
    }
  };

  if (!bloco.ativo) return null;

  return (
    <section
      id="apoie"
      className="relative isolate scroll-mt-24 overflow-hidden border-y border-border/60"
    >
      <img
        src={imagem}
        alt="Velas acesas no altar do terreiro"
        loading="lazy"
        style={{ opacity: opacidade }}
        className="absolute inset-0 -z-20 h-full w-full object-cover object-center"
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-background via-background/85 to-background/30" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-background via-background/25 to-background/40" />

      <div className="section-shell relative py-20 sm:py-24">
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="max-w-xl">
            <p className="eyebrow flex items-center gap-2">
              <Heart className="h-3.5 w-3.5 text-secondary" />
              {bloco.eyebrow}
            </p>

            <h2 className="mt-4 font-display text-4xl leading-[1.05] text-foreground sm:text-5xl">
              {bloco.titulo}
              <span className="mt-1 block italic text-primary">{bloco.destaque}</span>
            </h2>

            <p className="mt-5 font-display text-xl italic leading-snug text-foreground/90 sm:text-2xl">
              “{bloco.frase}”
            </p>

            <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base">
              {bloco.texto}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button asChild variant="forward" size="lg">
                <a href={link} target="_blank" rel="noopener noreferrer">
                  {bloco.botao}
                  <Heart />
                </a>
              </Button>
              <span className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                Qualquer valor · do jeito que puder
              </span>
            </div>
          </div>

          <div className="mx-auto w-full max-w-[360px]">
            <div className="rounded-sm border border-secondary/30 bg-card/60 p-4 backdrop-blur-sm">
              <div className="flex items-center justify-center bg-[hsl(38_45%_94%)] p-4">
                <QRCodeSVG
                  value={payload}
                  size={Math.min(340, Math.max(120, bloco.tamanhoQr ?? 208))}
                  level="M"
                  marginSize={2}
                  bgColor="#f3ece0"
                  fgColor="#0c0908"
                  title="QR code para ajudar o terreiro"
                />
              </div>

              <p className="mt-4 flex items-center justify-center gap-2 text-center text-[10px] uppercase tracking-[0.16em] text-secondary">
                <ScanLine className="h-3.5 w-3.5" />
                {temPix ? "Aponte a câmera e pague no seu banco" : "Aponte a câmera do celular"}
              </p>

              {temPix && (
                <button
                  type="button"
                  onClick={() => void copiar()}
                  className="mt-3 flex w-full items-center justify-center gap-2 border border-secondary/40 px-3 py-2 text-[10px] uppercase tracking-[0.14em] text-secondary transition-colors hover:border-secondary hover:bg-secondary/10 hover:text-foreground"
                >
                  {copiado ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  {copiado ? "Código copiado" : "Copiar código Pix"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
