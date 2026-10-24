import { useEffect } from "react";
import { SiteHeader } from "@/components/site/site-header";
import { HeroSection } from "@/components/site/hero-section";
import { HowItWorks, CorrenteBanner } from "@/components/site/how-it-works";
import { AdsTabsSection } from "@/components/site/ads-tabs-section";
import { AboutSection } from "@/components/site/about-section";
import { GalleryStrip } from "@/components/site/gallery-strip";
import { FaqSection } from "@/components/site/faq-section";
import { SiteFooter } from "@/components/site/site-footer";
import { WhatsAppFab } from "@/components/site/whatsapp-fab";
import { useAds, useSiteSettings } from "@/hooks/use-site-data";

const Index = () => {
  const { ads, loading } = useAds();
  const { settings } = useSiteSettings();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
    document.title = "Pai Tiago de Zé Malandro — Trabalhos espirituais";
  }, []);

  const featuredAd =
    ads.find((ad) => ad.featured && ad.category === "coletivo") ??
    ads.find((ad) => ad.category === "coletivo") ??
    ads[0];

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader settings={settings} />
      <main>
        <HeroSection settings={settings} featuredAd={featuredAd} />
        <HowItWorks />
        <CorrenteBanner />
        <AdsTabsSection ads={ads} settings={settings} loading={loading} />
        <AboutSection settings={settings} />
        <GalleryStrip />
        <FaqSection />
      </main>
      <SiteFooter settings={settings} />
      <WhatsAppFab settings={settings} />
    </div>
  );
};

export default Index;
