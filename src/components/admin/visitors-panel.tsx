import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Activity,
  Ban,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock,
  Copy,
  Download,
  Filter,
  Globe2,
  Loader2,
  Lock,
  MapPin,
  MonitorSmartphone,
  RefreshCw,
  Search,
  ShieldAlert,
  Trash2,
  Unlock,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { registrarAtividade } from "@/lib/activity";
import {
  agruparVisitantes,
  baixarArquivo,
  bloquearIp,
  desbloquearIp,
  excluirVisitantes,
  fetchIpsBloqueados,
  fetchVisitantes,
  limparVisitantes,
  visitantesParaCsv,
  type GrupoIp,
  type Visitante,
} from "@/lib/visitors";

const ROTULO = "text-[10px] uppercase tracking-[0.16em] text-muted-foreground";

type Status = "todos" | "bloqueados" | "liberados";
type Periodo = "hoje" | "7" | "30" | "tudo";
type Ordem = "recentes" | "visitas" | "ip";

function dataLegivel(valor: string | null) {
  if (!valor) return "—";

  try {
    return new Date(valor).toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return valor;
  }
}

function mesmoDia(valor: string | null) {
  if (!valor) return false;
  const data = new Date(valor);
  const agora = new Date();
  return (
    data.getDate() === agora.getDate() &&
    data.getMonth() === agora.getMonth() &&
    data.getFullYear() === agora.getFullYear()
  );
}

function dentroDoPeriodo(valor: string, periodo: Periodo) {
  if (periodo === "tudo") return true;
  if (periodo === "hoje") return mesmoDia(valor);

  const dias = periodo === "7" ? 7 : 30;
  const limite = Date.now() - dias * 86400000;
  return new Date(valor).getTime() >= limite;
}

function localDoGrupo(grupo: GrupoIp) {
  const partes = [grupo.cidade, grupo.regiao, grupo.pais].filter(Boolean);
  return partes.length > 0 ? partes.join(" · ") : "Localização não identificada";
}

function resumoDispositivo(grupo: GrupoIp) {
  const dispositivo = grupo.dispositivos[0] ?? "—";
  const sistema = grupo.sistemas[0] ?? "—";
  return `${dispositivo} · ${sistema}`;
}

