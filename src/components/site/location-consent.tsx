import { useEffect, useState } from "react";
import { Loader2, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CHAVE_CONSENTIMENTO, EVENTO_CONSENTIMENTO } from "@/lib/tracking";
import {
  avisoLocalizacaoJaMostrado,
  decisaoDeLocalizacao,
  recusarLocalizacao,
  registrarLocalizacaoExata,
} from "@/lib/geolocation";

/** Pergunta, uma vez, se o visitante libera a localização exata. */
export function LocationConsent() {
  const [visivel, setVisivel] = useState(false);
  const [buscando, setBuscando] = useState(false);

  useEffect(() => {
    const podePerguntar = () => {
      try {
        if (!window.localStorage.getItem(CHAVE_CONSENTIMENTO)) return false;
        if (avisoLocalizacaoJaMostrado()) return false;
      } catch {
        return false;
      }

      return decisaoDeLocalizacao() === null;
    };

    if (!podePerguntar()) return;

    // Espera o aviso de cookies fechar para não empilhar dois quadros.
    const mostrar = () => {
      if (podePerguntar()) setVisivel(true);
    };

    const relogio = window.setTimeout(mostrar, 2000);
    window.addEventListener(EVENTO_CONSENTIMENTO, mostrar);

    return () => {
      window.clearTimeout(relogio);
      window.removeEventListener(EVENTO_CONSENTIMENTO, mostrar);
    };
  }, []);

  if (!visivel) return null;

  const recusar = () => {
    recusarLocalizacao();
    setVisivel(false);
  };

  const permitir = async () => {
    setBuscando(true);
    await registrarLocalizacaoExata();
    setBuscando(false);
    setVisivel(false);
  };

  return (
    <div className="fixed inset-x-3 bottom-3 z-40 sm:inset-x-auto sm:bottom-6 sm:left-6 sm:max-w-md">
      <div className="relative border border-secondary/40 bg-card/95 p-4 shadow-elegant backdrop-blur">
        <p className="flex items-center gap-2 text-[10px] uppercase tracking-[0.16em] text-secondary">
          <MapPin className="h-3.5 w-3.5" />
          Sua localização
        </p>

        <p className="mt-2 text-[12px] leading-relaxed text-muted-foreground">
          Podemos registrar a sua localização exata para o responsável saber de
          onde vêm as visitas? O navegador vai pedir sua permissão e você pode
          recusar sem prejudicar nada no site.{" "}
          <Link to="/privacidade" className="text-secondary underline-offset-4 hover:underline">
            Ver detalhes
          </Link>
          .
        </p>

        <div className="mt-3 flex flex-wrap gap-2">
          <Button
            type="button"
            variant="forward"
            size="sm"
            onClick={() => void permitir()}
            disabled={buscando}
          >
            {buscando ? <Loader2 className="animate-spin" /> : <MapPin />}
            {buscando ? "Obtendo..." : "Permitir localização"}
          </Button>
          <Button
            type="button"
            variant="hairline"
            size="sm"
            onClick={recusar}
            disabled={buscando}
          >
            Continuar sem
          </Button>
          <Button asChild variant="ghost" size="sm">
            <Link to="/privacidade">Privacidade</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
