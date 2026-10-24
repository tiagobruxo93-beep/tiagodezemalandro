import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-5 text-center">
      <p className="eyebrow">Caminho fechado</p>
      <h1 className="mt-4 font-display text-6xl text-foreground">404</h1>
      <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
        Essa página não existe ou saiu do ar. Volte ao início e veja os
        trabalhos disponíveis na corrente.
      </p>
      <Button asChild variant="forward" size="lg" className="mt-8">
        <Link to="/">Voltar ao site</Link>
      </Button>
    </div>
  );
};

export default NotFound;
