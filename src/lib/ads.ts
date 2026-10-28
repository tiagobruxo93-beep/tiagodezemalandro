import { supabase } from "@/integrations/supabase/client";
import { onlyDigits, safeUrl } from "@/lib/security";
import { idDoVisitante } from "@/lib/visits";

export type AdCategory = "coletivo" | "individual" | "consulta";
export type AdTab = AdCategory;
export type FrenteKey = AdCategory;

export interface Ad {
  id: string;
  slug: string;
  title: string;
  category: AdCategory;
  kicker: string;
  summary: string;
  description: string;
  includes: string[];
  priceLabel: string;
  imageUrl: string | null;
  videoUrl: string;
  forwardUrl: string;
  forwardLabel: string;
  badge: string | null;
  active: boolean;
  featured: boolean;
  sortOrder: number;
}

export interface SiteSettings {
  heroEyebrow: string;
  heroTitle: string;
  heroHighlight: string;
  heroSubtitle: string;
  heroImageUrl: string;
  aboutTitle: string;
  aboutText: string;
  whatsappNumber: string;
  paymentNote: string;
  footerNote: string;
}

type AdRow = {
  id: string;
  slug: string;
  title: string;
  category: string;
  kicker: string;
  summary: string;
  description: string;
  includes: string[] | null;
  price_label: string;
  image_url: string | null;
  video_url: string;
  forward_url: string;
  forward_label: string;
  badge: string | null;
  active: boolean;
  featured: boolean;
  sort_order: number;
};

type SettingsRow = {
  hero_eyebrow: string;
  hero_title: string;
  hero_highlight: string;
  hero_subtitle: string;
  hero_image_url: string;
  about_title: string;
  about_text: string;
  whatsapp_number: string;
  payment_note: string;
  footer_note: string;
};

export const DEFAULT_SETTINGS: SiteSettings = {
  heroEyebrow: "Trabalhos coletivos · Umbanda",
  heroTitle: "A força de muitos,",
  heroHighlight: "a firmeza do Seu Zé.",
  heroSubtitle:
    "Coloque seu nome na corrente de fé do terreiro. Trabalhos realizados com responsabilidade, tradição e o axé de Zé Malandro.",
  heroImageUrl: "/images/hero-altar.jpg",
  aboutTitle: "Pai Tiago de Zé Malandro",
  aboutText:
    "Sou Pai Tiago, filho de Umbanda e zelador espiritual. Há anos caminho ao lado de Seu Zé Malandro, entidade que me ensinou que a fé, a palavra e o respeito abrem qualquer porta.",
  whatsappNumber: "5511999999999",
  paymentNote: "Pagamento processado com segurança pela Cakto",
  footerNote: "Tradição, sigilo e axé em cada firmeza.",
};

export const CATEGORY_META: Record<
  AdCategory,
  { label: string; plural: string; description: string; cta: string }
> = {
  coletivo: {
    label: "Coletivo",
    plural: "Trabalhos coletivos",
    description:
      "Pedidos firmados juntos, na mesma gira. A corrente de fé deixa o trabalho acessível.",
    cta: "Quero participar",
  },
  individual: {
    label: "Individual",
    plural: "Trabalhos individuais",
    description:
      "Feitos só para você, com a atenção do Pai Tiago e sigilo total.",
    cta: "Falar no WhatsApp",
  },
  consulta: {
    label: "Consulta",
    plural: "Consultas",
    description:
      "Leituras de cartas, búzios e caminhos para clarear o próximo passo.",
    cta: "Agendar consulta",
  },
};

export const AD_TABS: { value: AdTab; label: string; hint: string }[] = [
  { value: "coletivo", label: "Coletivos", hint: "Firmezas em corrente" },
  { value: "individual", label: "Individuais", hint: "Atendimento exclusivo" },
  { value: "consulta", label: "Consultas", hint: "Leituras e orientações" },
];

