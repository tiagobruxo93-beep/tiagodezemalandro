import { trackEvent } from "@enter-pro/analytics-sdk";
import type { Ad } from "@/lib/ads";

/** Onde o botão fica na página. Ajuda a comparar rendimento entre card, ficha e topo. */
export type AdPlacement = "hero" | "ad_card" | "ad_detail";
export type WhatsAppPlacement =
  | "header"
  | "hero"
  | "ad_detail"
  | "eventos"
  | "footer"
  | "floating_button";

function adProperties(ad: Ad) {
  return {
    ad_slug: ad.slug,
    ad_category: ad.category,
    ad_price: ad.priceLabel,
  };
}

/** Visitante abriu a página de um trabalho (endereço público ou link de anúncio pago). */
export function trackAdViewed(ad: Ad, entrada: "public" | "paid_link") {
  trackEvent("ad_viewed", {
    eventType: "custom",
    properties: { ...adProperties(ad), entry: entrada },
  });
}

/** Clique no botão principal do trabalho: checkout externo ou conversa no WhatsApp. */
export function trackAdForwardClicked(
  ad: Ad,
  placement: AdPlacement,
  channel: "checkout" | "whatsapp",
) {
  trackEvent("ad_forward_clicked", {
    eventType: "conversion",
    properties: { ...adProperties(ad), placement, channel },
  });
}

/** Clique num link direto de WhatsApp, identificando de onde ele partiu. */
export function trackWhatsAppClicked(placement: WhatsAppPlacement) {
  trackEvent("whatsapp_clicked", {
    eventType: "conversion",
    properties: { placement },
  });
}

/** Troca de aba na seção de trabalhos. */
export function trackAdsTabChanged(tab: string) {
  trackEvent("ads_tab_changed", {
    eventType: "custom",
    properties: { tab },
  });
}

/** Clique no botão da janela de entrada. */
export function trackWelcomePopupClicked(
  adSlug: string,
  destination: "ad" | "checkout" | "whatsapp",
) {
  trackEvent("welcome_popup_clicked", {
    eventType: "custom",
    properties: { ad_slug: adSlug, destination },
  });
}

/** Janela de entrada fechada sem ação. */
export function trackWelcomePopupDismissed(adSlug: string) {
  trackEvent("welcome_popup_dismissed", {
    eventType: "custom",
    properties: { ad_slug: adSlug },
  });
}

/** Código de doação do terreiro copiado. */
export function trackPixCodeCopied(method: "pix" | "link") {
  trackEvent("pix_code_copied", {
    eventType: "conversion",
    properties: { method },
  });
}