export function VisitorsPanel() {
  const [visitantes, setVisitantes] = useState<Visitante[]>([]);
  const [bloqueados, setBloqueados] = useState<string[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [ocupado, setOcupado] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const [busca, setBusca] = useState("");
  const [status, setStatus] = useState<Status>("todos");
  const [periodo, setPeriodo] = useState<Periodo>("tudo");
  const [dispositivo, setDispositivo] = useState("todos");
  const [ordem, setOrdem] = useState<Ordem>("recentes");

  const [selecionados, setSelecionados] = useState<Set<string>>(new Set());
  const [expandidos, setExpandidos] = useState<Set<string>>(new Set());
  const [autoAtualizar, setAutoAtualizar] = useState(false);

  const [ipManual, setIpManual] = useState("");
  const [confirmandoLimpeza, setConfirmandoLimpeza] = useState(false);
  const [confirmacaoTexto, setConfirmacaoTexto] = useState("");

  const conjuntoBloqueados = useMemo(() => new Set(bloqueados), [bloqueados]);

  const carregar = useCallback(async () => {
    setCarregando(true);

    try {
      const [lista, ips] = await Promise.all([fetchVisitantes(500), fetchIpsBloqueados()]);
      setVisitantes(lista);
      setBloqueados(ips);
      setErro(null);
    } catch (err) {
      setErro(err instanceof Error ? err.message : "Não foi possível carregar os visitantes");
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    void carregar();
  }, [carregar]);

  useEffect(() => {
    if (!autoAtualizar) return;

    const relogio = window.setInterval(() => {
      if (document.visibilityState === "visible") void carregar();
    }, 30000);

    return () => window.clearInterval(relogio);
  }, [autoAtualizar, carregar]);

  const grupos = useMemo(() => agruparVisitantes(visitantes), [visitantes]);

  const filtrados = useMemo(() => {
    const termo = busca.trim().toLowerCase();

    const lista = grupos.filter((grupo) => {
      const bloqueado = grupo.ips.some((ip) => conjuntoBloqueados.has(ip));

      if (status === "bloqueados" && !bloqueado) return false;
      if (status === "liberados" && bloqueado) return false;
      if (!dentroDoPeriodo(grupo.ultima, periodo)) return false;

      if (dispositivo !== "todos" && !grupo.dispositivos.includes(dispositivo)) return false;

      if (!termo) return true;

      return [
        grupo.ip,
        grupo.cidade,
        grupo.regiao,
        grupo.pais,
        grupo.provedor,
        grupo.impressao,
        grupo.referencia,
        grupo.campanha,
        ...grupo.navegadores,
        ...grupo.sistemas,
      ]
        .filter(Boolean)
        .some((campo) => String(campo).toLowerCase().includes(termo));
    });

    return lista.sort((a, b) => {
      if (ordem === "visitas") return b.visitas - a.visitas;
      if (ordem === "ip") return String(a.ip ?? "").localeCompare(String(b.ip ?? ""));
      return new Date(b.ultima).getTime() - new Date(a.ultima).getTime();
    });
  }, [grupos, busca, status, periodo, dispositivo, ordem, conjuntoBloqueados]);

  const stats = useMemo(
    () => ({
      total: grupos.length,
      hoje: grupos.filter((grupo) => mesmoDia(grupo.ultima)).length,
      bloqueados: bloqueados.length,
      paises: new Set(grupos.map((grupo) => grupo.pais).filter(Boolean)).size,
    }),
    [grupos, bloqueados],
  );

  const selecionadosNaTela = filtrados.filter((grupo) => selecionados.has(grupo.chave));
  const todosSelecionados = filtrados.length > 0 && selecionadosNaTela.length === filtrados.length;

  const alternar = (chave: string) => {
    setSelecionados((atual) => {
      const proximo = new Set(atual);
      if (proximo.has(chave)) proximo.delete(chave);
      else proximo.add(chave);
      return proximo;
    });
  };

  const alternarTodos = () => {
    setSelecionados((atual) => {
      const proximo = new Set(atual);

      if (todosSelecionados) filtrados.forEach((grupo) => proximo.delete(grupo.chave));
      else filtrados.forEach((grupo) => proximo.add(grupo.chave));

      return proximo;
    });
  };

  const alternarDetalhes = (chave: string) => {
    setExpandidos((atual) => {
      const proximo = new Set(atual);
      if (proximo.has(chave)) proximo.delete(chave);
      else proximo.add(chave);
      return proximo;
    });
  };

  const ipsSelecionados = useMemo(
    () => Array.from(new Set(selecionadosNaTela.flatMap((grupo) => grupo.ips))),
    [selecionadosNaTela],
  );

  const executar = async (tarefa: () => Promise<void>, mensagem: string) => {
    setOcupado(true);

    try {
      await tarefa();
      await carregar();
      setSelecionados(new Set());
      toast.success(mensagem);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Não foi possível concluir");
    } finally {
      setOcupado(false);
    }
  };

  const bloquearSelecionados = () =>
    executar(async () => {
      if (ipsSelecionados.length === 0) throw new Error("Nenhum IP válido na seleção.");
      await Promise.all(ipsSelecionados.map((ip) => bloquearIp(ip)));
      await registrarAtividade("visitante_bloqueado", { ips: ipsSelecionados.length });
    }, `${ipsSelecionados.length} IP(s) bloqueado(s)`);

  const desbloquearSelecionados = () =>
    executar(async () => {
      const paraLiberar = ipsSelecionados.filter((ip) => conjuntoBloqueados.has(ip));
      if (paraLiberar.length === 0) throw new Error("Nenhum IP bloqueado na seleção.");
      await Promise.all(paraLiberar.map((ip) => desbloquearIp(ip)));
      await registrarAtividade("visitante_desbloqueado", { ips: paraLiberar.length });
    }, "IP(s) liberado(s)");

  const excluirSelecionados = () =>
    executar(async () => {
      const ids = selecionadosNaTela.flatMap((grupo) => grupo.registros.map((item) => item.id));
      if (ids.length === 0) throw new Error("Selecione ao menos um registro.");
      await excluirVisitantes(ids);
      await registrarAtividade("visitantes_excluidos", { total: ids.length });
    }, "Registros excluídos");

  const limparTudo = () =>
    executar(async () => {
      await limparVisitantes();
      await registrarAtividade("visitantes_limpos", {});
      setConfirmandoLimpeza(false);
      setConfirmacaoTexto("");
    }, "Todo o histórico de visitantes foi apagado");

  const exportar = (itens: Visitante[], nome: string) => {
    if (itens.length === 0) {
      toast.error("Nada para exportar.");
      return;
    }

    baixarArquivo(nome, visitantesParaCsv(itens, conjuntoBloqueados));
    toast.success(`${itens.length} registro(s) exportado(s)`);
  };

  const bloquearManual = () =>
    executar(async () => {
      const limpo = ipManual.trim();
      if (!/^[0-9a-fA-F:.]{3,45}$/.test(limpo)) {
        throw new Error("Digite um IP válido (ex.: 189.12.34.56).");
      }

      await bloquearIp(limpo, "Bloqueado manualmente no painel");
      await registrarAtividade("visitante_bloqueado", { ip: limpo });
      setIpManual("");
    }, "IP bloqueado");

  const copiarIp = async (ip: string) => {
    try {
      await navigator.clipboard.writeText(ip);
      toast.success("IP copiado");
    } catch {
      toast.error("Não foi possível copiar.");
    }
  };

  const alternarBloqueioDoGrupo = (grupo: GrupoIp) => {
    if (grupo.ips.length === 0) return;
    const bloqueado = grupo.ips.some((ip) => conjuntoBloqueados.has(ip));

    void executar(
      async () => {
        if (bloqueado) {
          await Promise.all(grupo.ips.map((ip) => desbloquearIp(ip)));
          await registrarAtividade("visitante_desbloqueado", { ips: grupo.ips });
        } else {
          await Promise.all(grupo.ips.map((ip) => bloquearIp(ip)));
          await registrarAtividade("visitante_bloqueado", { ips: grupo.ips });
        }
      },
      bloqueado ? "Acesso liberado" : "Acesso bloqueado",
    );
  };

  const exportarFiltrados = () =>
    exportar(
      filtrados.flatMap((grupo) => grupo.registros),
      `visitantes-${new Date().toISOString().slice(0, 10)}.csv`,
    );

  return (
    <div className="space-y-5">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Pessoas", valor: stats.total, icone: Users, hint: "aparelhos distintos" },
          { label: "Hoje", valor: stats.hoje, icone: Activity, hint: "acessos do dia" },
          { label: "Bloqueados", valor: stats.bloqueados, icone: Ban, hint: "IPs na lista" },
          { label: "Países", valor: stats.paises, icone: Globe2, hint: "origens" },
        ].map((item) => (
          <div key={item.label} className="border border-border/70 bg-card/40 p-4">
            <div className="flex items-center justify-between">
              <p className="text-[9px] uppercase tracking-[0.16em] text-muted-foreground">
                {item.label}
              </p>
              <item.icone className="h-3.5 w-3.5 text-secondary/70" />
            </div>
            <p className="mt-2 font-display text-3xl leading-none text-foreground">{item.valor}</p>
            <p className="mt-1 text-[10px] uppercase tracking-[0.12em] text-muted-foreground/70">
              {item.hint}
            </p>
          </div>
        ))}
      </div>

      <section className="border border-border/70 bg-card/40 p-4 sm:p-5">
        <div className="flex flex-wrap items-end gap-3">
          <div className="min-w-[220px] flex-1 space-y-2">
            <Label className={ROTULO}>Buscar</Label>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={busca}
                onChange={(evento) => setBusca(evento.target.value)}
                placeholder="IP, cidade, provedor, navegador, campanha..."
                className="rounded-sm border-border bg-background/70 pl-9 text-sm"
              />
            </div>
          </div>

          <div className="w-[150px] space-y-2">
            <Label className={ROTULO}>Situação</Label>
            <Select value={status} onValueChange={(valor) => setStatus(valor as Status)}>
              <SelectTrigger className="rounded-sm border-border bg-background/70 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value="liberados">Liberados</SelectItem>
                <SelectItem value="bloqueados">Bloqueados</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="w-[140px] space-y-2">
            <Label className={ROTULO}>Período</Label>
            <Select value={periodo} onValueChange={(valor) => setPeriodo(valor as Periodo)}>
              <SelectTrigger className="rounded-sm border-border bg-background/70 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tudo">Tudo</SelectItem>
                <SelectItem value="hoje">Hoje</SelectItem>
                <SelectItem value="7">7 dias</SelectItem>
                <SelectItem value="30">30 dias</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="w-[150px] space-y-2">
            <Label className={ROTULO}>Aparelho</Label>
            <Select value={dispositivo} onValueChange={setDispositivo}>
              <SelectTrigger className="rounded-sm border-border bg-background/70 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value="Celular">Celular</SelectItem>
                <SelectItem value="Tablet">Tablet</SelectItem>
                <SelectItem value="Computador">Computador</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="w-[150px] space-y-2">
            <Label className={ROTULO}>
              <span className="inline-flex items-center gap-1">
                <Filter className="h-3 w-3" />
                Ordenar
              </span>
            </Label>
            <Select value={ordem} onValueChange={(valor) => setOrdem(valor as Ordem)}>
              <SelectTrigger className="rounded-sm border-border bg-background/70 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recentes">Mais recentes</SelectItem>
                <SelectItem value="visitas">Mais visitas</SelectItem>
                <SelectItem value="ip">IP</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-border/60 pt-3">
          <Button type="button" variant="hairline" size="sm" onClick={() => void carregar()} disabled={carregando}>
            {carregando ? <Loader2 className="animate-spin" /> : <RefreshCw />}
            Atualizar
          </Button>

          <Button type="button" variant="ghost" size="sm" onClick={exportarFiltrados}>
            <Download />
            Exportar CSV
          </Button>

          <Button
            type="button"
            variant={autoAtualizar ? "forward" : "ghost"}
            size="sm"
            onClick={() => setAutoAtualizar((valor) => !valor)}
          >
            <Clock />
            {autoAtualizar ? "Atualizando a cada 30s" : "Atualizar sozinho"}
          </Button>

          <p className="ml-auto text-[11px] text-muted-foreground">
            {filtrados.length} de {grupos.length} rede(s)
          </p>
        </div>

        {erro && (
          <p className="mt-3 border-l-2 border-destructive bg-destructive/10 px-3 py-2 text-[12px] text-destructive-foreground">
            {erro}
          </p>
        )}
      </section>

      {selecionadosNaTela.length > 0 && (
        <section className="sticky top-2 z-20 border border-secondary/50 bg-card/95 p-3 backdrop-blur">
          <div className="flex flex-wrap items-center gap-2">
            <p className="mr-2 text-[11px] uppercase tracking-[0.14em] text-secondary">
              {selecionadosNaTela.length} selecionado(s)
            </p>

            <Button type="button" variant="hairline" size="sm" onClick={() => void bloquearSelecionados()} disabled={ocupado}>
              <Ban />
              Bloquear
            </Button>

            <Button type="button" variant="hairline" size="sm" onClick={() => void desbloquearSelecionados()} disabled={ocupado}>
              <Unlock />
              Desbloquear
            </Button>

            <Button
              type="button"
              variant="hairline"
              size="sm"
              onClick={() =>
                exportar(
                  selecionadosNaTela.flatMap((grupo) => grupo.registros),
                  "visitantes-selecionados.csv",
                )
              }
              disabled={ocupado}
            >
              <Download />
              Exportar
            </Button>

            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="text-destructive hover:bg-destructive/10"
              onClick={() => void excluirSelecionados()}
              disabled={ocupado}
            >
              <Trash2 />
              Excluir
            </Button>

            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="ml-auto"
              onClick={() => setSelecionados(new Set())}
            >
              Limpar seleção
            </Button>
          </div>
        </section>
      )}

      <section className="border border-border/70 bg-card/40">
        <div className="flex items-center gap-3 border-b border-border/70 px-4 py-2.5">
          <input
            type="checkbox"
            aria-label="Selecionar todos"
            checked={todosSelecionados}
            onChange={alternarTodos}
            className="h-3.5 w-3.5 accent-[hsl(var(--secondary))]"
          />
          <span className="text-[9px] uppercase tracking-[0.16em] text-muted-foreground">
            Pessoa / aparelho
          </span>
          <span className="ml-auto text-[9px] uppercase tracking-[0.16em] text-muted-foreground">
            {stats.total} pessoa(s) registrada(s)
          </span>
        </div>

        {carregando ? (
          <div className="space-y-2 p-4">
            {[0, 1, 2, 3].map((chave) => (
              <div key={chave} className="h-16 animate-pulse border border-border/60 bg-background/40" />
            ))}
          </div>
        ) : filtrados.length === 0 ? (
          <p className="p-8 text-center text-[12px] text-muted-foreground">
            Nenhum visitante encontrado com esses filtros.
          </p>
        ) : (
          <ul className="divide-y divide-border/60">
            {filtrados.map((grupo) => {
              const bloqueado = grupo.ips.some((ip) => conjuntoBloqueados.has(ip));
              const marcado = selecionados.has(grupo.chave);
              const aberto = expandidos.has(grupo.chave);

              return (
                <li key={grupo.chave} className="px-4 py-3">
                  <div className="flex flex-col gap-3 md:flex-row md:items-center">
                    <div className="flex items-start gap-3 md:w-[190px] md:shrink-0">
                      <input
                        type="checkbox"
                        aria-label={`Selecionar ${grupo.ip ?? "visitante"}`}
                        checked={marcado}
                        onChange={() => alternar(grupo.chave)}
                        className="mt-1 h-3.5 w-3.5 accent-[hsl(var(--secondary))]"
                      />
                      <div className="min-w-0">
                        <p className="truncate font-mono text-[12px] text-foreground">
                          {grupo.ip ?? "sem IP"}
                        </p>
                        {grupo.ips.length > 1 && (
                          <p className="text-[10px] text-muted-foreground">
                            +{grupo.ips.length - 1} IP(s) do mesmo aparelho
                          </p>
                        )}
                        <p
                          className={`mt-0.5 inline-flex items-center gap-1 text-[10px] uppercase tracking-[0.12em] ${
                            bloqueado ? "text-destructive" : "text-secondary"
                          }`}
                        >
                          {bloqueado ? <Lock className="h-3 w-3" /> : <CheckCircle2 className="h-3 w-3" />}
                          {bloqueado ? "Bloqueado" : "Liberado"}
                        </p>
                      </div>
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="flex items-center gap-1.5 text-[12px] text-foreground">
                        <MapPin className="h-3 w-3 shrink-0 text-secondary/70" />
                        <span className="truncate">{localDoGrupo(grupo)}</span>
                      </p>
                      <p className="mt-0.5 truncate text-[11px] text-muted-foreground">
                        {grupo.provedor ? `${grupo.provedor} · ` : ""}
                        {grupo.referencia ? `veio de ${grupo.referencia}` : "acesso direto"}
                      </p>
                    </div>

                    <div className="text-[11px] text-muted-foreground md:w-[160px] md:shrink-0">
                      <p className="flex items-center gap-1 text-foreground">
                        <MonitorSmartphone className="h-3 w-3 text-secondary/70" />
                        {resumoDispositivo(grupo)}
                      </p>
                      <p className="mt-0.5 truncate">{grupo.navegadores.join(", ") || "—"}</p>
                    </div>

                    <div className="md:w-[120px] md:shrink-0 md:text-center">
                      <p className="font-display text-2xl leading-none text-foreground">
                        {grupo.visitas}
                      </p>
                      <p className="mt-0.5 text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
                        acessos · {grupo.sessoes} sessão(ões)
                      </p>
                    </div>

                    <p className="text-[11px] text-muted-foreground md:w-[120px] md:shrink-0">
                      {dataLegivel(grupo.ultima)}
                    </p>

                    <div className="flex flex-wrap gap-1 md:w-[210px] md:shrink-0 md:justify-end">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => alternarDetalhes(grupo.chave)}
                        aria-expanded={aberto}
                      >
                        {aberto ? <ChevronUp /> : <ChevronDown />}
                        Detalhes
                      </Button>

                      {grupo.ip && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          aria-label="Copiar IP"
                          onClick={() => void copiarIp(grupo.ip!)}
                          className="text-muted-foreground"
                        >
                          <Copy />
                        </Button>
                      )}

                      {grupo.ips.length > 0 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          disabled={ocupado}
                          onClick={() => alternarBloqueioDoGrupo(grupo)}
                          className={bloqueado ? "text-secondary" : "text-destructive"}
                        >
                          {bloqueado ? <Unlock /> : <Ban />}
                          {bloqueado ? "Liberar" : "Bloquear"}
                        </Button>
                      )}
                    </div>
                  </div>

                  {aberto && (
                    <div className="mt-3 space-y-3 border border-border/60 bg-background/40 p-4">
                      <div className="grid gap-3 text-[11px] sm:grid-cols-2 lg:grid-cols-3">
                        <p className="text-muted-foreground">
                          <span className={ROTULO}>Provedor</span>
                          <br />
                          <span className="text-foreground">{grupo.provedor ?? "—"}</span>
                        </p>
                        <p className="text-muted-foreground">
                          <span className={ROTULO}>Sistemas</span>
                          <br />
                          <span className="text-foreground">{grupo.sistemas.join(", ") || "—"}</span>
                        </p>
                        <p className="text-muted-foreground">
                          <span className={ROTULO}>Telas</span>
                          <br />
                          <span className="text-foreground">{grupo.telas.join(", ") || "—"}</span>
                        </p>
                        <p className="text-muted-foreground">
                          <span className={ROTULO}>IPs deste aparelho</span>
                          <br />
                          <span className="break-all font-mono text-foreground">
                            {grupo.ips.length > 0 ? grupo.ips.join(", ") : "—"}
                          </span>
                        </p>
                        <p className="text-muted-foreground">
                          <span className={ROTULO}>ID do aparelho</span>
                          <br />
                          <span className="break-all font-mono text-foreground">
                            {grupo.impressao ?? "—"}
                          </span>
                        </p>
                        <p className="text-muted-foreground">
                          <span className={ROTULO}>Campanha</span>
                          <br />
                          <span className="break-all text-foreground">{grupo.campanha ?? "—"}</span>
                        </p>
                        <p className="text-muted-foreground">
                          <span className={ROTULO}>Primeiro acesso</span>
                          <br />
                          <span className="text-foreground">{dataLegivel(grupo.primeira)}</span>
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        {grupo.latitude !== null && grupo.longitude !== null && (
                          <Button asChild variant="hairline" size="sm">
                            <a
                              href={`https://www.google.com/maps?q=${grupo.latitude},${grupo.longitude}`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <MapPin />
                              Ver no mapa
                            </a>
                          </Button>
                        )}

                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:bg-destructive/10"
                          disabled={ocupado}
                          onClick={() =>
                            void executar(async () => {
                              await excluirVisitantes(grupo.registros.map((item) => item.id));
                            }, "Registros desta rede excluídos")
                          }
                        >
                          <Trash2 />
                          Excluir esta rede
                        </Button>

                        <span className="text-[11px] text-muted-foreground">
                          {grupo.sessoes} sessão(ões) registradas
                        </span>
                      </div>

                      <div className="space-y-1">
                        <p className={ROTULO}>Últimos acessos</p>
                        <ul className="space-y-1">
                          {grupo.registros.slice(0, 5).map((registro) => (
                            <li
                              key={registro.id}
                              className="flex flex-wrap items-center justify-between gap-2 border border-border/50 px-2.5 py-1.5 text-[11px]"
                            >
                              <span className="text-muted-foreground">
                                {registro.dispositivo ?? "—"} · {registro.sistema ?? "—"} ·{" "}
                                {registro.navegador ?? "—"}
                              </span>
                              <span className="uppercase tracking-[0.12em] text-muted-foreground/80">
                                {dataLegivel(registro.visto_em)}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <section className="border border-border/70 bg-card/40 p-4 sm:p-5">
        <h2 className="flex items-center gap-2 font-display text-2xl text-foreground">
          <ShieldAlert className="h-4 w-4 text-secondary" />
          Bloqueio por IP
        </h2>
        <p className="mt-1 max-w-xl text-[12px] leading-relaxed text-muted-foreground">
          Bloqueie direto da lista acima ou digite um IP manualmente. O bloqueio vale
          assim que a pessoa recarregar o site.
        </p>

        <div className="mt-4 flex flex-wrap items-end gap-2">
          <div className="min-w-[220px] flex-1 space-y-2">
            <Label className={ROTULO}>Endereço IP</Label>
            <Input
              value={ipManual}
              onChange={(evento) => setIpManual(evento.target.value)}
              placeholder="189.12.34.56"
              className="rounded-sm border-border bg-background/70 font-mono text-sm"
            />
          </div>
          <Button type="button" variant="forward" onClick={() => void bloquearManual()} disabled={ocupado}>
            {ocupado ? <Loader2 className="animate-spin" /> : <Ban />}
            Bloquear IP
          </Button>
        </div>

        {bloqueados.length > 0 && (
          <div className="mt-4">
            <p className={ROTULO}>IPs bloqueados ({bloqueados.length})</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {bloqueados.map((ip) => (
                <button
                  key={ip}
                  type="button"
                  disabled={ocupado}
                  onClick={() =>
                    void executar(async () => {
                      await desbloquearIp(ip);
                      await registrarAtividade("visitante_desbloqueado", { ip });
                    }, "IP liberado")
                  }
                  className="inline-flex items-center gap-2 border border-border/70 bg-background/50 px-2.5 py-1.5 font-mono text-[11px] text-foreground transition-colors hover:border-secondary hover:text-secondary"
                  title="Clique para desbloquear"
                >
                  <Unlock className="h-3 w-3" />
                  {ip}
                </button>
              ))}
            </div>
          </div>
        )}
      </section>

      <section className="border border-destructive/40 bg-destructive/5 p-4 sm:p-5">
        <h2 className="font-display text-2xl text-foreground">Limpar histórico</h2>
        <p className="mt-1 max-w-xl text-[12px] leading-relaxed text-muted-foreground">
          Apaga todos os registros de visitantes (IP, localização e aparelho). A lista
          de IPs bloqueados continua intacta.
        </p>

        {confirmandoLimpeza ? (
          <div className="mt-4 space-y-2">
            <Label className={ROTULO}>Digite APAGAR para confirmar</Label>
            <div className="flex flex-wrap items-center gap-2">
              <Input
                value={confirmacaoTexto}
                onChange={(evento) => setConfirmacaoTexto(evento.target.value)}
                placeholder="APAGAR"
                className="w-40 rounded-sm border-border bg-background/70 text-sm"
              />
              <Button
                type="button"
                variant="forward"
                size="sm"
                disabled={ocupado || confirmacaoTexto.trim().toUpperCase() !== "APAGAR"}
                onClick={() => void limparTudo()}
              >
                {ocupado ? <Loader2 className="animate-spin" /> : <Trash2 />}
                Apagar tudo
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  setConfirmandoLimpeza(false);
                  setConfirmacaoTexto("");
                }}
              >
                Cancelar
              </Button>
            </div>
          </div>
        ) : (
          <Button
            type="button"
            variant="hairline"
            size="sm"
            className="mt-4 text-destructive"
            onClick={() => setConfirmandoLimpeza(true)}
          >
            <Trash2 />
            Limpar todos os registros
          </Button>
        )}
      </section>

      <p className="flex items-start gap-2 border border-border/60 bg-background/40 p-3 text-[11px] leading-relaxed text-muted-foreground">
        <MonitorSmartphone className="mt-0.5 h-3.5 w-3.5 shrink-0 text-secondary" />
        O navegador não permite ler o endereço MAC do aparelho. O “ID do aparelho” é uma
        impressão digital aproximada (navegador, tela, fuso e plataforma) e serve para
        reconhecer o mesmo aparelho entre visitas.
      </p>
    </div>
  );
}
