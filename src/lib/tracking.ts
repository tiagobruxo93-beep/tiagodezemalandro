/**
 * Rastreamento de campanhas (Meta Pixel e GA4), controlado pelo painel.
 * Por padrão só carrega depois que a pessoa aceita os cookies de medição (LGPD).
 */

export const CHAVE_CONSENTIMENTO = "paitiago:aviso-cookies";
export const EVENTO_CONSENTIMENTO = "paitiago:consentimento";

type Fbq = ((...args: unknown[]) => void) & {
  callMethod?: (...args: unknown[]) => void;
  queue: unknown[][];
  push: Fbq;
  loaded: boolean;
  version: string;
};

declare global {
  interface Window {
    fbq?: Fbq;
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

export type OpcoesRastreamento = {
  metaPixel?: string;
  ga4?: string;
  exigirConsentimento?: boolean;
  autoConfig?: boolean;
  automaticMatching?: boolean;
  eventoPageView?: boolean;
  eventoContato?: boolean;
  eventoCheckout?: boolean;
};

const PADRAO = {
  exigirConsentimento: true,
  autoConfig: false,
  automaticMatching: false,
  eventoPageView: true,
  eventoContato: true,
  eventoCheckout: true,
};

let opcoes = { ...PADRAO };

export function configurarRastreamento(novo: OpcoesRastreamento) {
  const limpo: Partial<typeof PADRAO> = {};

  (Object.keys(PADRAO) as (keyof typeof PADRAO)[]).forEach((chave) => {
    const valor = novo[chave];
    if (typeof valor === "boolean") limpo[chave] = valor;
  });

  opcoes = { ...opcoes, ...limpo };
}

export function opcoesDeRastreamento() {
  return { ...opcoes };
}

export function consentimentoDeMedicao(): boolean {
  try {
    const valor = window.localStorage.getItem(CHAVE_CONSENTIMENTO);
    return valor === "aceito" || valor === "1";
  } catch {
    return false;
  }
}

export function registrarConsentimento(aceito: boolean) {
  try {
    window.localStorage.setItem(CHAVE_CONSENTIMENTO, aceito ? "aceito" : "essencial");
  } catch {
    // Sem armazenamento: vale só para esta visita.
  }
  window.dispatchEvent(new Event(EVENTO_CONSENTIMENTO));
}

/** Pode medir agora? (respeita a exigência de consentimento configurada no painel) */
export function podeMedir(): boolean {
  return !opcoes.exigirConsentimento || consentimentoDeMedicao();
}

function apenasDigitos(valor: string) {
  return (valor || "").replace(/\D/g, "");
}

let pixelAtivo = "";
let gaAtivo = "";

export function pixelCarregado() {
  return pixelAtivo;
}

export function gaCarregado() {
  return gaAtivo;
}

function carregarScript(src: string) {
  if (document.querySelector(`script[src="${src}"]`)) return;
  const script = document.createElement("script");
  script.async = true;
  script.src = src;
  document.head.appendChild(script);
}

function iniciarPixel(id: string) {
  if (!id || id === pixelAtivo) return;

  if (!window.fbq) {
    const fbq = ((...args: unknown[]) => {
      if (fbq.callMethod) fbq.callMethod(...args);
      else fbq.queue.push(args);
    }) as Fbq;
    fbq.push = fbq;
    fbq.loaded = true;
    fbq.version = "2.0";
    fbq.queue = [];
    window.fbq = fbq;
    carregarScript("https://connect.facebook.net/en_US/fbevents.js");
  }

  if (opcoes.autoConfig === false) {
    window.fbq("set", "autoConfig", false, id);
  }

  window.fbq("init", id, {}, { automaticMatching: opcoes.automaticMatching });
  pixelAtivo = id;
}

function iniciarGa4(id: string) {
  if (!id || id === gaAtivo) return;

  window.dataLayer = window.dataLayer || [];
  const gtag = (...args: unknown[]) => {
    window.dataLayer?.push(args);
  };
  window.gtag = gtag;

  gtag("js", new Date());
  gtag("config", id, { send_page_view: false });

  carregarScript(`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`);
  gaAtivo = id;
}

/** Liga o rastreamento com as opções salvas no painel. */
export function iniciarRastreamento(config: OpcoesRastreamento) {
  configurarRastreamento(config);

  if (!podeMedir()) return false;

  const pixel = apenasDigitos(config.metaPixel ?? "");
  const ga = (config.ga4 ?? "").trim();

  if (pixel) iniciarPixel(pixel);
  if (ga) iniciarGa4(ga);

  return Boolean(pixel || ga);
}

/** Carrega o pixel mesmo sem consentimento — usado só no teste do painel. */
export function testarPixel(id: string) {
  const pixel = apenasDigitos(id);
  if (!pixel) return false;

  iniciarPixel(pixel);
  return Boolean(window.fbq);
}

export function paginaVista(caminho: string) {
  if (!podeMedir() || !opcoes.eventoPageView) return;

  window.fbq?.("track", "PageView");
  window.gtag?.("event", "page_view", {
    page_path: caminho,
    page_location: window.location.href,
  });
}

export function eventoMeta(nome: string, dados?: Record<string, unknown>) {
  if (!podeMedir()) return;
  if (dados) window.fbq?.("track", nome, dados);
  else window.fbq?.("track", nome);
}

export function eventoGa(nome: string, dados?: Record<string, unknown>) {
  if (!podeMedir()) return;
  window.gtag?.("event", nome, dados ?? {});
}

export function evento(nome: string, dados?: Record<string, unknown>) {
  eventoMeta(nome, dados);
  eventoGa(nome.toLowerCase(), dados);
}

export function rastreamentoAtivo() {
  return Boolean(pixelAtivo || gaAtivo);
}