export const IMAGE_LIBRARY = [
  { label: "Arte — Caixão dos Inimigos", value: "/images/arte-caixao-inimigos.jpg" },
  { label: "Arte — Cova dos Inimigos", value: "/images/arte-cova-inimigos.jpg" },
  { label: "Arte — Cruz do Desespero", value: "/images/arte-cruz-desespero.jpg" },
  { label: "Arte — Caldeirão de Maria Mulambo", value: "/images/arte-caldeirao-mulambo.jpg" },
  { label: "Arte — Broxamento", value: "/images/arte-broxamento.jpg" },
  { label: "Arte — Exu do Ouro", value: "/images/arte-exu-do-ouro.jpg" },
  { label: "Arte — Aliança de Riqueza", value: "/images/arte-alianca-riqueza.jpg" },
  { label: "Arte — Consulta de Cartas e Búzios", value: "/images/arte-cartas-buzios.jpg" },
  { label: "Arte — Abertura de Caminhos (individual)", value: "/images/arte-abertura-caminhos.jpg" },
  { label: "Arte — Quebra de Demanda (individual)", value: "/images/arte-quebra-demanda.jpg" },
  { label: "Arte — Prosperidade Individual", value: "/images/arte-prosperidade-individual.jpg" },
  { label: "Arte — Consulta de Amor", value: "/images/arte-consulta-de-amor.jpg" },
  { label: "Arte — Consulta Financeira", value: "/images/arte-consulta-financeira.jpg" },
  { label: "Altar sob a lua vermelha", value: "/images/hero-altar-art.jpg" },
  { label: "Altar de Seu Zé (foto)", value: "/images/hero-altar.jpg" },
  { label: "Abertura de caminhos (foto)", value: "/images/trabalho-caminhos.jpg" },
  { label: "Quebra de demanda (foto)", value: "/images/trabalho-demanda.jpg" },
  { label: "Nomes na corrente (foto)", value: "/images/galeria-nomes.jpg" },
  { label: "Gira no terreiro (foto)", value: "/images/galeria-terreiro.jpg" },
  { label: "Pai Tiago (foto)", value: "/images/pai-tiago.jpg" },
];

export const CATEGORY_VALUES: AdCategory[] = [
  "coletivo",
  "individual",
  "consulta",
];

function mapAd(row: AdRow): Ad {
  const category = CATEGORY_VALUES.includes(row.category as AdCategory)
    ? (row.category as AdCategory)
    : "coletivo";
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    category,
    kicker: row.kicker ?? "",
    summary: row.summary ?? "",
    description: row.description ?? "",
    includes: row.includes ?? [],
    priceLabel: row.price_label ?? "Sob consulta",
    imageUrl: row.image_url || null,
    videoUrl: row.video_url ?? "",
    forwardUrl: row.forward_url ?? "",
    forwardLabel: row.forward_label || CATEGORY_META[category].cta,
    badge: row.badge,
    active: row.active,
    featured: row.featured,
    sortOrder: row.sort_order ?? 0,
  };
}

function mapSettings(row: SettingsRow | null): SiteSettings {
  if (!row) return DEFAULT_SETTINGS;
  return {
    heroEyebrow: row.hero_eyebrow || DEFAULT_SETTINGS.heroEyebrow,
    heroTitle: row.hero_title || DEFAULT_SETTINGS.heroTitle,
    heroHighlight: row.hero_highlight || DEFAULT_SETTINGS.heroHighlight,
    heroSubtitle: row.hero_subtitle || DEFAULT_SETTINGS.heroSubtitle,
    heroImageUrl: row.hero_image_url || DEFAULT_SETTINGS.heroImageUrl,
    aboutTitle: row.about_title || DEFAULT_SETTINGS.aboutTitle,
    aboutText: row.about_text || DEFAULT_SETTINGS.aboutText,
    whatsappNumber: row.whatsapp_number || DEFAULT_SETTINGS.whatsappNumber,
    paymentNote: row.payment_note || DEFAULT_SETTINGS.paymentNote,
    footerNote: row.footer_note || DEFAULT_SETTINGS.footerNote,
  };
}

