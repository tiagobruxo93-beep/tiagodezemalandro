import { useEffect, useState } from "react";
import { AlertCircle, ArrowDown, ArrowUp, CheckCircle2, Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { QRCodeSVG } from "qrcode.react";
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
  MultiVideoField,
  SwitchField,
  TextAreaField,
  TextField,
  VideoField,
} from "@/components/admin/fields";
import { buildWhatsAppLink, type Ad } from "@/lib/ads";
import { registrarAtividade } from "@/lib/activity";
import {
  FRENTES,
  FUNDO_CHAVES,
  FUNDO_ROTULOS,
  SECOES_META,
  saveSiteContent,
  type FaqItem,
  type PhotoItem,
  type SiteContent,
  type StatItem,
  type StepItem,
  type VideoItem,
  type FrenteKey,
  type FundoChave,
  type FundoItem,
  type ModoFoto,
  type SecaoKey,
} from "@/lib/site-content";

const ABAS = [
  { id: "textos", rotulo: "Textos" },
  { id: "fotos", rotulo: "Fotos" },
  { id: "abas", rotulo: "Abas" },
  { id: "secoes", rotulo: "Seções" },
  { id: "sobre", rotulo: "Sobre" },
  { id: "videos", rotulo: "Vídeos" },
  { id: "eventos", rotulo: "Eventos VIP" },
  { id: "apoie", rotulo: "Apoie" },
  { id: "duvidas", rotulo: "Dúvidas" },
  { id: "legal", rotulo: "Legal" },
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

  // Atualizações de vídeo usam o estado mais recente: um envio longo pode
  // terminar depois de o usuário editar outro campo da seção.
  const setVideos = (
    atualizar: (atual: SiteContent["videos"]) => SiteContent["videos"],
  ) => setDraft((atual) => ({ ...atual, videos: atualizar(atual.videos) }));

  const linkDoQr =
    draft.apoie.link.trim() ||
    buildWhatsAppLink(
      draft.contato.whatsapp,
      "Olá, Pai Tiago! Quero ajudar o terreiro.",
    );

  const setFundo = (chave: FundoChave, parcial: Partial<FundoItem>) =>
    set("fundos", {
      itens: {
        ...draft.fundos.itens,
        [chave]: { ...draft.fundos.itens[chave], ...parcial },
      },
    });

  const atualizarVideo = (indice: number, campo: keyof VideoItem, valor: string) => {
    setVideos((atual) => {
      const itens = [...atual.items];
      itens[indice] = { ...itens[indice], [campo]: valor };
      return { ...atual, items: itens };
    });
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

  const alterado = JSON.stringify(draft) !== JSON.stringify(content);

  const salvar = async () => {
    setSalvando(true);
    try {
      const limpos = draft.videos.items.filter(
        (item) => item.url.trim() !== "" || item.title.trim() !== "",
      );

      await saveSiteContent({ ...draft, videos: { ...draft.videos, items: limpos } });
      await registrarAtividade("conteudo_salvo", { secoes: draft.secoes.ordem.length });
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

          <Grupo
            titulo="Fundos das seções"
            descricao="Cada seção tem a própria foto, com controle de intensidade e do modo de exibição. Deixe vazio para usar o fundo liso."
          >
            {FUNDO_CHAVES.map((chave) => {
              const item = draft.fundos.itens[chave];

              return (
                <div
                  key={chave}
                  className="space-y-3 rounded-sm border border-border/60 bg-background/40 p-4"
                >
                  <p className="text-[11px] uppercase tracking-[0.16em] text-secondary">
                    Fundo — {FUNDO_ROTULOS[chave]}
                  </p>

                  <ImageField
                    rotulo="Foto"
                    valor={item.src}
                    onChange={(valor) => setFundo(chave, { src: valor })}
                  />

                  <div className="flex items-center justify-between gap-3">
                    <Label className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                      Opacidade / alpha
                    </Label>
                    <span className="font-display text-lg text-secondary">
                      {item.opacidade}%
                    </span>
                  </div>
                  <Slider
                    min={5}
                    max={100}
                    step={1}
                    value={[item.opacidade]}
                    onValueChange={([valor]) => setFundo(chave, { opacidade: valor })}
                  />

                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <Label className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                      Como exibir
                    </Label>
                    <Select
                      value={item.modo}
                      onValueChange={(valor) =>
                        setFundo(chave, { modo: valor as ModoFoto })
                      }
                    >
                      <SelectTrigger className="h-9 w-[230px] rounded-sm border-border bg-background/70 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sobreposicao">
                          Sobreposição (fundo suave)
                        </SelectItem>
                        <SelectItem value="normal">Normal (foto visível)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              );
            })}
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
            descricao="Aceita qualquer formato de arquivo, ou link do YouTube/Vimeo. A capa é a imagem que aparece antes de tocar."
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
              <MultiVideoField
                onEnviados={(novos) =>
                  setVideos((atual) => ({
                    ...atual,
                    items: [...atual.items, ...(novos as VideoItem[])],
                  }))
                }
              />

              <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                  <Label className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                    Vídeos do site
                  </Label>
                  <p className="mt-1 max-w-lg text-[11px] leading-relaxed text-muted-foreground">
                    Envie o arquivo direto do computador ou celular (qualquer
                    formato, até 2 GB) ou cole um link do YouTube/Vimeo. Cada vídeo
                    vira um card na seção "Assista e entenda".
                  </p>
                </div>
              </div>

              {draft.videos.items.length === 0 && (
                <p className="rounded-sm border border-dashed border-border/70 px-4 py-8 text-center text-[12px] text-muted-foreground">
                  Nenhum vídeo ainda. Use o botão “Adicionar vídeos” acima: ele abre
                  direto a pasta de arquivos do seu computador.
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
                        setVideos((atual) => ({
                          ...atual,
                          items: atual.items.filter((_, posicao) => posicao !== indice),
                        }))
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
                    onCapa={(capa) => atualizarVideo(indice, "cover", capa)}
                    ajuda="A capa é gerada automaticamente a partir do próprio vídeo — não precisa enviar foto."
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

        <TabsContent value="eventos" className="mt-6 space-y-5">
          <Grupo
            titulo="Contato profissional (eventos)"
            descricao="Seção para contratar a sua presença em festas, lojas e eventos privados. O botão encaminha para o WhatsApp com a mensagem pronta."
          >
            <SwitchField
              rotulo="Mostrar a seção de eventos no site"
              valor={draft.eventos.ativo}
              onChange={(valor) => set("eventos", { ...draft.eventos, ativo: valor })}
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <TextField
                rotulo="Linha de apoio"
                valor={draft.eventos.eyebrow}
                onChange={(valor) => set("eventos", { ...draft.eventos, eyebrow: valor })}
              />
              <TextField
                rotulo="Texto do botão"
                valor={draft.eventos.botao}
                onChange={(valor) => set("eventos", { ...draft.eventos, botao: valor })}
              />
              <TextField
                rotulo="Título"
                valor={draft.eventos.titulo}
                onChange={(valor) => set("eventos", { ...draft.eventos, titulo: valor })}
              />
              <TextField
                rotulo="Destaque em vermelho"
                valor={draft.eventos.destaque}
                onChange={(valor) => set("eventos", { ...draft.eventos, destaque: valor })}
              />
            </div>

            <TextAreaField
              rotulo="Texto da seção"
              valor={draft.eventos.texto}
              onChange={(valor) => set("eventos", { ...draft.eventos, texto: valor })}
            />

            <TextField
              rotulo="Mensagem que vai no WhatsApp"
              valor={draft.eventos.mensagem}
              onChange={(valor) => set("eventos", { ...draft.eventos, mensagem: valor })}
              ajuda="Chega pronta na conversa quando a pessoa clica no botão."
            />

            <ListEditor<{ titulo: string; texto: string }>
              rotulo="Destaques (presença VIP)"
              itens={draft.eventos.beneficios}
              onChange={(itens) => set("eventos", { ...draft.eventos, beneficios: itens })}
              vazio={{ titulo: "", texto: "" }}
              campos={[
                { chave: "titulo", rotulo: "Título" },
                { chave: "texto", rotulo: "Descrição", tipo: "textarea" },
              ]}
              botao="Adicionar destaque"
            />

            <ImageField
              rotulo="Foto de sobreposição"
              valor={draft.eventos.imagem}
              onChange={(valor) => set("eventos", { ...draft.eventos, imagem: valor })}
              ajuda="Fica atrás do texto, com o degradê escuro para leitura."
            />

            <div className="space-y-3 rounded-sm border border-border/60 bg-background/40 p-4">
              <div className="flex items-center justify-between gap-3">
                <Label className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                  Opacidade da foto
                </Label>
                <span className="font-display text-lg text-secondary">
                  {draft.eventos.opacidade}%
                </span>
              </div>
              <Slider
                min={10}
                max={100}
                step={1}
                value={[draft.eventos.opacidade]}
                onValueChange={([valor]) =>
                  set("eventos", { ...draft.eventos, opacidade: valor })
                }
              />
            </div>
          </Grupo>
        </TabsContent>

        <TabsContent value="apoie" className="mt-6 space-y-5">
          <Grupo
            titulo="Apoie o terreiro (QR code)"
            descricao="Seção com QR code para colaborações. Cole aqui o link que o QR deve abrir (Pix, página de doação, vaquinha) — se ficar vazio, o QR abre o seu WhatsApp com a mensagem de apoio."
          >
            <SwitchField
              rotulo="Mostrar a seção no site"
              valor={draft.apoie.ativo}
              onChange={(valor) => set("apoie", { ...draft.apoie, ativo: valor })}
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <TextField
                rotulo="Linha de apoio"
                valor={draft.apoie.eyebrow}
                onChange={(valor) => set("apoie", { ...draft.apoie, eyebrow: valor })}
              />
              <TextField
                rotulo="Texto do botão"
                valor={draft.apoie.botao}
                onChange={(valor) => set("apoie", { ...draft.apoie, botao: valor })}
              />
              <TextField
                rotulo="Título"
                valor={draft.apoie.titulo}
                onChange={(valor) => set("apoie", { ...draft.apoie, titulo: valor })}
              />
              <TextField
                rotulo="Destaque em vermelho"
                valor={draft.apoie.destaque}
                onChange={(valor) => set("apoie", { ...draft.apoie, destaque: valor })}
              />
            </div>

            <TextField
              rotulo="Link do QR code"
              valor={draft.apoie.link}
              onChange={(valor) => set("apoie", { ...draft.apoie, link: valor })}
              placeholder="https://..."
              ajuda="Vazio = abre o WhatsApp. A mudança vale na hora, o QR é gerado no próprio site."
            />

            <TextAreaField
              rotulo="Frase cativante"
              valor={draft.apoie.frase}
              onChange={(valor) => set("apoie", { ...draft.apoie, frase: valor })}
              rows={3}
            />

            <TextAreaField
              rotulo="Texto de apoio"
              valor={draft.apoie.texto}
              onChange={(valor) => set("apoie", { ...draft.apoie, texto: valor })}
            />

            <ImageField
              rotulo="Foto de sobreposição"
              valor={draft.apoie.imagem}
              onChange={(valor) => set("apoie", { ...draft.apoie, imagem: valor })}
            />

            <div className="space-y-3 rounded-sm border border-border/60 bg-background/40 p-4">
              <div className="flex items-center justify-between gap-3">
                <Label className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                  Opacidade da foto
                </Label>
                <span className="font-display text-lg text-secondary">
                  {draft.apoie.opacidade}%
                </span>
              </div>
              <Slider
                min={10}
                max={100}
                step={1}
                value={[draft.apoie.opacidade]}
                onValueChange={([valor]) =>
                  set("apoie", { ...draft.apoie, opacidade: valor })
                }
              />
            </div>

            <div className="space-y-3 rounded-sm border border-border/60 bg-background/40 p-4">
              <div className="flex items-center justify-between gap-3">
                <Label className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                  Tamanho do QR code
                </Label>
                <span className="font-display text-lg text-secondary">
                  {draft.apoie.tamanhoQr}px
                </span>
              </div>
              <div className="flex flex-col items-center gap-2 rounded-sm border border-border/60 bg-background/40 p-4">
                <p className="text-[9px] uppercase tracking-[0.18em] text-muted-foreground">
                  Prévia real — é assim que aparece no site
                </p>
                <div className="bg-[hsl(38_45%_94%)] p-3">
                  <QRCodeSVG
                    value={linkDoQr}
                    size={Math.min(340, Math.max(120, draft.apoie.tamanhoQr))}
                    level="M"
                    marginSize={2}
                    bgColor="#f3ece0"
                    fgColor="#0c0908"
                    title="Prévia do QR code"
                  />
                </div>
                <p className="text-[11px] text-muted-foreground">
                  {Math.min(340, Math.max(120, draft.apoie.tamanhoQr))} px no site
                </p>
              </div>

              <Slider
                min={120}
                max={340}
                step={4}
                value={[draft.apoie.tamanhoQr]}
                onValueChange={([valor]) =>
                  set("apoie", { ...draft.apoie, tamanhoQr: valor })
                }
              />
              <p className="text-[11px] leading-relaxed text-muted-foreground">
                Entre 120 e 340 pixels. Quanto maior, mais fácil de ler de longe —
                abaixo de 160 px pode dificultar a leitura em celulares antigos.
              </p>
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

        <TabsContent value="legal" className="mt-6 space-y-5">
          <Grupo
            titulo="Dados legais da casa"
            descricao="Aparecem no topo das páginas de Termos, Privacidade e Reembolso. Preencha com os seus dados oficiais (CPF ou CNPJ, cidade/UF e e-mail de contato)."
          >
            <TextField
              rotulo="Responsável (nome ou razão social)"
              valor={draft.juridico.responsavel}
              onChange={(valor) => set("juridico", { ...draft.juridico, responsavel: valor })}
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <TextField
                rotulo="CPF ou CNPJ"
                valor={draft.juridico.documento}
                onChange={(valor) => set("juridico", { ...draft.juridico, documento: valor })}
                placeholder="000.000.000-00"
              />
              <TextField
                rotulo="Cidade / UF"
                valor={draft.juridico.cidade}
                onChange={(valor) => set("juridico", { ...draft.juridico, cidade: valor })}
                placeholder="São Paulo / SP"
              />
              <TextField
                rotulo="E-mail de contato"
                valor={draft.juridico.email}
                onChange={(valor) => set("juridico", { ...draft.juridico, email: valor })}
                placeholder="contato@seudominio.com"
              />
              <TextField
                rotulo="Data de atualização dos termos"
                valor={draft.juridico.atualizado}
                onChange={(valor) => set("juridico", { ...draft.juridico, atualizado: valor })}
                placeholder="28/10/2026"
              />
            </div>
            <TextField
              rotulo="Prazo de arrependimento (dias)"
              valor={draft.juridico.reembolsoDias}
              onChange={(valor) => set("juridico", { ...draft.juridico, reembolsoDias: valor })}
              ajuda="O Código de Defesa do Consumidor garante 7 dias em compras online. Só aumente se quiser oferecer mais."
            />
            <p className="text-[11px] leading-relaxed text-muted-foreground">
              Páginas publicadas: <strong className="text-foreground">/termos</strong>,{" "}
              <strong className="text-foreground">/privacidade</strong> e{" "}
              <strong className="text-foreground">/reembolso</strong> — com links no rodapé.
            </p>
          </Grupo>
        </TabsContent>

        <TabsContent value="contato" className="mt-6 space-y-5">
          <Grupo titulo="Contato e pagamento">
            <TextField
              rotulo="WhatsApp (link ou número)"
              valor={draft.contato.whatsapp}
              onChange={(valor) => set("contato", { ...draft.contato, whatsapp: valor })}
              placeholder="https://wa.me/551899694756"
              ajuda="Cole o link do WhatsApp (wa.me/…, link curto ou convite de grupo) ou apenas o número com DDI e DDD. O link é usado exatamente como colado; o número gera a mensagem automática."
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

      <div className="sticky bottom-0 z-20 -mx-4 flex flex-wrap items-center justify-end gap-3 border-t border-border/70 bg-background/95 px-4 py-3 backdrop-blur sm:-mx-0 sm:rounded-sm sm:border">
        <p
          className={`mr-auto flex items-center gap-2 text-[11px] ${
            alterado ? "text-secondary" : "text-muted-foreground"
          }`}
        >
          {alterado ? (
            <>
              <AlertCircle className="h-3.5 w-3.5" />
              Alterações não salvas
            </>
          ) : (
            <>
              <CheckCircle2 className="h-3.5 w-3.5" />
              Tudo salvo
            </>
          )}
        </p>
        <Button variant="forward" size="lg" onClick={() => void salvar()} disabled={salvando}>
          {salvando ? <Loader2 className="animate-spin" /> : <Save />}
          Salvar conteúdo
        </Button>
      </div>
    </div>
  );
}
