import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useSiteSettings } from "@/hooks/use-site-data";
import {
  EVENTO_CONSENTIMENTO,
  eventoGa,
  eventoMeta,
  iniciarRastreamento,
  paginaVista,
} from "@/lib/tracking";

/** Carrega Meta Pixel/GA4 conforme o painel e envia eventos de contato e checkout. */
export function SiteTracking() {
  const { content } = useSiteSettings();
  const { pathname } = useLocation();

  const metaPixel = content.marketing.metaPixel;
  const ga4 = content.marketing.ga4;
  const noPainel = pathname.startsWith("/painel");

  useEffect(() => {
    if (noPainel) return;

    const ligar = () => {
      iniciarRastreamento({ metaPixel, ga4 });
      paginaVista(pathname);
    };

    ligar();
    window.addEventListener(EVENTO_CONSENTIMENTO, ligar);
    return () => window.removeEventListener(EVENTO_CONSENTIMENTO, ligar);
  }, [pathname, metaPixel, ga4, noPainel]);

  useEffect(() => {
    const aoClicar = (evento: MouseEvent) => {
      const alvo = evento.target instanceof Element ? evento.target.closest("a[href]") : null;
      if (!alvo) return;

      const href = alvo.getAttribute("href") ?? "";

      if (/wa\.me|api\.whatsapp\.com/i.test(href)) {
        eventoMeta("Contact", { content_name: "WhatsApp" });
        eventoGa("contact_whatsapp", { link_url: href });
        return;
      }

      if (/cakto\.com/i.test(href)) {
        eventoMeta("InitiateCheckout", { content_name: "Cakto" });
        eventoGa("begin_checkout", { link_url: href });
      }
    };

    document.addEventListener("click", aoClicar, true);
    return () => document.removeEventListener("click", aoClicar, true);
  }, []);

  return null;
}
