import { useEffect, useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { ManutencaoScreen } from "@/components/site/manutencao-screen";
import { WhatsAppFab } from "@/components/site/whatsapp-fab";
import { AdDetail } from "@/components/site/ad-detail";
import { useAd, useAds, useSiteSettings } from "@/hooks/use-site-data";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

const AdPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { ad, loading, error } = useAd(slug);
  const { settings, content } = useSiteSettings();
  const { ads } = useAds();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [slug]);

  useEffect(() => {
    if (ad) document.title = `${ad.title} — Pai Tiago de Zé Malandro`;
    return () => {
      document.title = "Pai Tiago de Zé Malandro — Trabalhos espirituais";
    };
  }, [ad]);

  const related = useMemo(
    () =>
      ads
        .filter((item) => item.id !== ad?.id && item.category === ad?.category)
        .slice(0, 3),
    [ads, ad],
  );

  if (content.manutencao.ativo) {
    return (
      <ManutencaoScreen settings={settings} mensagem={content.manutencao.mensagem} />
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader settings={settings} content={content} />

      {loading ? (
        <div className="section-shell pt-[140px]">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="mt-8 h-14 w-3/4" />
          <Skeleton className="mt-4 h-4 w-1/2" />
          <div className="mt-12 grid gap-8 lg:grid-cols-[1.25fr_0.75fr]">
            <Skeleton className="h-72 w-full" />
            <Skeleton className="h-72 w-full" />
          </div>
        </div>
      ) : !ad || error ? (
        <div className="section-shell flex min-h-[70vh] flex-col items-center justify-center pt-[74px] text-center">
          <p className="eyebrow">Anúncio não encontrado</p>
          <h1 className="mt-4 font-display text-4xl text-foreground sm:text-5xl">
            Esse trabalho saiu do ar
          </h1>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
            Talvez a gira tenha fechado ou o link tenha mudado. Veja os trabalhos
            disponíveis neste momento.
          </p>
          <Button asChild variant="forward" size="lg" className="mt-8">
            <Link to="/#trabalhos">Ver trabalhos disponíveis</Link>
          </Button>
        </div>
      ) : (
        <AdDetail ad={ad} settings={settings} content={content} related={related} />
      )}

      <SiteFooter settings={settings} content={content} />
      <WhatsAppFab settings={settings} />
    </div>
  );
};

export default AdPage;
