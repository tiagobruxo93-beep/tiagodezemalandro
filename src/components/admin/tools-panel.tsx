import { useEffect, useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Copy,
  Download,
  Fingerprint,
  Loader2,
  Lock,
  RefreshCw,
  Save,
  ShieldAlert,
  ShieldCheck,
  Smartphone,
  Timer,
  Trash2,
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
import { SwitchField } from "@/components/admin/fields";
import { fetchAtividade, registrarAtividade, type Atividade } from "@/lib/activity";
import { exportarDados } from "@/lib/backup";
import { confirmar2fa, desativar2fa, fatoresTotp, iniciar2fa, type FatorTotp } from "@/lib/mfa";
import { gravarSeguranca } from "@/lib/site-security";
import { saveSiteContent, type SiteContent } from "@/lib/site-content";

const ROTULO = "text-[10px] uppercase tracking-[0.16em] text-muted-foreground";

function Cartao({
  titulo,
  descricao,
  icone,
  children,
}: {
  titulo: string;
  descricao: string;
  icone: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="border border-border/70 bg-card/40 p-5 sm:p-6">
      <div className="flex items-start gap-3">
        <span className="mt-0.5 text-secondary">{icone}</span>
        <div>
          <h2 className="font-display text-2xl leading-tight text-foreground">{titulo}</h2>
          <p className="mt-1 max-w-xl text-[12px] leading-relaxed text-muted-foreground">
            {descricao}
          </p>
        </div>
      </div>
      <div className="mt-5 space-y-4">{children}</div>
    </section>
  );
}

function dataLegivel(valor: string) {
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

export function ToolsPanel({
  content,
  onSaved,
}: {
  content: SiteContent;
  onSaved: () => Promise<void>;
}) {
  const [protecao, setProtecao] = useState(content.protecao);
  const [seguranca, setSeguranca] = useState(content.seguranca);
  const [salvando, setSalvando] = useState(false);

  const [fatores, setFatores] = useState<FatorTotp[]>([]);
  const [carregandoFatores, setCarregandoFatores] = useState(true);
  const [cadastro, setCadastro] = useState<{ id: string; qr: string; segredo: string } | null>(
    null,
  );
  const [codigo, setCodigo] = useState("");
  const [processando2fa, setProcessando2fa] = useState(false);

  const [acessos, setAcessos] = useState<Atividade[]>([]);

  const carregarFatores = async () => {
    setCarregandoFatores(true);
    try {
      setFatores(await fatoresTotp());
    } catch {
      setFatores([]);
    } finally {
      setCarregandoFatores(false);
    }
  };

  const carregarAcessos = async () => {
    const lista = await fetchAtividade(40);
    setAcessos(lista.filter((item) => item.acao === "login").slice(0, 5));
  };

  useEffect(() => {
    void carregarFatores();
    void carregarAcessos();
  }, []);

  const salvar = async () => {
    setSalvando(true);

    try {
      await saveSiteContent({ ...content, protecao, seguranca });
      gravarSeguranca(seguranca);
      await registrarAtividade("protecao_alterada", { protecao, seguranca });
      await onSaved();
      toast.success("Proteções atualizadas");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Não foi possível salvar");
    } finally {
      setSalvando(false);
    }
  };

  const ativar2fa = async () => {
    setProcessando2fa(true);

    try {
      const dados = await iniciar2fa();
      setCadastro(dados);
      setCodigo("");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Não foi possível iniciar a verificação");
    } finally {
      setProcessando2fa(false);
    }
  };

  const confirmarCodigo = async () => {
    if (!cadastro) return;

    if (codigo.replace(/\D/g, "").length !== 6) {
      toast.error("Digite os 6 dígitos do aplicativo.");
      return;
    }

    setProcessando2fa(true);

    try {
      await confirmar2fa(cadastro.id, codigo);
      await registrarAtividade("dois_fatores_ativado", {});
      setCadastro(null);
      setCodigo("");
      await carregarFatores();
      toast.success("Verificação em duas etapas ativada");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Código inválido");
      setCodigo("");
    } finally {
      setProcessando2fa(false);
    }
  };

  const remover2fa = async (id: string) => {
    setProcessando2fa(true);

    try {
      await desativar2fa(id);
      await registrarAtividade("dois_fatores_desativado", {});
      await carregarFatores();
      toast.success("Verificação em duas etapas desativada");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Não foi possível desativar");
    } finally {
      setProcessando2fa(false);
    }
  };

  const copiarSegredo = async () => {
    if (!cadastro) return;

    try {
      await navigator.clipboard.writeText(cadastro.segredo);
      toast.success("Chave copiada. Guarde em local seguro.");
    } catch {
      toast.error("Não foi possível copiar. Anote a chave manualmente.");
    }
  };

  const baixarBackup = async () => {
    try {
      await exportarDados();
      await registrarAtividade("backup_baixado", {});
      toast.success("Cópia de segurança baixada");
    } catch {
      toast.error("Não foi possível gerar a cópia de segurança");
    }
  };

  const doisFatoresAtivo = fatores.length > 0;

  return (
    <div className="space-y-5">
      <Cartao
        titulo="Proteção do conteúdo"
        descricao="Barreiras para dificultar que terceiros copiem textos, fotos e o próprio layout. São dissuasões: nenhum navegador impede 100% a cópia de algo que já apareceu na tela."
        icone={<ShieldAlert className="h-5 w-5" />}
      >
        <SwitchField
          rotulo="Bloquear o menu do botão direito"
          valor={protecao.bloquearBotaoDireito}
          onChange={(valor) => setProtecao({ ...protecao, bloquearBotaoDireito: valor })}
          ajuda="Impede o atalho de copiar imagem e “salvar como”."
        />
        <SwitchField
          rotulo="Bloquear cópia e seleção de texto"
          valor={protecao.bloquearCopia}
          onChange={(valor) => setProtecao({ ...protecao, bloquearCopia: valor })}
          ajuda="O visitante lê normalmente, mas não consegue selecionar nem copiar."
        />
        <SwitchField
          rotulo="Bloquear arrastar imagens"
          valor={protecao.bloquearArrastarImagem}
          onChange={(valor) => setProtecao({ ...protecao, bloquearArrastarImagem: valor })}
          ajuda="Impede arrastar a foto para a área de trabalho ou para outra aba."
        />
        <SwitchField
          rotulo="Dificultar a abertura do código-fonte (inspecionar)"
          valor={protecao.bloquearInspecao}
          onChange={(valor) => setProtecao({ ...protecao, bloquearInspecao: valor })}
          ajuda="Bloqueia F12, Ctrl+Shift+I/J/C e Ctrl+U no site. É uma barreira de dissuasão: nenhum site consegue impedir de verdade que alguém abra o inspetor do próprio navegador."
        />
        <SwitchField
          rotulo="Esconder o site do Google"
          valor={protecao.noindex}
          onChange={(valor) => setProtecao({ ...protecao, noindex: valor })}
          ajuda="Ative se quiser o site fora dos buscadores. Para tráfego pago, deixe desligado."
        />

        <p className="flex items-start gap-2 border border-border/60 bg-background/40 p-3 text-[11px] leading-relaxed text-muted-foreground">
          <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-secondary" />
          O painel nunca é afetado por essas travas — você continua copiando e
          editando normalmente.
        </p>
      </Cartao>

      <Cartao
        titulo="Sessão e tentativas de senha"
        descricao="Quanto tempo o painel fica aberto sem uso e quantas senhas erradas são aceitas antes do bloqueio temporário."
        icone={<Timer className="h-5 w-5" />}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label className={ROTULO}>Desconectar após</Label>
            <Select
              value={String(seguranca.sessaoMinutos)}
              onValueChange={(valor) =>
                setSeguranca({ ...seguranca, sessaoMinutos: Number(valor) })
              }
            >
              <SelectTrigger className="rounded-sm border-border bg-background/70 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="15">15 minutos sem uso</SelectItem>
                <SelectItem value="30">30 minutos sem uso</SelectItem>
                <SelectItem value="60">60 minutos sem uso</SelectItem>
                <SelectItem value="120">2 horas sem uso</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className={ROTULO}>Bloquear login após</Label>
            <Select
              value={String(seguranca.tentativasLogin)}
              onValueChange={(valor) =>
                setSeguranca({ ...seguranca, tentativasLogin: Number(valor) })
              }
            >
              <SelectTrigger className="rounded-sm border-border bg-background/70 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="3">3 senhas erradas</SelectItem>
                <SelectItem value="5">5 senhas erradas</SelectItem>
                <SelectItem value="10">10 senhas erradas</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <p className="text-[11px] leading-relaxed text-muted-foreground">
          O bloqueio dura 1 minuto por rodada. O servidor também limita tentativas por
          conta, independente desta configuração.
        </p>

        <Button
          type="button"
          variant="forward"
          onClick={() => void salvar()}
          disabled={salvando}
        >
          {salvando ? <Loader2 className="animate-spin" /> : <Save />}
          Salvar proteções
        </Button>
      </Cartao>

      <Cartao
        titulo="Verificação em duas etapas"
        descricao="Além da senha, o painel pede um código de 6 dígitos gerado no seu celular. Mesmo que alguém descubra a senha, não entra sem o código."
        icone={<Fingerprint className="h-5 w-5" />}
      >
        {carregandoFatores ? (
          <p className="flex items-center gap-2 text-[12px] text-muted-foreground">
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
            Conferindo o estado da conta
          </p>
        ) : doisFatoresAtivo ? (
          <>
            <p className="flex items-center gap-2 text-[12px] text-foreground">
              <CheckCircle2 className="h-4 w-4 text-secondary" />
              Ativa neste painel desde {dataLegivel(fatores[0].criadoEm)}
            </p>
            <p className="text-[11px] leading-relaxed text-muted-foreground">
              Ao entrar, o painel vai pedir o código do aplicativo autenticador.
            </p>
            <Button
              type="button"
              variant="hairline"
              onClick={() => void remover2fa(fatores[0].id)}
              disabled={processando2fa}
            >
              {processando2fa ? <Loader2 className="animate-spin" /> : <Trash2 />}
              Desativar verificação
            </Button>
          </>
        ) : cadastro ? (
          <div className="grid gap-5 sm:grid-cols-[auto_1fr]">
            <div className="border border-border/70 bg-background/60 p-3">
              <img src={cadastro.qr} alt="QR Code da verificação" className="h-44 w-44" />
            </div>

            <div className="space-y-3">
              <p className="text-[12px] leading-relaxed text-muted-foreground">
                Abra o Google Authenticator, Authy ou outro aplicativo autenticador,
                escolha “ler QR Code” e aponte para a imagem ao lado.
              </p>

              <div className="space-y-1">
                <p className={ROTULO}>Chave para guardar</p>
                <div className="flex flex-wrap items-center gap-2">
                  <code className="break-all border border-border/70 bg-background/60 px-3 py-2 text-[12px] text-foreground">
                    {cadastro.segredo}
                  </code>
                  <Button type="button" variant="ghost" size="sm" onClick={() => void copiarSegredo()}>
                    <Copy />
                    Copiar
                  </Button>
                </div>
                <p className="text-[11px] leading-relaxed text-muted-foreground">
                  Guarde esta chave (print, papel ou gerenciador de senhas). Se trocar
                  de celular, é ela que recupera o acesso.
                </p>
              </div>

              <div className="flex flex-wrap items-end gap-3">
                <div className="space-y-2">
                  <Label className={ROTULO}>Código do aplicativo</Label>
                  <Input
                    inputMode="numeric"
                    maxLength={6}
                    value={codigo}
                    onChange={(evento) => setCodigo(evento.target.value.replace(/\D/g, ""))}
                    placeholder="000000"
                    className="w-32 rounded-sm border-border bg-background/70 text-center font-mono text-lg tracking-[0.3em]"
                  />
                </div>
                <Button
                  type="button"
                  variant="forward"
                  onClick={() => void confirmarCodigo()}
                  disabled={processando2fa}
                >
                  {processando2fa ? <Loader2 className="animate-spin" /> : <ShieldCheck />}
                  Ativar
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    setCadastro(null);
                    setCodigo("");
                  }}
                  disabled={processando2fa}
                >
                  Cancelar
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <>
            <p className="text-[11px] leading-relaxed text-muted-foreground">
              Você vai precisar de um aplicativo autenticador no celular. O processo
              leva menos de dois minutos.
            </p>
            <Button
              type="button"
              variant="forward"
              onClick={() => void ativar2fa()}
              disabled={processando2fa}
            >
              {processando2fa ? <Loader2 className="animate-spin" /> : <Lock />}
              Ativar verificação em duas etapas
            </Button>
          </>
        )}
      </Cartao>

      <Cartao
        titulo="Cópia de segurança"
        descricao="Baixe um arquivo com todos os anúncios e textos do site. Serve para guardar fora do painel ou restaurar depois de uma mudança errada."
        icone={<Download className="h-5 w-5" />}
      >
        <Button type="button" variant="hairline" onClick={() => void baixarBackup()}>
          <Download />
          Baixar cópia de segurança
        </Button>
        <p className="text-[11px] leading-relaxed text-muted-foreground">
          Recomendado uma vez por semana e sempre antes de mudanças grandes no site.
        </p>
      </Cartao>

      <Cartao
        titulo="Últimos acessos"
        descricao="Quem entrou no painel, quando e de qual aparelho. Se aparecer algo que não foi você, troque a senha imediatamente."
        icone={<Smartphone className="h-5 w-5" />}
      >
        <div className="flex items-center justify-between gap-3">
          <p className="text-[11px] text-muted-foreground">
            {acessos.length === 0
              ? "Nenhum acesso registrado ainda."
              : `${acessos.length} acesso(s) recente(s)`}
          </p>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => void carregarAcessos()}
          >
            <RefreshCw />
            Atualizar
          </Button>
        </div>

        {acessos.length > 0 && (
          <ul className="space-y-2">
            {acessos.map((item) => (
              <li
                key={item.id}
                className="border border-border/60 bg-background/40 px-3 py-2 text-[12px]"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-foreground">{item.quem ?? "conta do painel"}</span>
                  <span className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                    {dataLegivel(item.created_at)}
                  </span>
                </div>
                {typeof item.detalhes.dispositivo === "string" && (
                  <p className="mt-1 break-all text-[11px] text-muted-foreground">
                    {item.detalhes.dispositivo}
                  </p>
                )}
              </li>
            ))}
          </ul>
        )}
      </Cartao>
    </div>
  );
}
