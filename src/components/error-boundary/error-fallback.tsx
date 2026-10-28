import { getErrorMessage, type FallbackProps } from "react-error-boundary";

import { Button } from "@/components/ui/button";

/** Tela de erro do site: explica e oferece recuperação (inclusive limpando cache antigo). */
export const ErrorFallback = ({ error, resetErrorBoundary }: FallbackProps) => {
  // Detalhes só no ambiente de desenvolvimento.
  const detalhes = import.meta.env.DEV ? getErrorMessage(error) : undefined;

  const limparERecarregar = () => {
    try {
      Object.keys(window.localStorage)
        .filter((chave) => chave.startsWith("paitiago:"))
        .forEach((chave) => window.localStorage.removeItem(chave));
    } catch {
      // Se o navegador bloquear o armazenamento, seguimos só recarregando.
    }

    window.location.reload();
  };

  return (
    <div
      role="alert"
      className="flex min-h-screen items-center justify-center bg-background px-5 py-14"
    >
      <div className="w-full max-w-md text-center">
        <p className="eyebrow">Um instante</p>
        <h1 className="mt-3 font-display text-4xl leading-tight text-foreground">
          Algo deu errado
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
          Não foi possível mostrar esta página agora. Tente recarregar — se
          continuar, use o botão abaixo para limpar os dados antigos guardados no
          navegador.
        </p>

        {detalhes && (
          <pre className="mt-6 whitespace-pre-wrap break-words rounded-sm border border-border/70 bg-muted p-3 text-left text-[11px] text-muted-foreground">
            {detalhes}
          </pre>
        )}

        <div className="mt-8 flex flex-col justify-center gap-2 sm:flex-row">
          <Button variant="forward" size="lg" onClick={resetErrorBoundary}>
            Tentar novamente
          </Button>
          <Button variant="hairline" size="lg" onClick={limparERecarregar}>
            Limpar dados e recarregar
          </Button>
        </div>

        <a
          href="/"
          className="mt-6 inline-block text-[10px] uppercase tracking-[0.18em] text-secondary transition-colors hover:text-foreground"
        >
          Voltar ao início
        </a>
      </div>
    </div>
  );
};
