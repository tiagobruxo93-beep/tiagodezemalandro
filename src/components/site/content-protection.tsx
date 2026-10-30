import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import type { SiteContent } from "@/lib/site-content";

/**
 * Proteções de conteúdo controladas pelo painel: menu do botão direito,
 * cópia/seleção de texto, arrastar imagens e bloqueio de indexação no Google.
 * São barreiras de dissuasão — nenhum navegador consegue impedir 100% a cópia
 * de algo que já foi exibido na tela.
 */
export function ContentProtection({ protecao }: { protecao: SiteContent["protecao"] }) {
  const { pathname } = useLocation();
  const noPainel = pathname.startsWith("/painel");

  useEffect(() => {
    if (noPainel || !protecao.bloquearBotaoDireito) return;

    const bloquear = (evento: MouseEvent) => evento.preventDefault();
    document.addEventListener("contextmenu", bloquear);
    return () => document.removeEventListener("contextmenu", bloquear);
  }, [noPainel, protecao.bloquearBotaoDireito]);

  useEffect(() => {
    if (noPainel || !protecao.bloquearCopia) return;

    const bloquear = (evento: Event) => evento.preventDefault();
    document.addEventListener("copy", bloquear);
    document.addEventListener("cut", bloquear);

    const anterior = document.body.style.userSelect;
    document.body.style.userSelect = "none";

    return () => {
      document.removeEventListener("copy", bloquear);
      document.removeEventListener("cut", bloquear);
      document.body.style.userSelect = anterior;
    };
  }, [noPainel, protecao.bloquearCopia]);

  useEffect(() => {
    if (noPainel || !protecao.bloquearInspecao) return;

    const bloquearAtalhos = (evento: KeyboardEvent) => {
      const tecla = evento.key.toLowerCase();
      const comando = evento.ctrlKey || evento.metaKey;

      if (evento.key === "F12") {
        evento.preventDefault();
        return;
      }

      if (comando && evento.shiftKey && ["i", "j", "c", "k"].includes(tecla)) {
        evento.preventDefault();
        return;
      }

      if (comando && tecla === "u") {
        evento.preventDefault();
      }
    };

    document.addEventListener("keydown", bloquearAtalhos, true);
    return () => document.removeEventListener("keydown", bloquearAtalhos, true);
  }, [noPainel, protecao.bloquearInspecao]);

  useEffect(() => {
    if (noPainel || !protecao.bloquearArrastarImagem) return;

    const bloquear = (evento: DragEvent) => {
      if (evento.target instanceof HTMLImageElement) evento.preventDefault();
    };
    document.addEventListener("dragstart", bloquear);
    return () => document.removeEventListener("dragstart", bloquear);
  }, [noPainel, protecao.bloquearArrastarImagem]);

  useEffect(() => {
    if (noPainel) return;

    if (!protecao.noindex) return;

    const meta = document.createElement("meta");
    meta.name = "robots";
    meta.content = "noindex, nofollow";
    meta.dataset.painel = "noindex";
    document.head.appendChild(meta);

    return () => meta.remove();
  }, [noPainel, protecao.noindex]);

  return null;
}
