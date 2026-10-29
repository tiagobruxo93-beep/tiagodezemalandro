import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { ContentProtection } from "@/components/site/content-protection";
import { SiteTracking } from "@/components/site/site-tracking";
import { useSiteSettings } from "@/hooks/use-site-data";
import { gravarSeguranca } from "@/lib/site-security";

/** Casca comum a todas as rotas: rastreamento, proteções e página. */
export function SiteShell() {
  const { content } = useSiteSettings();
  const { metaPixel, ga4 } = content.marketing;
  const { sessaoMinutos, tentativasLogin } = content.seguranca;

  // Mantém as regras de sessão/login disponíveis antes do painel carregar.
  useEffect(() => {
    gravarSeguranca({ sessaoMinutos, tentativasLogin });
  }, [sessaoMinutos, tentativasLogin]);

  return (
    <>
      <SiteTracking metaPixel={metaPixel} ga4={ga4} />
      <ContentProtection protecao={content.protecao} />
      <Outlet />
    </>
  );
}
