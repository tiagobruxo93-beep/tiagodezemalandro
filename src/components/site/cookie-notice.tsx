import { useEffect, useState } from "react";
import { Cookie, X } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const CHAVE = "paitiago:aviso-cookies";

/** Aviso de cookies/preferências (o site não usa cookies de rastreamento). */
export function CookieNotice() {
  const [visivel, setVisivel] = useState(false);

  useEffect(() => {
    try {
      if (!window.localStorage.getItem(CHAVE)) setVisivel(true);
    } catch {
      // Navegador bloqueando armazenamento: não mostra o aviso.
    }
  }, []);

  const aceitar = () => {
    try {
      window.localStorage.setItem(CHAVE, "1");
    } catch {
      // sem problema: o aviso apenas volta na próxima visita
    }
    setVisivel(false);
  };

  if (!visivel) return null;

  return (
    <div className="fixed inset-x-3 bottom-3 z-40 sm:inset-x-auto sm:bottom-6 sm:left-6 sm:max-w-md">
      <div className="relative border border-border/80 bg-card/95 p-4 shadow-elegant backdrop-blur">
        <button
          type="button"
          onClick={aceitar}
          aria-label="Fechar aviso"
          className="absolute right-3 top-3 text-muted-foreground transition-colors hover:text-foreground"
        >
          <X className="h-3.5 w-3.5" />
        </button>

        <p className="flex items-center gap-2 text-[10px] uppercase tracking-[0.16em] text-secondary">
          <Cookie className="h-3.5 w-3.5" />
          Cookies e preferências
        </p>

        <p className="mt-2 text-[12px] leading-relaxed text-muted-foreground">
          Este site <strong className="text-foreground">não usa cookies de rastreamento</strong>.
          Guardamos apenas no seu próprio navegador as preferências (como o aviso já
          aceito) e um código anônimo para contar acessos, sem identificar você.{" "}
          <Link to="/privacidade" className="text-secondary underline-offset-4 hover:underline">
            Ver detalhes
          </Link>
          .
        </p>

        <div className="mt-3 flex gap-2">
          <Button type="button" variant="forward" size="sm" onClick={aceitar}>
            Entendi
          </Button>
          <Button asChild variant="ghost" size="sm">
            <Link to="/privacidade">Privacidade</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
