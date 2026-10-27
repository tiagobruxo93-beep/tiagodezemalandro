import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { ManutencaoScreen } from "@/components/site/manutencao-screen";
import { WhatsAppFab } from "@/components/site/whatsapp-fab";
import { VideoCard } from "@/components/site/video-card";
import { useSiteSettings } from "@/hooks/use-site-data";

const VideosPage = () => {
  const { settings, content } = useSiteSettings();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
    document.title = "Vídeos — Pai Tiago de Zé Malandro";
    return () => {
      document.title = "Pai Tiago de Zé Malandro — Trabalhos espirituais";
    };
  }, []);

  if (content.manutencao.ativo) {
    return (
      <ManutencaoScreen settings={settings} mensagem={content.manutencao.mensagem} />
    );
  }

  const itens = content.videos.items.filter(
    (item) => item.url.trim() !== "" || item.title.trim() !== "",
  );

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader settings={settings} content={content} />

      <main className="pt-[74px]">
        <section className="relative isolate overflow-hidden border-b border-border/60">
          <div className="absolute inset-0 -z-10 bg-candle" />
          <div className="section-shell py-14 sm:py-16">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-secondary"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Voltar ao site
            </Link>

            <p className="eyebrow mt-6">{content.videos.eyebrow}</p>
            <h1 className="mt-4 max-w-3xl font-display text-[40px] leading-[1.02] text-foreground sm:text-[56px]">
              {content.videos.title}
            </h1>
            <p className="mt-5 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              {content.videos.text}
            </p>
          </div>
        </section>

        <section className="py-12 sm:py-16">
          <div className="section-shell">
            {itens.length === 0 ? (
              <div className="rounded-sm border border-dashed border-border/70 px-6 py-20 text-center">
                <p className="font-display text-2xl text-foreground">
                  Nenhum vídeo publicado ainda
                </p>
                <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
                  Os vídeos dos trabalhos aparecem aqui assim que forem enviados no
                  painel, em Conteúdo do site → Vídeos.
                </p>
                <Link
                  to="/#trabalhos"
                  className="mt-8 inline-flex items-center gap-2 border border-secondary/50 px-6 py-3.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-foreground transition-colors hover:bg-secondary/10"
                >
                  Ver os trabalhos
                </Link>
              </div>
            ) : (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {itens.map((item, indice) => (
                  <VideoCard key={`${item.title}-${indice}`} item={item} />
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <SiteFooter settings={settings} content={content} />
      <WhatsAppFab settings={settings} />
    </div>
  );
};

export default VideosPage;