export async function fetchAds(): Promise<Ad[]> {
  const { data, error } = await supabase
    .from("spiritual_ads")
    .select("*")
    .order("category", { ascending: true })
    .order("sort_order", { ascending: true });
  if (error) throw new Error(error.message);
  return ((data ?? []) as AdRow[]).map(mapAd);
}

export async function fetchAdBySlug(slug: string): Promise<Ad | null> {
  const { data, error } = await supabase
    .from("spiritual_ads")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data ? mapAd(data as AdRow) : null;
}

export async function fetchSiteSettings(): Promise<SiteSettings> {
  const { data, error } = await supabase
    .from("spiritual_site_settings")
    .select("*")
    .eq("id", 1)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return mapSettings((data as SettingsRow | null) ?? null);
}

/**
 * Monta o link do WhatsApp.
 * Aceita o número (551899694756) ou um link pronto (https://wa.me/... , link curto
 * ou convite de grupo). Quando é link, ele é usado exatamente como foi colado.
 */
export function buildWhatsAppLink(
  valor: string,
  message = "Olá, Pai Tiago! Vim pelo site e quero saber mais sobre os trabalhos.",
) {
  const entrada = (valor || "").trim();

  if (!entrada) return "#contato";

  if (/^https?:\/\//i.test(entrada)) {
    const link = safeUrl(entrada, "#contato");

    // Em links wa.me/api.whatsapp.com sem parâmetros, já vai a mensagem pronta.
    const ehWhatsApp = /^https?:\/\/(wa\.me|api\.whatsapp\.com)\//i.test(link);
    if (ehWhatsApp && !link.includes("?") && message) {
      return `${link}?text=${encodeURIComponent(message)}`;
    }

    return link;
  }

  const digits = onlyDigits(entrada);
  if (!digits) return "#contato";

  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

export function isExternalForward(ad: Ad) {
  const endereco = ad.forwardUrl.trim();
  if (endereco === "" || !/^https?:\/\//i.test(endereco)) return false;

  try {
    const url = new URL(endereco);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

export function forwardHref(ad: Ad, settings: SiteSettings) {
  if (isExternalForward(ad)) return safeUrl(ad.forwardUrl, "#");
  const message =
    ad.category === "coletivo"
      ? `Olá, Pai Tiago! Quero participar do trabalho "${ad.title}".`
      : `Olá, Pai Tiago! Vim pelo site e quero saber mais sobre "${ad.title}".`;
  return buildWhatsAppLink(settings.whatsappNumber, message);
}

export function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "")
    .slice(0, 70);
}

const CLICKS_REGISTRADOS = new Set<string>();

export async function trackForward(adId: string, channel = "forward") {
  // Um registro por anúncio e por visita: evita spam de cliques e requisições repetidas.
  const chave = `${adId}:${channel}`;
  if (CLICKS_REGISTRADOS.has(chave)) return;
  CLICKS_REGISTRADOS.add(chave);

  try {
    const { error } = await supabase.functions.invoke("track", {
      body: {
        tipo: "clique",
        ad_id: adId,
        canal: channel.slice(0, 20),
        session_id: idDoVisitante(),
      },
    });

    if (error) {
      const status = (error as { context?: { status?: number } }).context?.status;

      if (status === 429) return;

      await supabase
        .from("spiritual_ad_clicks")
        .insert({ ad_id: adId, channel: channel.slice(0, 20) });
    }
  } catch {
    // O registro nunca deve bloquear o encaminhamento.
  }
}

export const SITE_IMAGES = {
  hero: "/images/hero-altar-art.jpg",
  gallery: "/images/galeria-terreiro.jpg",
  names: "/images/galeria-nomes.jpg",
  caminhos: "/images/trabalho-caminhos.jpg",
  demanda: "/images/trabalho-demanda.jpg",
  paiTiago: "/images/pai-tiago.jpg",
};
