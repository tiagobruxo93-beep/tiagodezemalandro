import { Suspense, useEffect, useRef, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { BlockedScreen } from "@/components/site/blocked-screen";
import { ContentProtection } from "@/components/site/content-protection";
import { SiteTracking } from "@/components/site/site-tracking";
import { useSiteSettings } from "@/hooks/use-site-data";
import { gravarSeguranca } from "@/lib/site-security";
import { registrarVisitante } from "@/lib/visitor";

/** Mostrado enquanto a página aberta termina de carregar (rotas fora da home). */
function CarregandoPagina() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center bg-background">
      <p className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
        Carregando
      </p>
    </div>
  );
}

/** Casca comum a todas as rotas: rastreamento, proteções e página. */
export function SiteShell() {
  const { content } = useSiteSettings();
  const { sessaoMinutos, tentativasLogin, exigirSenhaForte } = content.seguranca;
  const { pathname } = useLocation();
  const [bloqueado, setBloqueado] = useState(false);
  const primeiraPagina = useRef(true);

  // Registra quem está acessando (IP, aparelho, localização aproximada).
  // Se o IP estiver na lista de bloqueio, o site não abre.
  useEffect(() => {
    if (pathname.startsWith("/painel")) return;

    let ativo = true;
    const primeira = primeiraPagina.current;
    primeiraPagina.current = false;

    void registrarVisitante({ pagina: !primeira })
      .then((resultado) => {
        if (ativo) setBloqueado(Boolean(resultado.bloqueado));
      })
      .catch(() => undefined);

    return () => {
      ativo = false;
    };
  }, [pathname]);

  // Se alguém abrir por http://, manda para a versão segura (evita o aviso "Não seguro").
  useEffect(() => {
    if (typeof window === "undefined") return;
    const local = /^(localhost|127\.0\.0\.1|0\.0\.0\.0)$/i.test(window.location.hostname);

    if (window.location.protocol === "http:" && !local) {
      window.location.replace(
        `https://${window.location.host}${window.location.pathname}${window.location.search}`,
      );
    }
  }, []);

  // Mantém as regras de sessão/login disponíveis antes do painel carregar.
  useEffect(() => {
    gravarSeguranca({ sessaoMinutos, tentativasLogin, exigirSenhaForte });
  }, [sessaoMinutos, tentativasLogin, exigirSenhaForte]);

  // Endereço canônico por página: evita o Google tratar cada rota como duplicata.
  useEffect(() => {
    if (pathname.startsWith("/painel")) return;

    const existente = document.querySelector('link[rel="canonical"]');
    const link = existente ?? document.createElement("link");
    link.setAttribute("rel", "canonical");
    link.setAttribute("href", `${window.location.origin}${pathname}`);
    if (!existente) document.head.appendChild(link);
  }, [pathname]);

  return (
    <>
      <SiteTracking marketing={content.marketing} />
      <ContentProtection protecao={content.protecao} />
      {bloqueado ? (
        <BlockedScreen />
      ) : (
        <Suspense fallback={<CarregandoPagina />}>
          <Outlet />
        </Suspense>
      )}
    </>
  );
}
