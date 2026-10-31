import { useEffect, useState } from "react";
import { ExternalLink, Loader2, MessageSquare, RotateCcw, Save } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ImageField, SwitchField, TextAreaField, TextField } from "@/components/admin/fields";
import type { Ad } from "@/lib/ads";
import { safeUrl } from "@/lib/security";
import {
  DEFAULT_CONTENT,
  saveSiteContent,
  type SiteContent,
} from "@/lib/site-content";

const ROTULO = "text-[10px] uppercase tracking-[0.16em] text-muted-foreground";

/** Ferramenta de controle da janela de entrada do site, com prévia ao vivo. */
export function PopupTool({
  content,
  ads,
  onSaved,
}: {
  content: SiteContent;
  ads: Ad[];
  onSaved: () => Promise<void>;
}) {
  const [draft, setDraft] = useState<SiteContent["popup"]>(content.popup);
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    setDraft(content.popup);
  }, [content.popup]);

  const atualizar = <K extends keyof SiteContent["popup"]>(
    chave: K,
    valor: SiteContent["popup"][K],
  ) => setDraft((atual) => ({ ...atual, [chave]: valor }));

  const anuncio =
    (draft.adSlug ? ads.find((item) => item.slug === draft.adSlug) : undefined) ??
    ads.find((item) => item.category === "individual" && item.active) ??
    ads.find((item) => item.category === "consulta" && item.active) ??
    ads[0];

  const titulo = draft.titulo.trim() || anuncio?.title || "Trabalho individual";
  const texto = draft.texto.trim() || anuncio?.summary || "";
  const imagem = draft.imagem.trim() || anuncio?.imageUrl || "";

  const salvar = async () => {
    setSalvando(true);

    try {
      await saveSiteContent({ ...content, popup: draft });
      await onSaved();
      toast.success("Janela de entrada atualizada");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Não foi possível salvar");
    } finally {
      setSalvando(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="grid gap-5 lg:grid-cols-[1.35fr_1fr]">
        <div className="space-y-5">
          <section className="border border-border/70 bg-card/40 p-5">
            <div className="flex items-start gap-3">
              <span className="mt-0.5 text-secondary">
                <MessageSquare className="h-5 w-5" />
              </span>
              <div>
                <h2 className="font-display text-2xl leading-tight text-foreground">
                  Janela de entrada
                </h2>
                <p className="mt-1 max-w-lg text-[12px] leading-relaxed text-muted-foreground">
                  A janela que abre quando a pessoa entra na página inicial, anunciando
                  um trabalho. Tudo muda aqui e aparece no site assim que salvar e
                  publicar.
                </p>
              </div>
            </div>

            <div className="mt-5 space-y-4">
              <SwitchField
                rotulo="Mostrar a janela ao entrar no site"
                valor={draft.ativo}
                onChange={(valor) => atualizar("ativo", valor)}
                ajuda="Ela abre só na página inicial e fecha no X, no Esc ou clicando fora."
              />

              <div className="space-y-2">
                <Label className={ROTULO}>Trabalho anunciado</Label>
                <Select
                  value={draft.adSlug || "__auto__"}
                  onValueChange={(valor) =>
                    atualizar("adSlug", valor === "__auto__" ? "" : valor)
                  }
                >
                  <SelectTrigger className="rounded-sm border-border bg-background/70 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__auto__">
                      Automático (primeiro trabalho individual)
                    </SelectItem>
                    {ads.map((item) => (
                      <SelectItem key={item.id} value={item.slug}>
                        {item.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-[11px] text-muted-foreground">
                  A imagem, o preço e o destino do botão vêm do anúncio escolhido.
                </p>
              </div>

              <TextField
                rotulo="Linha de apoio"
                valor={draft.eyebrow}
                onChange={(valor) => atualizar("eyebrow", valor)}
              />

              <TextField
                rotulo="Título (opcional)"
                valor={draft.titulo}
                onChange={(valor) => atualizar("titulo", valor)}
                placeholder="Vazio = usa o título do anúncio"
              />

              <TextAreaField
                rotulo="Mensagem (opcional)"
                valor={draft.texto}
                onChange={(valor) => atualizar("texto", valor)}
                rows={3}
              />

              <TextField
                rotulo="Texto do botão"
                valor={draft.botao}
                onChange={(valor) => atualizar("botao", valor)}
              />

              <ImageField
                rotulo="Imagem da janela (opcional)"
                valor={draft.imagem}
                onChange={(valor) => atualizar("imagem", valor)}
                ajuda="Vazio = usa a imagem do anúncio."
              />
            </div>
          </section>

          <section className="border border-border/70 bg-card/40 p-5">
            <p className={ROTULO}>Comportamento</p>

            <div className="mt-4 space-y-4">
              <div className="space-y-2">
                <Label className={ROTULO}>
                  Abrir depois de {draft.atraso} segundo{draft.atraso > 1 ? "s" : ""}
                </Label>
                <Slider
                  value={[draft.atraso]}
                  min={1}
                  max={10}
                  step={1}
                  onValueChange={([valor]) => atualizar("atraso", valor ?? 2)}
                />
                <p className="text-[11px] text-muted-foreground">
                  De 1 a 10 segundos depois de a página abrir.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label className={ROTULO}>Mostrar</Label>
                  <Select
                    value={draft.frequencia}
                    onValueChange={(valor) =>
                      atualizar("frequencia", valor as SiteContent["popup"]["frequencia"])
                    }
                  >
                    <SelectTrigger className="rounded-sm border-border bg-background/70 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sessao">Uma vez por visita</SelectItem>
                      <SelectItem value="dia">Uma vez por dia</SelectItem>
                      <SelectItem value="sempre">Sempre que abrir</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className={ROTULO}>O botão leva para</Label>
                  <Select
                    value={draft.destino}
                    onValueChange={(valor) =>
                      atualizar("destino", valor as SiteContent["popup"]["destino"])
                    }
                  >
                    <SelectTrigger className="rounded-sm border-border bg-background/70 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="anuncio">Ficha do anúncio</SelectItem>
                      <SelectItem value="checkout">Checkout do anúncio</SelectItem>
                      <SelectItem value="whatsapp">WhatsApp</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className={ROTULO}>Mostrar para</Label>
                  <Select
                    value={draft.publico}
                    onValueChange={(valor) =>
                      atualizar("publico", valor as SiteContent["popup"]["publico"])
                    }
                  >
                    <SelectTrigger className="rounded-sm border-border bg-background/70 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos os visitantes</SelectItem>
                      <SelectItem value="celular">Só no celular</SelectItem>
                      <SelectItem value="computador">Só no computador</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className={ROTULO}>Quando aparecer</Label>
                  <Select
                    value={draft.origem}
                    onValueChange={(valor) =>
                      atualizar("origem", valor as SiteContent["popup"]["origem"])
                    }
                  >
                    <SelectTrigger className="rounded-sm border-border bg-background/70 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Sempre que entrar</SelectItem>
                      <SelectItem value="anuncio">Só quem veio de anúncio</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <SwitchField
                rotulo="Mostrar o preço do trabalho"
                valor={draft.mostrarPreco}
                onChange={(valor) => atualizar("mostrarPreco", valor)}
              />

              <SwitchField
                rotulo="Fechar ao clicar fora da janela"
                valor={draft.fecharFora}
                onChange={(valor) => atualizar("fecharFora", valor)}
              />
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-border/60 pt-4">
              <Button type="button" variant="forward" onClick={() => void salvar()} disabled={salvando}>
                {salvando ? <Loader2 className="animate-spin" /> : <Save />}
                Salvar janela
              </Button>

              <Button
                type="button"
                variant="ghost"
                onClick={() => setDraft(DEFAULT_CONTENT.popup)}
                disabled={salvando}
              >
                <RotateCcw />
                Restaurar padrão
              </Button>

              <Button asChild variant="ghost">
                <a href="/" target="_blank" rel="noopener noreferrer">
                  <ExternalLink />
                  Ver no site
                </a>
              </Button>
            </div>
          </section>
        </div>

        <aside className="lg:sticky lg:top-4 lg:self-start">
          <div className="border border-border/70 bg-card/40 p-4">
            <p className="text-[9px] uppercase tracking-[0.18em] text-muted-foreground">
              Prévia ao vivo
            </p>

            <div className="mt-3 overflow-hidden border border-secondary/40 bg-card">
              {imagem && (
                <img
                  src={safeUrl(imagem)}
                  alt=""
                  className="h-32 w-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
              )}

              <div className="p-4">
                <p className="text-[9px] uppercase tracking-[0.2em] text-secondary">
                  {draft.eyebrow || "Trabalho individual"}
                </p>

                <p className="mt-1.5 font-display text-xl leading-tight text-foreground">
                  {titulo}
                </p>

                {texto && (
                  <p className="mt-1.5 line-clamp-3 text-[11px] leading-relaxed text-muted-foreground">
                    {texto}
                  </p>
                )}

                {draft.mostrarPreco && anuncio?.priceLabel && (
                  <p className="mt-2 font-display text-lg text-secondary">{anuncio.priceLabel}</p>
                )}

                <div className="mt-3 flex items-center justify-center bg-primary px-3 py-2 text-center text-[10px] font-semibold uppercase tracking-[0.14em] text-primary-foreground">
                  {draft.botao || "Quero esse trabalho"}
                </div>

                <p className="mt-2 text-center text-[9px] uppercase tracking-[0.14em] text-muted-foreground">
                  Agora não
                </p>
              </div>
            </div>

            <p className="mt-3 text-[11px] leading-relaxed text-muted-foreground">
              {draft.ativo
                ? `Abre ${draft.atraso}s depois de entrar na home · ${draft.frequencia === "sessao" ? "1x por visita" : draft.frequencia === "dia" ? "1x por dia" : "sempre"}`
                : "Janela desligada — não aparece no site."}
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
