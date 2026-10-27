import { useEffect, useState } from "react";
import { ArrowDown, ArrowUp, Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ImageField,
  ListEditor,
  SwitchField,
  TextAreaField,
  TextField,
  VideoField,
} from "@/components/admin/fields";
import type { Ad } from "@/lib/ads";
import {
  FRENTES,
  SECOES_META,
  saveSiteContent,
  type FaqItem,
  type PhotoItem,
  type SiteContent,
  type StatItem,
  type StepItem,
  type VideoItem,
  type FrenteKey,
  type SecaoKey,
} from "@/lib/site-content";

const ABAS = [
  { id: "textos", rotulo: "Textos" },
  { id: "fotos", rotulo: "Fotos" },
  { id: "abas", rotulo: "Abas" },
  { id: "secoes", rotulo: "Seções" },
  { id: "sobre", rotulo: "Sobre" },
  { id: "videos", rotulo: "Vídeos" },
  { id: "duvidas", rotulo: "Dúvidas" },
  { id: "contato", rotulo: "Contato" },
];

function Grupo({
  titulo,
  descricao,
  children,
}: {
  titulo: string;
  descricao?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border border-border/70 bg-card/40 p-5 sm:p-6">
      <p className="eyebrow">{titulo}</p>
      {descricao && (
        <p className="mt-2 max-w-xl text-[12px] leading-relaxed text-muted-foreground">
          {descricao}
        </p>
      )}
      <div className="mt-5 space-y-4">{children}</div>
    </section>
  );
}

