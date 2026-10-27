import { supabase } from "@/integrations/supabase/client";
import type { Ad, SiteSettings } from "@/lib/ads";

export type AdDraft = {
  slug: string;
  title: string;
  category: string;
  kicker: string;
  summary: string;
  description: string;
  includes: string[];
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

export function adToDraft(ad: Ad): AdDraft {
  return {
    slug: ad.slug,
    title: ad.title,
    category: ad.category,
    kicker: ad.kicker,
    summary: ad.summary,
    description: ad.description,
    includes: ad.includes,
    price_label: ad.priceLabel,
    image_url: ad.imageUrl,
    video_url: ad.videoUrl,
    forward_url: ad.forwardUrl,
    forward_label: ad.forwardLabel,
    badge: ad.badge,
    active: ad.active,
    featured: ad.featured,
    sort_order: ad.sortOrder,
  };
}

export function emptyDraft(sortOrder: number): AdDraft {
  return {
    slug: "",
    title: "",
    category: "coletivo",
    kicker: "",
    summary: "",
    description: "",
    includes: [],
    price_label: "",
    image_url: null,
    video_url: "",
    forward_url: "",
    forward_label: "Quero participar",
    badge: null,
    active: true,
    featured: false,
    sort_order: sortOrder,
  };
}

function clean(draft: AdDraft) {
  return {
    ...draft,
    slug: draft.slug.trim(),
    title: draft.title.trim(),
    kicker: draft.kicker.trim(),
    summary: draft.summary.trim(),
    description: draft.description.trim(),
    price_label: draft.price_label.trim() || "Sob consulta",
    forward_url: draft.forward_url.trim(),
    forward_label: draft.forward_label.trim() || "Quero participar",
    badge: draft.badge?.trim() ? draft.badge.trim() : null,
    image_url: draft.image_url?.trim() ? draft.image_url.trim() : null,
    video_url: draft.video_url.trim(),
  };
}

export async function createAd(draft: AdDraft) {
  const { data, error } = await supabase
    .from("spiritual_ads")
    .insert(clean(draft))
    .select("id")
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data;
}

export async function updateAd(id: string, draft: AdDraft) {
  const { error } = await supabase
    .from("spiritual_ads")
    .update(clean(draft))
    .eq("id", id);
  if (error) throw new Error(error.message);
}

export async function deleteAd(id: string) {
  const { error } = await supabase.from("spiritual_ads").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

export async function toggleAdActive(ad: Ad) {
  const { error } = await supabase
    .from("spiritual_ads")
    .update({ active: !ad.active })
    .eq("id", ad.id);
  if (error) throw new Error(error.message);
}

export async function toggleAdFeatured(ad: Ad) {
  const { error } = await supabase
    .from("spiritual_ads")
    .update({ featured: !ad.featured })
    .eq("id", ad.id);
  if (error) throw new Error(error.message);
}

export async function reorderAd(ad: Ad, direction: "up" | "down", siblings: Ad[]) {
  const ordered = [...siblings].sort((a, b) => a.sortOrder - b.sortOrder);
  const index = ordered.findIndex((item) => item.id === ad.id);
  const target = direction === "up" ? index - 1 : index + 1;
  if (index < 0 || target < 0 || target >= ordered.length) return;

  const swap = ordered[target];
  const updates = [
    supabase.from("spiritual_ads").update({ sort_order: target + 1 }).eq("id", ad.id),
    supabase.from("spiritual_ads").update({ sort_order: index + 1 }).eq("id", swap.id),
  ];
  const results = await Promise.all(updates);
  const failed = results.find((result) => result.error);
  if (failed?.error) throw new Error(failed.error.message);
}

export async function duplicateAd(ad: Ad) {
  const suffix = Math.random().toString(36).slice(2, 6);
  const { error } = await supabase.from("spiritual_ads").insert({
    ...adToDraft(ad),
    slug: `${ad.slug}-copia-${suffix}`,
    title: `${ad.title} (cópia)`,
    active: false,
    featured: false,
    sort_order: ad.sortOrder + 1,
  });
  if (error) throw new Error(error.message);
}

export async function fetchClickCounts(): Promise<{
  byAd: Record<string, number>;
  total: number;
}> {
  const { data, error } = await supabase
    .from("spiritual_ad_clicks")
    .select("ad_id");
  if (error) return { byAd: {}, total: 0 };
  const byAd: Record<string, number> = {};
  (data ?? []).forEach((row: { ad_id: string }) => {
    byAd[row.ad_id] = (byAd[row.ad_id] ?? 0) + 1;
  });
  const total = Object.values(byAd).reduce((sum, value) => sum + value, 0);
  return { byAd, total };
}

export async function saveSettings(settings: SiteSettings) {
  const { error } = await supabase
    .from("spiritual_site_settings")
    .update({
      hero_eyebrow: settings.heroEyebrow,
      hero_title: settings.heroTitle,
      hero_highlight: settings.heroHighlight,
      hero_subtitle: settings.heroSubtitle,
      hero_image_url: settings.heroImageUrl,
      about_title: settings.aboutTitle,
      about_text: settings.aboutText,
      whatsapp_number: settings.whatsappNumber,
      payment_note: settings.paymentNote,
      footer_note: settings.footerNote,
    })
    .eq("id", 1);
  if (error) throw new Error(error.message);
}

export async function checkAdminAccess(): Promise<boolean> {
  const { data, error } = await supabase.rpc("spiritual_claim_admin");
  if (error) return false;
  return Boolean(data);
}
