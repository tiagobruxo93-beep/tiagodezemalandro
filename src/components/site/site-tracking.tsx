import { useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";
import type { SiteContent } from "@/lib/site-content";
import {
  EVENTO_CONSENTIMENTO,
  eventoGa,
  eventoMeta,
  iniciarRastreamento,
  paginaVista,
} from "@/lib/tracking";

function rotasBloqueadas(texto: string) {
  return (texto || "")
    .split("\n")
    .map((linha) => linha.trim().toLowerCase())
    .filter((linha) => linha.startsWith("/"));
}

/** Carrega Meta Pixel/GA4 conforme o painel e envia eventos de contato e checkout. */
export function SiteTracking({ marketing }: { marketing: SiteContent["marketing"] }) {
  const { pathname } = useLocation();
  const caminho = pathname.toLowerCase();

  const bloqueadas = useMemo(
    () => rotasBloqueadas(marketing.rotasBloqueadas),
    [marketing.rotasBloqueadas],
  );

  const noPainel =
    caminho.startsWith("/painel") ||
    bloqueadas.some((rota) => caminho === rota || caminho.startsWith(`${rota}/`));

  useEffect(() => {
    if (noPainel) return;

    const ligar = () => {
      iniciarRastreamento(marketing);
      paginaVista(pathname);
    };

    ligar();
    window.addEventListener(EVENTO_CONSENTIMENTO, ligar);
    return () => window.removeEventListener(EVENTO_CONSENTIMENTO, ligar);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, noPainel, JSON.stringify(marketing)]);

  useEffect(() => {
    const aoClicar = (evento: MouseEvent) => {
      if (noPainel) return;

      const alvo = evento.target instanceof Element ? evento.target.closest("a[href]") : null;
      if (!alvo) return;

      const href = alvo.getAttribute("href") ?? "";

      if (/wa\.me|api\.whatsapp\.com/i.test(href)) {
        if (!marketing.eventoContato) return;
        eventoMeta("Contact", { content_name: "WhatsApp" });
        eventoGa("contact_whatsapp", { link_url: href });
        return;
      }

      if (/cakto\.com/i.test(href)) {
        if (!marketing.eventoCheckout) return;
        eventoMeta("InitiateCheckout", { content_name: "Cakto" });
        eventoGa("begin_checkout", { link_url: href });
      }
    };

    document.addEventListener("click", aoClicar, true);
    return () => document.removeEventListener("click", aoClicar, true);
  }, [noPainel, marketing.eventoContato, marketing.eventoCheckout]);

  return null;
}
