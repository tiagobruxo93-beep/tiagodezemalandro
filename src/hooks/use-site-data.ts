import { useCallback, useEffect, useState } from "react";
import {
  DEFAULT_SETTINGS,
  fetchAdByLink,
  fetchAdBySlug,
  fetchAds,
  fetchSiteSettings,
  type Ad,
  type SiteSettings,
} from "@/lib/ads";
import {
  DEFAULT_CONTENT,
  fetchSiteContent,
  mergeContent,
  type SiteContent,
} from "@/lib/site-content";
import { gravarCache, lerCache } from "@/lib/cache";

const CACHE_ANUNCIOS = "anuncios";
const CACHE_CONTEUDO = "conteudo";

/**
 * Quando o número do WhatsApp é informado, os links passam a ser diretos
 * (wa.me/NÚMERO), o que permite mensagem pronta e identificação de cada oferta.
 */
function comNumeroDeWhatsApp(settings: SiteSettings, content: SiteContent): SiteSettings {
  const digitos = (content.contato.whatsappNumero || "").replace(/\D/g, "");
  if (digitos.length < 10) return settings;

  const numero = digitos.startsWith("55") ? digitos : `55${digitos}`;
  return { ...settings, whatsappNumber: `https://wa.me/${numero}` };
}

export function useAds() {
  const [ads, setAds] = useState<Ad[]>(() => lerCache<Ad[]>(CACHE_ANUNCIOS) ?? []);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchAds();
      setAds(data);
      gravarCache(CACHE_ANUNCIOS, data);
      setError(null);
    } catch (err) {
      // Backend fora do ar: mantém a última cópia boa em vez de mostrar página vazia.
      const reserva = lerCache<Ad[]>(CACHE_ANUNCIOS);
      if (reserva) setAds(reserva);
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
  const [settings, setSettings] = useState<SiteSettings>(() => {
    const reserva = lerCache<{ settings: SiteSettings; content: SiteContent }>(CACHE_CONTEUDO);
    return reserva ? reserva.settings : DEFAULT_SETTINGS;
  });
  const [content, setContent] = useState<SiteContent>(() => {
    const reserva = lerCache<{ settings: SiteSettings; content: SiteContent }>(CACHE_CONTEUDO);
    // Mesmo com cache antigo, completa os campos novos com os padrões.
    return reserva ? mergeContent(reserva.content) : DEFAULT_CONTENT;
  });
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    try {
      const [dados, texto] = await Promise.all([fetchSiteSettings(), fetchSiteContent()]);
      const comNumero = comNumeroDeWhatsApp(dados, texto);
      setSettings(comNumero);
      setContent(texto);
      gravarCache(CACHE_CONTEUDO, { settings: comNumero, content: texto });
    } catch {
      const reserva = lerCache<{ settings: SiteSettings; content: SiteContent }>(CACHE_CONTEUDO);
      const conteudo = reserva ? mergeContent(reserva.content) : DEFAULT_CONTENT;
      setSettings(
        reserva ? comNumeroDeWhatsApp(reserva.settings, conteudo) : DEFAULT_SETTINGS,
      );
      setContent(conteudo);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  return { settings, content, loading, reload };
}

export function useAdLink(valor: string | undefined) {
  const [ad, setAd] = useState<Ad | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    if (!valor) {
      setLoading(false);
      return;
    }

    setLoading(true);
    fetchAdByLink(valor)
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
  }, [valor]);

  return { ad, loading, error };
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
