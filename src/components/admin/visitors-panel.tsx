import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  Ban,
  CheckCircle2,
  Download,
  Globe2,
  Loader2,
  Lock,
  MapPin,
  MonitorSmartphone,
  RefreshCw,
  Search,
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
  baixarArquivo,
  bloquearIp,
  desbloquearIp,
  excluirVisitantes,
  fetchIpsBloqueados,
  fetchVisitantes,
  limparVisitantes,
  visitantesParaCsv,
  type Visitante,
} from "@/lib/visitors";

const ROTULO = "text-[10px] uppercase tracking-[0.16em] text-muted-foreground";

type Filtro = "todos" | "bloqueados" | "liberados" | "hoje";

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

function hoje(valor: string | null) {
  if (!valor) return false;
  const data = new Date(valor);
  const agora = new Date();
  return (
    data.getDate() === agora.getDate() &&
    data.getMonth() === agora.getMonth() &&
    data.getFullYear() === agora.getFullYear()
  );
}

function localDoVisitante(v: Visitante) {
  const partes = [v.cidade, v.regiao, v.pais].filter(Boolean);
  return partes.length > 0 ? partes.join(" · ") : "Localização não identificada";
}

export function VisitorsPanel() {
  const [visitantes, setVisitantes] = useState<Visitante[]>([]);
  const [bloqueados, setBloqueados] = useState<string[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [ocupado, setOcupado] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const [busca, setBusca] = useState("");
  const [filtro, setFiltro] = useState<Filtro>("todos");
  const [selecionados, setSelecionados] = useState<Set<string>>(new Set());
  const [ipManual, setIpManual] = useState("");
  const [confirmandoLimpeza, setConfirmandoLimpeza] = useState(false);

  const conjuntoBloqueados = useMemo(() => new Set(bloqueados), [bloqueados]);

  const carregar = async () => {
    setCarregando(true);

    try {
      const [lista, ips] = await Promise.all([fetchVisitantes(400), fetchIpsBloqueados()]);
      setVisitantes(lista);
      setBloqueados(ips);
      setErro(null);
    } catch (err) {
      setErro(err instanceof Error ? err.message : "Não foi possível carregar os visitantes");
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    void carregar();
  }, []);

  const filtrados = useMemo(() => {
    const termo = busca.trim().toLowerCase();

    return visitantes.filter((v) => {
      const bloqueado = Boolean(v.ip && conjuntoBloqueados.has(v.ip));

      if (filtro === "bloqueados" && !bloqueado) return false;
      if (filtro === "liberados" && bloqueado) return false;
      if (filtro === "hoje" && !hoje(v.visto_em)) return false;

      if (!termo) return true;

      return [v.ip, v.cidade, v.regiao, v.pais, v.navegador, v.sistema, v.dispositivo, v.impressao, v.referencia, v.campanha, v.provedor]
        .filter(Boolean)
        .some((campo) => String(campo).toLowerCase().includes(termo));
    });
  }, [visitantes, busca, filtro, conjuntoBloqueados]);

  const selecionadosNaTela = filtrados.filter((v) => selecionados.has(v.id));
  const todosSelecionados = filtrados.length > 0 && selecionadosNaTela.length === filtrados.length;

  const alternar = (id: string) => {
    setSelecionados((atual) => {
      const proximo = new Set(atual);
      if (proximo.has(id)) proximo.delete(id);
      else proximo.add(id);
      return proximo;
    });
  };

  const alternarTodos = () => {
    setSelecionados((atual) => {
      const proximo = new Set(atual);

      if (todosSelecionados) {
        filtrados.forEach((v) => proximo.delete(v.id));
      } else {
        filtrados.forEach((v) => proximo.add(v.id));
      }

      return proximo;
    });
  };

  const ipsSelecionados = useMemo(() => {
    const lista = selecionadosNaTela.map((v) => v.ip).filter((ip): ip is string => Boolean(ip));
    return Array.from(new Set(lista));
  }, [selecionadosNaTela]);

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
      const ids = selecionadosNaTela.map((v) => v.id);
      if (ids.length === 0) throw new Error("Selecione ao menos um registro.");
      await excluirVisitantes(ids);
      await registrarAtividade("visitantes_excluidos", { total: ids.length });
    }, "Registros excluídos");

  const limparTudo = () =>
    executar(async () => {
      await limparVisitantes();
      await registrarAtividade("visitantes_limpos", {});
      setConfirmandoLimpeza(false);
    }, "Todos os registros de visitantes foram apagados");

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

  const totalHoje = visitantes.filter((v) => hoje(v.visto_em)).length;
  const paises = new Set(visitantes.map((v) => v.pais).filter(Boolean)).size;

  return (
    <div className="space-y-5">
      <div className="grid gap-3 sm:grid-cols-4">
        {[
          { label: "Visitantes", valor: visitantes.length, icone: Users },
          { label: "Hoje", valor: totalHoje, icone: Globe2 },
          { label: "IPs bloqueados", valor: bloqueados.length, icone: Ban },
          { label: "Países", valor: paises, icone: MapPin },
        ].map((item) => (
          <div key={item.label} className="border border-border/70 bg-card/40 p-4">
            <div className="flex items-center justify-between">
              <p className="text-[9px] uppercase tracking-[0.16em] text-muted-foreground">
                {item.label}
              </p>
              <item.icone className="h-3.5 w-3.5 text-secondary/70" />
            </div>
            <p className="mt-2 font-display text-3xl leading-none text-foreground">{item.valor}</p>
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
                placeholder="IP, cidade, navegador, ID do aparelho..."
                className="rounded-sm border-border bg-background/70 pl-9 text-sm"
              />
            </div>
          </div>

          <div className="w-[190px] space-y-2">
            <Label className={ROTULO}>Mostrar</Label>
            <Select value={filtro} onValueChange={(valor) => setFiltro(valor as Filtro)}>
              <SelectTrigger className="rounded-sm border-border bg-background/70 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value="hoje">Só de hoje</SelectItem>
                <SelectItem value="liberados">Liberados</SelectItem>
                <SelectItem value="bloqueados">Bloqueados</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button type="button" variant="hairline" onClick={() => void carregar()} disabled={carregando}>
            {carregando ? <Loader2 className="animate-spin" /> : <RefreshCw />}
            Atualizar
          </Button>

          <Button
            type="button"
            variant="ghost"
            onClick={() => exportar(filtrados, `visitantes-${new Date().toISOString().slice(0, 10)}.csv`)}
          >
            <Download />
            Exportar CSV
          </Button>
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
              Bloquear IPs
            </Button>

            <Button type="button" variant="hairline" size="sm" onClick={() => void desbloquearSelecionados()} disabled={ocupado}>
              <Unlock />
              Desbloquear
            </Button>

            <Button
              type="button"
              variant="hairline"
              size="sm"
              onClick={() => exportar(selecionadosNaTela, "visitantes-selecionados.csv")}
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
              Excluir registros
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
        <div className="hidden items-center gap-3 border-b border-border/70 px-4 py-2.5 text-[9px] uppercase tracking-[0.16em] text-muted-foreground md:flex">
          <input
            type="checkbox"
            aria-label="Selecionar todos"
            checked={todosSelecionados}
            onChange={alternarTodos}
            className="h-3.5 w-3.5 accent-[hsl(var(--secondary))]"
          />
          <span className="w-[150px]">IP / situação</span>
          <span className="flex-1">Localização</span>
          <span className="w-[170px]">Aparelho</span>
          <span className="w-[70px] text-center">Visitas</span>
          <span className="w-[130px]">Último acesso</span>
          <span className="w-[150px] text-right">Ações</span>
        </div>

        {carregando ? (
          <div className="space-y-2 p-4">
            {[0, 1, 2].map((chave) => (
              <div key={chave} className="h-14 animate-pulse border border-border/60 bg-background/40" />
            ))}
          </div>
        ) : filtrados.length === 0 ? (
          <p className="p-8 text-center text-[12px] text-muted-foreground">
            Nenhum visitante encontrado com esse filtro.
          </p>
        ) : (
          <ul className="divide-y divide-border/60">
            {filtrados.map((v) => {
              const bloqueado = Boolean(v.ip && conjuntoBloqueados.has(v.ip));
              const marcado = selecionados.has(v.id);

              return (
                <li key={v.id} className="px-4 py-3">
                  <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-3">
                    <div className="flex items-start gap-3 md:w-[150px] md:shrink-0">
                      <input
                        type="checkbox"
                        aria-label={`Selecionar ${v.ip ?? "visitante"}`}
                        checked={marcado}
                        onChange={() => alternar(v.id)}
                        className="mt-1 h-3.5 w-3.5 accent-[hsl(var(--secondary))]"
                      />
                      <div className="min-w-0">
                        <p className="font-mono text-[12px] text-foreground">{v.ip ?? "IP oculto"}</p>
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
                      <p className="text-[12px] text-foreground">{localDoVisitante(v)}</p>
                      <p className="mt-0.5 truncate text-[11px] text-muted-foreground">
                        {v.provedor ? `${v.provedor} · ` : ""}
                        {v.referencia ? `veio de ${v.referencia}` : "acesso direto"}
                      </p>
                    </div>

                    <div className="text-[11px] text-muted-foreground md:w-[170px] md:shrink-0">
                      <p className="flex items-center gap-1 text-foreground">
                        <MonitorSmartphone className="h-3 w-3 text-secondary/70" />
                        {v.dispositivo ?? "—"} · {v.sistema ?? "—"}
                      </p>
                      <p className="mt-0.5">
                        {v.navegador ?? "—"} · {v.tela ?? "—"}
                      </p>
                    </div>

                    <p className="text-[12px] text-foreground md:w-[70px] md:shrink-0 md:text-center">
                      {v.visitas}
                    </p>

                    <p className="text-[11px] text-muted-foreground md:w-[130px] md:shrink-0">
                      {dataLegivel(v.visto_em)}
                    </p>

                    <div className="flex gap-2 md:w-[150px] md:shrink-0 md:justify-end">
                      {v.ip && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          disabled={ocupado}
                          onClick={() =>
                            void executar(
                              async () => {
                                if (bloqueado) {
                                  await desbloquearIp(v.ip!);
                                  await registrarAtividade("visitante_desbloqueado", { ip: v.ip });
                                } else {
                                  await bloquearIp(v.ip!);
                                  await registrarAtividade("visitante_bloqueado", { ip: v.ip });
                                }
                              },
                              bloqueado ? "IP liberado" : "IP bloqueado",
                            )
                          }
                          className={bloqueado ? "text-secondary" : "text-destructive"}
                        >
                          {bloqueado ? <Unlock /> : <Ban />}
                          {bloqueado ? "Liberar" : "Bloquear"}
                        </Button>
                      )}

                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        aria-label="Excluir registro"
                        disabled={ocupado}
                        onClick={() =>
                          void executar(async () => {
                            await excluirVisitantes([v.id]);
                          }, "Registro excluído")
                        }
                        className="text-muted-foreground"
                      >
                        <Trash2 />
                      </Button>
                    </div>
                  </div>

                  <p className="mt-1.5 flex flex-wrap gap-x-3 text-[10px] text-muted-foreground/80">
                    <span>ID do aparelho: {v.impressao ?? "—"}</span>
                    <span>Idioma: {v.idioma ?? "—"}</span>
                    <span>Fuso: {v.fuso ?? "—"}</span>
                    {v.campanha && <span>Campanha: {v.campanha}</span>}
                  </p>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <section className="border border-border/70 bg-card/40 p-4 sm:p-5">
        <h2 className="font-display text-2xl text-foreground">Bloquear um IP manualmente</h2>
        <p className="mt-1 max-w-xl text-[12px] leading-relaxed text-muted-foreground">
          Use quando alguém tentar entrar por um IP que ainda não apareceu na lista.
          O bloqueio vale na hora em que a pessoa recarregar o site.
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
        <h2 className="flex items-center gap-2 font-display text-2xl text-foreground">
          <AlertTriangle className="h-4 w-4 text-destructive" />
          Limpar histórico
        </h2>
        <p className="mt-1 max-w-xl text-[12px] leading-relaxed text-muted-foreground">
          Apaga todos os registros de visitantes (IP, localização e aparelho). A lista
          de IPs bloqueados continua intacta.
        </p>

        {confirmandoLimpeza ? (
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <p className="text-[12px] text-destructive-foreground">Confirmar exclusão de tudo?</p>
            <Button
              type="button"
              variant="forward"
              size="sm"
              onClick={() => void limparTudo()}
              disabled={ocupado}
            >
              {ocupado ? <Loader2 className="animate-spin" /> : <Trash2 />}
              Sim, apagar tudo
            </Button>
            <Button type="button" variant="ghost" size="sm" onClick={() => setConfirmandoLimpeza(false)}>
              Cancelar
            </Button>
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
        <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-secondary" />
        O bloqueio age no carregamento do site: quem já estava com a página aberta só é
        barrado ao recarregar. O navegador não permite ler o endereço MAC do aparelho —
        o “ID do aparelho” acima é uma impressão digital aproximada (navegador, tela,
        fuso e plataforma).
      </p>
    </div>
  );
}
