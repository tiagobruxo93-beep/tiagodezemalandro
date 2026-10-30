import { useEffect, useMemo, useRef, useState } from "react";
import { X } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { safeUrl } from "@/lib/security";
import { buildWhatsAppLink, type Ad, type SiteSettings } from "@/lib/ads";
import type { SiteContent } from "@/lib/site-content";

const CHAVE_SESSAO = "paitiago:popup-visto";
const CHAVE_DIA = "paitiago:popup-dia";

function jaVisto(frequencia: SiteContent["popup"]["frequencia"]) {
  try {
    if (frequencia === "sempre") return false;
    if (frequencia === "dia") {
      return window.localStorage.getItem(CHAVE_DIA) === new Date().toISOString().slice(0, 10);
    }
    return window.sessionStorage.getItem(CHAVE_SESSAO) === "1";
  } catch {
    return false;
  }
}

function marcarVisto(frequencia: SiteContent["popup"]["frequencia"]) {
  try {
    if (frequencia === "dia") {
      window.localStorage.setItem(CHAVE_DIA, new Date().toISOString().slice(0, 10));
      return;
    }
    if (frequencia === "sempre") return;
    window.sessionStorage.setItem(CHAVE_SESSAO, "1");
  } catch {
    // sem armazenamento: aparece de novo na próxima página
  }
}

function veioDeAnuncio() {
  try {
    const params = new URLSearchParams(window.location.search);
    return ["utm_source", "utm_medium", "utm_campaign", "gclid", "fbclid", "ttclid"].some(
      (chave) => Boolean(params.get(chave)),
    );
  } catch {
    return false;
  }
}

function combinaPublico(publico: SiteContent["popup"]["publico"]) {
  if (publico === "todos") return true;

  const celular = window.matchMedia("(max-width: 767px)").matches;
  return publico === "celular" ? celular : !celular;
}

/** Janela de entrada com um trabalho em destaque (configurada no painel). */
export function WelcomePopup({
  popup,
  ads,
  settings,
}: {
  popup: SiteContent["popup"];
  ads: Ad[];
  settings: SiteSettings;
}) {
  const [aberto, setAberto] = useState(false);
  const fecharRef = useRef<HTMLButtonElement | null>(null);

  const anuncio = useMemo(() => {
    if (!popup.ativo || ads.length === 0) return null;

    const escolhido = popup.adSlug ? ads.find((item) => item.slug === popup.adSlug) : undefined;
    if (escolhido) return escolhido;

    return (
      ads.find((item) => item.category === "individual" && item.active) ??
      ads.find((item) => item.category === "consulta" && item.active) ??
      ads.find((item) => item.featured) ??
      null
    );
  }, [popup.ativo, popup.adSlug, ads]);

  useEffect(() => {
    if (!anuncio) return;
    if (!combinaPublico(popup.publico)) return;
    if (popup.origem === "anuncio" && !veioDeAnuncio()) return;
    if (jaVisto(popup.frequencia)) return;

    const atraso = Math.min(10, Math.max(1, popup.atraso)) * 1000;
    const relogio = window.setTimeout(() => setAberto(true), atraso);

    return () => window.clearTimeout(relogio);
  }, [anuncio, popup.atraso, popup.frequencia, popup.publico, popup.origem]);

  const fechar = () => {
    marcarVisto(popup.frequencia);
    setAberto(false);
  };

  useEffect(() => {
    if (!aberto) return;

    fecharRef.current?.focus();

    const aoTeclar = (evento: KeyboardEvent) => {
      if (evento.key === "Escape") {
        marcarVisto(popup.frequencia);
        setAberto(false);
      }
    };

    document.addEventListener("keydown", aoTeclar);
    const overflowAnterior = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", aoTeclar);
      document.body.style.overflow = overflowAnterior;
    };
  }, [aberto, popup.frequencia]);

  if (!aberto || !anuncio) return null;

  const titulo = (popup.titulo ?? "").trim() || anuncio.title;
  const texto = (popup.texto ?? "").trim() || anuncio.summary;
  const imagem = (popup.imagem ?? "").trim() || anuncio.imageUrl || "";

  const destino = popup.destino ?? "anuncio";
  let href = `/anuncio/${anuncio.slug}`;
  let externo = false;

  if (destino === "checkout" && /^https?:\/\//i.test(anuncio.forwardUrl)) {
    href = anuncio.forwardUrl;
    externo = true;
  } else if (destino === "whatsapp") {
    href = buildWhatsAppLink(
      settings.whatsappNumber,
      `Olá, Pai Tiago! Vi o aviso de "${anuncio.title}" no site e quero saber mais.`,
    );
    externo = true;
  }

  const botao = externo ? (
    <a href={safeUrl(href, "#")} target="_blank" rel="noopener noreferrer" onClick={fechar}>
      {popup.botao}
    </a>
  ) : (
    <Link to={href} onClick={fechar}>
      {popup.botao}
    </Link>
  );

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-background/85 p-4 backdrop-blur-sm"
      onClick={popup.fecharFora ? fechar : undefined}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="popup-entrada-titulo"
        onClick={(evento) => evento.stopPropagation()}
        className="relative w-full max-w-md overflow-hidden border border-secondary/40 bg-card shadow-elegant"
      >
        <button
          ref={fecharRef}
          type="button"
          onClick={fechar}
          aria-label="Fechar aviso"
          className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center border border-border/70 bg-background/80 text-muted-foreground transition-colors hover:text-foreground"
        >
          <X className="h-3.5 w-3.5" />
        </button>

        {imagem && (
          <img
            src={safeUrl(imagem)}
            alt=""
            loading="eager"
            decoding="async"
            className="h-44 w-full object-cover sm:h-52"
          />
        )}

        <div className="p-6">
          <p className="eyebrow">{popup.eyebrow}</p>

          <h2
            id="popup-entrada-titulo"
            className="mt-2 font-display text-3xl leading-tight text-foreground"
          >
            {titulo}
          </h2>

          {texto && (
            <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">{texto}</p>
          )}

          {popup.mostrarPreco && anuncio.priceLabel && (
            <p className="mt-3 font-display text-2xl text-secondary">{anuncio.priceLabel}</p>
          )}

          <Button asChild variant="forward" size="lg" className="mt-5 w-full">
            {botao}
          </Button>

          <button
            type="button"
            onClick={fechar}
            className="mt-3 w-full text-center text-[11px] uppercase tracking-[0.14em] text-muted-foreground transition-colors hover:text-foreground"
          >
            Agora não
          </button>
        </div>
      </div>
    </div>
  );
}