export function ContentEditor({
  content,
  ads,
  onSaved,
}: {
  content: SiteContent;
  ads: Ad[];
  onSaved: () => Promise<void>;
}) {
  const [draft, setDraft] = useState<SiteContent>(content);
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    setDraft(content);
  }, [content]);

  const set = <K extends keyof SiteContent>(chave: K, valor: SiteContent[K]) =>
    setDraft((atual) => ({ ...atual, [chave]: valor }));

  const atualizarVideo = (indice: number, campo: keyof VideoItem, valor: string) => {
    const itens = [...draft.videos.items];
    itens[indice] = { ...itens[indice], [campo]: valor };
    set("videos", { ...draft.videos, items: itens });
  };

  const moverAba = (indice: number, direcao: -1 | 1) => {
    const ordem = [...draft.abas.ordem];
    const alvo = indice + direcao;

    if (alvo < 0 || alvo >= ordem.length) return;

    [ordem[indice], ordem[alvo]] = [ordem[alvo], ordem[indice]];
    set("abas", { ...draft.abas, ordem });
  };

  const moverSecao = (indice: number, direcao: -1 | 1) => {
    const ordem = [...draft.secoes.ordem];
    const alvo = indice + direcao;

    if (alvo < 0 || alvo >= ordem.length) return;

    [ordem[indice], ordem[alvo]] = [ordem[alvo], ordem[indice]];
    set("secoes", { ordem });
  };

  const salvar = async () => {
    setSalvando(true);
    try {
      const limpos = draft.videos.items.filter(
        (item) => item.url.trim() !== "" || item.title.trim() !== "",
      );

      await saveSiteContent({ ...draft, videos: { ...draft.videos, items: limpos } });
      await onSaved();
      toast.success("Conteúdo salvo");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao salvar o conteúdo");
    } finally {
      setSalvando(false);
    }
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="textos" className="w-full">
        <div className="overflow-x-auto scrollbar-none">
          <TabsList className="inline-flex h-auto gap-1 rounded-none border border-border/70 bg-card/40 p-1">
            {ABAS.map((aba) => (
              <TabsTrigger
                key={aba.id}
                value={aba.id}
                className="rounded-sm px-3.5 py-2.5 text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                {aba.rotulo}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        <TabsContent value="textos" className="mt-6 space-y-5">
          <Grupo titulo="Topo do site">
            <TextField
              rotulo="Linha de apoio"
              valor={draft.hero.eyebrow}
              onChange={(valor) => set("hero", { ...draft.hero, eyebrow: valor })}
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <TextField
                rotulo="Título principal"
                valor={draft.hero.title}
                onChange={(valor) => set("hero", { ...draft.hero, title: valor })}
              />
              <TextField
                rotulo="Destaque em vermelho"
                valor={draft.hero.highlight}
                onChange={(valor) => set("hero", { ...draft.hero, highlight: valor })}
              />
            </div>
            <TextAreaField
              rotulo="Subtítulo"
              valor={draft.hero.subtitle}
              onChange={(valor) => set("hero", { ...draft.hero, subtitle: valor })}
            />
          </Grupo>

          <Grupo
            titulo="Como funciona"
            descricao="Os passos são numerados automaticamente na ordem desta lista."
          >
            <TextField
              rotulo="Linha de apoio"
              valor={draft.steps.eyebrow}
              onChange={(valor) => set("steps", { ...draft.steps, eyebrow: valor })}
            />
            <TextField
              rotulo="Título da seção"
              valor={draft.steps.title}
              onChange={(valor) => set("steps", { ...draft.steps, title: valor })}
            />
            <TextAreaField
              rotulo="Texto de abertura"
              valor={draft.steps.text}
              onChange={(valor) => set("steps", { ...draft.steps, text: valor })}
            />
            <ListEditor<StepItem>
              rotulo="Passos"
              itens={draft.steps.items}
              onChange={(itens) => set("steps", { ...draft.steps, items: itens })}
              vazio={{ title: "", text: "" }}
              campos={[
                { chave: "title", rotulo: "Título do passo" },
                { chave: "text", rotulo: "Descrição", tipo: "textarea" },
              ]}
              botao="Adicionar passo"
            />
          </Grupo>

          <Grupo titulo="Faixa “nessa corrente”">
            <TextField
              rotulo="Linha de apoio"
              valor={draft.corrente.eyebrow}
              onChange={(valor) => set("corrente", { ...draft.corrente, eyebrow: valor })}
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <TextField
                rotulo="Título"
                valor={draft.corrente.title}
                onChange={(valor) => set("corrente", { ...draft.corrente, title: valor })}
              />
              <TextField
                rotulo="Destaque em vermelho"
                valor={draft.corrente.highlight}
                onChange={(valor) => set("corrente", { ...draft.corrente, highlight: valor })}
              />
            </div>
            <TextAreaField
              rotulo="Texto"
              valor={draft.corrente.text}
              onChange={(valor) => set("corrente", { ...draft.corrente, text: valor })}
            />
            <TextField
              rotulo="Texto do botão"
              valor={draft.corrente.button}
              onChange={(valor) => set("corrente", { ...draft.corrente, button: valor })}
            />
          </Grupo>

          <Grupo titulo="Seção dos anúncios">
            <TextField
              rotulo="Linha de apoio"
              valor={draft.trabalhos.eyebrow}
              onChange={(valor) => set("trabalhos", { ...draft.trabalhos, eyebrow: valor })}
            />
            <TextField
              rotulo="Título da seção"
              valor={draft.trabalhos.title}
              onChange={(valor) => set("trabalhos", { ...draft.trabalhos, title: valor })}
            />
            <TextAreaField
              rotulo="Texto de apoio"
              valor={draft.trabalhos.text}
              onChange={(valor) => set("trabalhos", { ...draft.trabalhos, text: valor })}
              ajuda="Os anúncios em si ficam na aba Anúncios deste painel."
            />
          </Grupo>
        </TabsContent>

        <TabsContent value="fotos" className="mt-6 space-y-5">
          <Grupo
            titulo="Fotos principais"
            descricao="Você pode enviar uma foto do seu computador/celular, escolher uma da biblioteca do site ou colar um endereço."
          >
            <ImageField
              rotulo="Imagem do topo"
              valor={draft.hero.image}
              onChange={(valor) => set("hero", { ...draft.hero, image: valor })}
            />
            <ImageField
              rotulo="Foto da faixa “nessa corrente”"
              valor={draft.corrente.image}
              onChange={(valor) => set("corrente", { ...draft.corrente, image: valor })}
            />
            <ImageField
              rotulo="Foto da seção Sobre"
              valor={draft.sobre.image}
              onChange={(valor) => set("sobre", { ...draft.sobre, image: valor })}
            />
          </Grupo>

          <Grupo titulo="Galeria de fotos">
            <TextField
              rotulo="Título da galeria"
              valor={draft.galeria.title}
              onChange={(valor) => set("galeria", { ...draft.galeria, title: valor })}
            />
            <TextAreaField
              rotulo="Texto de apoio"
              valor={draft.galeria.text}
              onChange={(valor) => set("galeria", { ...draft.galeria, text: valor })}
            />

            <div className="space-y-4">
              {draft.galeria.photos.map((foto, indice) => (
                <div key={indice} className="rounded-sm border border-border/70 bg-background/40 p-4">
                  <ImageField
                    rotulo={`Foto ${indice + 1}`}
                    valor={foto.url}
                    onChange={(valor) => {
                      const fotos = [...draft.galeria.photos];
                      fotos[indice] = { ...fotos[indice], url: valor };
                      set("galeria", { ...draft.galeria, photos: fotos });
                    }}
                  />
                  <div className="mt-3 grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
                    <TextField
                      rotulo="Descrição da foto"
                      valor={foto.alt}
                      onChange={(valor) => {
                        const fotos = [...draft.galeria.photos];
                        fotos[indice] = { ...fotos[indice], alt: valor };
                        set("galeria", { ...draft.galeria, photos: fotos });
                      }}
                      ajuda="Usada para acessibilidade e busca no Google."
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:bg-destructive/10"
                      onClick={() =>
                        set("galeria", {
                          ...draft.galeria,
                          photos: draft.galeria.photos.filter((_, posicao) => posicao !== indice),
                        })
                      }
                    >
                      Remover
                    </Button>
                  </div>
                </div>
              ))}

              <Button
                type="button"
                variant="hairline"
                size="sm"
                onClick={() =>
                  set("galeria", {
                    ...draft.galeria,
                    photos: [...draft.galeria.photos, { url: "", alt: "" } as PhotoItem],
                  })
                }
              >
                Adicionar foto
              </Button>
            </div>
          </Grupo>
        </TabsContent>

        <TabsContent value="sobre" className="mt-6 space-y-5">
          <Grupo titulo="Sobre mim">
            <TextField
              rotulo="Linha de apoio"
              valor={draft.sobre.eyebrow}
              onChange={(valor) => set("sobre", { ...draft.sobre, eyebrow: valor })}
            />
            <TextField
              rotulo="Título"
              valor={draft.sobre.title}
              onChange={(valor) => set("sobre", { ...draft.sobre, title: valor })}
            />
            <TextAreaField
              rotulo="Texto"
              valor={draft.sobre.text}
              onChange={(valor) => set("sobre", { ...draft.sobre, text: valor })}
              rows={7}
              ajuda="Cada linha vira um parágrafo."
            />
            <TextField
              rotulo="Frase sobre a foto"
              valor={draft.sobre.quote}
              onChange={(valor) => set("sobre", { ...draft.sobre, quote: valor })}
            />
            <TextField
              rotulo="Texto do botão"
              valor={draft.sobre.button}
              onChange={(valor) => set("sobre", { ...draft.sobre, button: valor })}
            />
            <ListEditor<StatItem>
              rotulo="Números em destaque"
              itens={draft.sobre.stats}
              onChange={(itens) => set("sobre", { ...draft.sobre, stats: itens })}
              vazio={{ value: "", label: "" }}
              campos={[
                { chave: "value", rotulo: "Número" },
                { chave: "label", rotulo: "Legenda" },
              ]}
              botao="Adicionar número"
            />
          </Grupo>
        </TabsContent>

        <TabsContent value="videos" className="mt-6 space-y-5">
          <Grupo
            titulo="Seção de vídeos"
            descricao="Aceita YouTube, Vimeo ou arquivo .mp4. A capa é a imagem que aparece antes de tocar."
          >
            <SwitchField
              rotulo="Mostrar a seção de vídeos no site"
              valor={draft.videos.enabled}
              onChange={(valor) => set("videos", { ...draft.videos, enabled: valor })}
            />
            <TextField
              rotulo="Linha de apoio"
              valor={draft.videos.eyebrow}
              onChange={(valor) => set("videos", { ...draft.videos, eyebrow: valor })}
            />
            <TextField
              rotulo="Título da seção"
              valor={draft.videos.title}
              onChange={(valor) => set("videos", { ...draft.videos, title: valor })}
            />
            <TextAreaField
              rotulo="Texto de apoio"
              valor={draft.videos.text}
              onChange={(valor) => set("videos", { ...draft.videos, text: valor })}
            />

            <div className="space-y-3">
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                  <Label className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                    Vídeos do site
                  </Label>
                  <p className="mt-1 max-w-lg text-[11px] leading-relaxed text-muted-foreground">
                    Envie o vídeo direto do computador ou celular (MP4, WEBM ou MOV)
                    ou cole um link do YouTube/Vimeo. Cada vídeo vira um card na
                    seção "Assista e entenda".
                  </p>
                </div>
                <Button
                  type="button"
                  variant="hairline"
                  size="sm"
                  onClick={() =>
                    set("videos", {
                      ...draft.videos,
                      items: [
                        ...draft.videos.items,
                        { title: "", text: "", url: "", cover: "" } as VideoItem,
                      ],
                    })
                  }
                >
                  Adicionar vídeo
                </Button>
              </div>

              {draft.videos.items.length === 0 && (
                <p className="rounded-sm border border-dashed border-border/70 px-4 py-8 text-center text-[12px] text-muted-foreground">
                  Nenhum vídeo ainda. Clique em "Adicionar vídeo" e envie o arquivo
                  do seu computador.
                </p>
              )}

              {draft.videos.items.map((item, indice) => (
                <div
                  key={indice}
                  className="space-y-4 rounded-sm border border-border/70 bg-background/40 p-4"
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-[11px] uppercase tracking-[0.16em] text-secondary">
                      Vídeo {indice + 1}
                    </p>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:bg-destructive/10"
                      onClick={() =>
                        set("videos", {
                          ...draft.videos,
                          items: draft.videos.items.filter((_, posicao) => posicao !== indice),
                        })
                      }
                    >
                      Remover
                    </Button>
                  </div>

                  <TextField
                    rotulo="Título do vídeo"
                    valor={item.title}
                    onChange={(valor) => atualizarVideo(indice, "title", valor)}
                  />

                  <VideoField
                    rotulo="Vídeo (arquivo do computador ou link)"
                    valor={item.url}
                    onChange={(valor) => atualizarVideo(indice, "url", valor)}
                  />

                  <ImageField
                    rotulo="Capa (aparece antes de tocar)"
                    valor={item.cover}
                    onChange={(valor) => atualizarVideo(indice, "cover", valor)}
                    ajuda="Se ficar vazia, aparece um retângulo escuro com o botão de play."
                  />

                  <div className="space-y-2">
                    <Label className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                      Trabalho relacionado (opcional)
                    </Label>
                    <Select
                      value={item.link.trim() === "" ? "__nenhum__" : item.link}
                      onValueChange={(valor) =>
                        atualizarVideo(indice, "link", valor === "__nenhum__" ? "" : valor)
                      }
                    >
                      <SelectTrigger className="rounded-sm border-border bg-background/70 text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="__nenhum__">Nenhum</SelectItem>
                        {ads.map((ad) => (
                          <SelectItem key={ad.id} value={`/anuncio/${ad.slug}`}>
                            {ad.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-[11px] text-muted-foreground">
                      Escolhendo um anúncio, o vídeo ganha o botão “Ver o trabalho”,
                      que leva direto para a ficha dele.
                    </p>
                  </div>

                  <TextAreaField
                    rotulo="Descrição"
                    valor={item.text}
                    onChange={(valor) => atualizarVideo(indice, "text", valor)}
                    rows={2}
                  />
                </div>
              ))}
            </div>
          </Grupo>
        </TabsContent>

        <TabsContent value="duvidas" className="mt-6 space-y-5">
          <Grupo titulo="Perguntas frequentes">
            <TextField
              rotulo="Linha de apoio"
              valor={draft.faq.eyebrow}
              onChange={(valor) => set("faq", { ...draft.faq, eyebrow: valor })}
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <TextField
                rotulo="Título"
                valor={draft.faq.title}
                onChange={(valor) => set("faq", { ...draft.faq, title: valor })}
              />
              <TextField
                rotulo="Destaque em dourado"
                valor={draft.faq.highlight}
                onChange={(valor) => set("faq", { ...draft.faq, highlight: valor })}
              />
            </div>
            <TextAreaField
              rotulo="Texto de apoio"
              valor={draft.faq.intro}
              onChange={(valor) => set("faq", { ...draft.faq, intro: valor })}
            />
            <ListEditor<FaqItem>
              rotulo="Perguntas"
              itens={draft.faq.items}
              onChange={(itens) => set("faq", { ...draft.faq, items: itens })}
              vazio={{ q: "", a: "" }}
              campos={[
                { chave: "q", rotulo: "Pergunta" },
                { chave: "a", rotulo: "Resposta", tipo: "textarea" },
              ]}
              botao="Adicionar pergunta"
            />
          </Grupo>
        </TabsContent>

        <TabsContent value="contato" className="mt-6 space-y-5">
          <Grupo titulo="Contato e pagamento">
            <TextField
              rotulo="WhatsApp (só números, com DDI e DDD)"
              valor={draft.contato.whatsapp}
              onChange={(valor) => set("contato", { ...draft.contato, whatsapp: valor })}
              placeholder="5511999999999"
              ajuda="Usado por todos os anúncios que não têm link próprio."
            />
            <TextField
              rotulo="Link do Instagram"
              valor={draft.contato.instagram}
              onChange={(valor) => set("contato", { ...draft.contato, instagram: valor })}
            />
            <TextField
              rotulo="Aviso de pagamento"
              valor={draft.contato.paymentNote}
              onChange={(valor) => set("contato", { ...draft.contato, paymentNote: valor })}
            />
            <TextField
              rotulo="Frase do rodapé"
              valor={draft.rodape.note}
              onChange={(valor) => set("rodape", { note: valor })}
            />
          </Grupo>
        </TabsContent>
        <TabsContent value="abas" className="mt-6 space-y-5">
          <Grupo
            titulo="Abas dos trabalhos"
            descricao="Defina o nome de cada aba, a ordem, qual abre primeiro e quais aparecem no site. Anúncios de uma aba desligada deixam de aparecer na página inicial."
          >
            <div className="max-w-xs space-y-2">
              <Label className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                Aba que abre primeiro
              </Label>
              <Select
                value={draft.abas.inicial}
                onValueChange={(valor) =>
                  set("abas", { ...draft.abas, inicial: valor as FrenteKey })
                }
              >
                <SelectTrigger className="rounded-sm border-border bg-background/70 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {FRENTES.map((frente) => (
                    <SelectItem key={frente} value={frente}>
                      {draft.abas.itens[frente].label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4">
              {draft.abas.ordem.map((frente, indice) => {
                const item = draft.abas.itens[frente];

                return (
                  <div
                    key={frente}
                    className="rounded-sm border border-border/70 bg-background/40 p-4"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <p className="text-[11px] uppercase tracking-[0.16em] text-secondary">
                        {item.label || frente} · {indice + 1}ª posição
                      </p>
                      <div className="flex gap-1">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          aria-label="Mover para cima"
                          disabled={indice === 0}
                          onClick={() => moverAba(indice, -1)}
                        >
                          <ArrowUp />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          aria-label="Mover para baixo"
                          disabled={indice === draft.abas.ordem.length - 1}
                          onClick={() => moverAba(indice, 1)}
                        >
                          <ArrowDown />
                        </Button>
                      </div>
                    </div>

                    <div className="mt-3 space-y-3">
                      <SwitchField
                        rotulo="Mostrar esta aba no site"
                        valor={item.active}
                        onChange={(valor) =>
                          set("abas", {
                            ...draft.abas,
                            itens: {
                              ...draft.abas.itens,
                              [frente]: { ...item, active: valor },
                            },
                          })
                        }
                      />
                      <div className="grid gap-3 sm:grid-cols-2">
                        <TextField
                          rotulo="Nome da aba"
                          valor={item.label}
                          onChange={(valor) =>
                            set("abas", {
                              ...draft.abas,
                              itens: {
                                ...draft.abas.itens,
                                [frente]: { ...item, label: valor },
                              },
                            })
                          }
                        />
                        <TextField
                          rotulo="Frase à direita"
                          valor={item.hint}
                          onChange={(valor) =>
                            set("abas", {
                              ...draft.abas,
                              itens: {
                                ...draft.abas.itens,
                                [frente]: { ...item, hint: valor },
                              },
                            })
                          }
                        />
                      </div>
                      <TextAreaField
                        rotulo="Descrição da aba"
                        valor={item.text}
                        onChange={(valor) =>
                          set("abas", {
                            ...draft.abas,
                            itens: {
                              ...draft.abas.itens,
                              [frente]: { ...item, text: valor },
                            },
                          })
                        }
                        rows={2}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </Grupo>
        </TabsContent>

        <TabsContent value="secoes" className="mt-6 space-y-5">
          <Grupo
            titulo="Ordem das seções da página inicial"
            descricao="O topo fica sempre primeiro. Use as setas para decidir o que vem depois — por exemplo, trabalhos logo abaixo do topo e depois como funciona."
          >
            <ul className="space-y-2">
              {draft.secoes.ordem.map((secao, indice) => (
                <li
                  key={secao}
                  className="flex items-center justify-between gap-3 rounded-sm border border-border/70 bg-background/40 px-4 py-3"
                >
                  <div>
                    <p className="text-[13px] text-foreground">
                      {indice + 1}. {SECOES_META[secao as SecaoKey].label}
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      {SECOES_META[secao as SecaoKey].descricao}
                    </p>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      aria-label="Mover para cima"
                      disabled={indice === 0}
                      onClick={() => moverSecao(indice, -1)}
                    >
                      <ArrowUp />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      aria-label="Mover para baixo"
                      disabled={indice === draft.secoes.ordem.length - 1}
                      onClick={() => moverSecao(indice, 1)}
                    >
                      <ArrowDown />
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          </Grupo>
        </TabsContent>

      </Tabs>

      <div className="sticky bottom-0 z-20 -mx-4 flex justify-end border-t border-border/70 bg-background/95 px-4 py-3 backdrop-blur sm:-mx-0 sm:rounded-sm sm:border">
        <Button variant="forward" size="lg" onClick={() => void salvar()} disabled={salvando}>
          {salvando ? <Loader2 className="animate-spin" /> : <Save />}
          Salvar conteúdo
        </Button>
      </div>
    </div>
  );
}
