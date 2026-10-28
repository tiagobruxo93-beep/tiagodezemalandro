import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { WhatsAppFab } from "@/components/site/whatsapp-fab";
import { useSiteSettings } from "@/hooks/use-site-data";

/** Estrutura comum das páginas legais (privacidade, termos e reembolso). */
export function LegalLayout({
  eyebrow,
  titulo,
  resumo,
  children,
}: {
  eyebrow: string;
  titulo: string;
  resumo: string;
  children: ReactNode;
}) {
  const { settings, content } = useSiteSettings();
  const j = content.juridico;

  const identificacao = [
    j.responsavel,
    j.documento ? `Documento: ${j.documento}` : "",
    j.cidade,
    j.email ? `Contato: ${j.email}` : "",
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader settings={settings} content={content} />

      <main className="pt-[74px]">
        <section className="border-b border-border/60">
          <div className="section-shell py-14 sm:py-16">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-secondary"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Voltar ao site
            </Link>

            <p className="eyebrow mt-6">{eyebrow}</p>
            <h1 className="mt-4 max-w-3xl font-display text-[40px] leading-[1.02] text-foreground sm:text-[54px]">
              {titulo}
            </h1>
            <p className="mt-5 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              {resumo}
            </p>

            <p className="mt-6 text-[11px] uppercase tracking-[0.14em] text-muted-foreground/80">
              {identificacao}
            </p>
            {j.atualizado && (
              <p className="mt-1 text-[11px] uppercase tracking-[0.14em] text-muted-foreground/70">
                Atualizado em {j.atualizado}
              </p>
            )}
          </div>
        </section>

        <section className="section-shell max-w-3xl py-12">
          <div className="space-y-10 text-[14px] leading-relaxed text-muted-foreground">
            {children}
          </div>

          <nav className="mt-14 flex flex-wrap gap-x-6 gap-y-3 border-t border-border/70 pt-6 text-[10px] uppercase tracking-[0.16em]">
            <Link to="/privacidade" className="text-secondary hover:text-foreground">
              Privacidade e cookies
            </Link>
            <Link to="/termos" className="text-secondary hover:text-foreground">
              Termos de uso
            </Link>
            <Link to="/reembolso" className="text-secondary hover:text-foreground">
              Reembolso e cancelamento
            </Link>
          </nav>
        </section>
      </main>

      <SiteFooter settings={settings} content={content} />
      <WhatsAppFab settings={settings} />
    </div>
  );
}

export function LegalSection({
  titulo,
  children,
}: {
  titulo: string;
  children: ReactNode;
}) {
  return (
    <div>
      <h2 className="mb-2 font-display text-[26px] leading-tight text-foreground">{titulo}</h2>
      <div className="space-y-3">{children}</div>
    </div>
  );
}
