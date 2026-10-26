import { useCallback, useEffect, useState } from "react";
import {
  DEFAULT_SETTINGS,
  fetchAdBySlug,
  fetchAds,
  fetchSiteSettings,
  type Ad,
  type SiteSettings,
} from "@/lib/ads";
import { DEFAULT_CONTENT, fetchSiteContent, type SiteContent } from "@/lib/site-content";

export function useAds() {
  const [ads, setAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchAds();
      setAds(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao carregar os trabalhos");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  return { ads, loading, error, reload };
}

export function useSiteSettings() {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);
  const [content, setContent] = useState<SiteContent>(DEFAULT_CONTENT);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    try {
      const [dados, texto] = await Promise.all([fetchSiteSettings(), fetchSiteContent()]);
      setSettings(dados);
      setContent(texto);
    } catch {
      setSettings(DEFAULT_SETTINGS);
      setContent(DEFAULT_CONTENT);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  return { settings, content, loading, reload };
}

export function useAd(slug: string | undefined) {
  const [ad, setAd] = useState<Ad | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    if (!slug) {
      setLoading(false);
      return;
    }
    setLoading(true);
    fetchAdBySlug(slug)
      .then((data) => {
        if (!active) return;
        setAd(data);
        setError(null);
      })
      .catch((err: unknown) => {
        if (!active) return;
        setError(err instanceof Error ? err.message : "Erro ao carregar o anúncio");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [slug]);

  return { ad, loading, error };
}
