import { useEffect, useState } from "react";
import { Eye, Loader2, RefreshCw, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { fetchResumoAcessos, type ResumoAcessos } from "@/lib/visits";

export function VisitsPanel() {
  const [dados, setDados] = useState<ResumoAcessos | null>(null);
  const [carregando, setCarregando] = useState(true);

  const carregar = async () => {
    setCarregando(true);
    setDados(await fetchResumoAcessos());
    setCarregando(false);
  };

  useEffect(() => {
    void carregar();
  }, []);

  const maior = Math.max(1, ...(dados?.dias ?? []).map((dia) => dia.total));

  const numeros = [
    { rotulo: "Acessos totais", valor: dados?.total ?? 0, destaque: true },
    { rotulo: "Hoje", valor: dados?.hoje ?? 0 },
    { rotulo: "Últimos 7 dias", valor: dados?.semana ?? 0 },
    { rotulo: "Visitantes únicos", valor: dados?.unicos ?? 0 },
  ];

  return (
    <section className="border border-border/70 bg-card/40 p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="eyebrow">Acessos ao site</p>
          <h2 className="mt-2 flex items-center gap-2 font-display text-2xl text-foreground">
            <Eye className="h-5 w-5 text-secondary" />
            Quantas pessoas abriram o link
          </h2>
          <p className="mt-1 max-w-xl text-[11px] leading-relaxed text-muted-foreground">
            Contagem anônima: guarda apenas a data, a página e um código aleatório
            do navegador — sem IP, sem nome, sem e-mail.
          </p>
        </div>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => void carregar()}
          disabled={carregando}
        >
          {carregando ? <Loader2 className="animate-spin" /> : <RefreshCw />}
          Atualizar
        </Button>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {numeros.map((item) => (
          <div
            key={item.rotulo}
            className="border border-border/60 bg-background/40 px-4 py-3"
          >
            <p className="text-[9px] uppercase tracking-[0.16em] text-muted-foreground">
              {item.rotulo}
            </p>
            <p
              className={
                item.destaque
                  ? "mt-1 font-display text-4xl leading-none text-secondary"
                  : "mt-1 font-display text-3xl leading-none text-foreground"
              }
            >
              {carregando ? "—" : item.valor}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-6">
        <p className="flex items-center gap-2 text-[9px] uppercase tracking-[0.16em] text-muted-foreground">
          <Users className="h-3 w-3" />
          Últimos 7 dias
        </p>

        {!carregando && (dados?.total ?? 0) === 0 && (
          <p className="mt-3 text-[12px] leading-relaxed text-muted-foreground">
            A contagem começa a partir de agora — os acessos aparecem aqui conforme
            as pessoas abrirem o site.
          </p>
        )}

        <div
          className={
            carregando || (dados?.total ?? 0) === 0
              ? "hidden"
              : "mt-3 flex h-32 items-end gap-2"
          }
        >
          {(dados?.dias ?? []).map((dia) => (
            <div key={dia.dia} className="flex flex-1 flex-col items-center gap-2">
              <span className="text-[10px] text-muted-foreground">{dia.total}</span>
              <div
                className="w-full rounded-t-sm bg-secondary/70 transition-all"
                style={{ height: `${Math.max(6, Math.round((dia.total / maior) * 96))}px` }}
                title={`${dia.dia}: ${dia.total} acesso(s)`}
              />
              <span className="text-[9px] uppercase tracking-[0.1em] text-muted-foreground">
                {dia.dia}
              </span>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
