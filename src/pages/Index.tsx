import { useEffect } from "react";
import { SiteHeader } from "@/components/site/site-header";
import { HeroSection } from "@/components/site/hero-section";
import { HowItWorks, CorrenteBanner } from "@/components/site/how-it-works";
import { AdsTabsSection } from "@/components/site/ads-tabs-section";
import { AboutSection } from "@/components/site/about-section";
import { GalleryStrip } from "@/components/site/gallery-strip";
import { FaqSection } from "@/components/site/faq-section";
import { VideosSection } from "@/components/site/videos-section";
import { SiteFooter } from "@/components/site/site-footer";
import { ManutencaoScreen } from "@/components/site/manutencao-screen";
import { WhatsAppFab } from "@/components/site/whatsapp-fab";
import { useAds, useSiteSettings } from "@/hooks/use-site-data";
import type { SecaoKey } from "@/lib/site-content";

const Index = () => {
  const { ads, loading } = useAds();
  const { settings, content } = useSiteSettings();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
    document.title = "Pai Tiago de Zé Malandro — Trabalhos espirituais";
  }, []);

  if (content.manutencao.ativo) {
    return (
      <ManutencaoScreen settings={settings} mensagem={content.manutencao.mensagem} />
    );
  }

  const featuredAd =
    ads.find((ad) => ad.featured && ad.category === "coletivo") ??
    ads.find((ad) => ad.category === "coletivo") ??
    ads[0];

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader settings={settings} content={content} />
      <main>
        <HeroSection settings={settings} content={content} featuredAd={featuredAd} />

        {content.secoes.ordem.map((secao: SecaoKey) => {
          switch (secao) {
            case "trabalhos":
              return (
                <AdsTabsSection
                  key={secao}
                  ads={ads}
                  settings={settings}
                  content={content}
                  loading={loading}
                />
              );
            case "como-funciona":
              return <HowItWorks key={secao} content={content} />;
            case "corrente":
              return <CorrenteBanner key={secao} content={content} />;
            case "videos":
              return <VideosSection key={secao} videos={content.videos} />;
            case "sobre":
              return (
                <AboutSection key={secao} settings={settings} content={content} />
              );
            case "galeria":
              return <GalleryStrip key={secao} content={content} />;
            case "duvidas":
              return <FaqSection key={secao} content={content} />;
            default:
              return null;
          }
        })}
      </main>
      <SiteFooter settings={settings} content={content} />
      <WhatsAppFab settings={settings} />
    </div>
  );
};

export default Index;
