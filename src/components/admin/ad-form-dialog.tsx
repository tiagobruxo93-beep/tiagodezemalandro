import { useEffect, useState } from "react";
import { ImagePlus, Loader2, Save } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { IMAGE_LIBRARY, slugify, type Ad } from "@/lib/ads";
import { adToDraft, emptyDraft, type AdDraft } from "@/lib/admin-ads";

const fieldLabel = "text-[10px] uppercase tracking-[0.16em] text-muted-foreground";
const fieldClass = "rounded-sm border-border bg-background/70 text-sm focus-visible:ring-secondary/50";

export function AdFormDialog({
  open,
  ad,
  nextOrder,
  onOpenChange,
  onSave,
}: {
  open: boolean;
  ad: Ad | null;
  nextOrder: number;
  onOpenChange: (open: boolean) => void;
  onSave: (draft: AdDraft) => Promise<void>;
}) {
  const [draft, setDraft] = useState<AdDraft>(emptyDraft(nextOrder));
  const [slugTouched, setSlugTouched] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setDraft(ad ? adToDraft(ad) : emptyDraft(nextOrder));
    setSlugTouched(Boolean(ad));
    setError(null);
  }, [open, ad, nextOrder]);

  const update = <K extends keyof AdDraft>(key: K, value: AdDraft[K]) => {
    setDraft((current) => ({ ...current, [key]: value }));
  };

  const handleTitle = (value: string) => {
    setDraft((current) => ({
      ...current,
      title: value,
      slug: slugTouched ? current.slug : slugify(value),
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    if (!draft.title.trim()) {
      setError("Dê um título ao anúncio.");
      return;
    }
    if (!draft.summary.trim()) {
      setError("Escreva um resumo curto para o card.");
      return;
    }
    if (draft.forward_url.trim() && !/^https?:\/\//i.test(draft.forward_url.trim())) {
      setError("O link de encaminhamento precisa começar com https://");
      return;
    }

    const imagem = (draft.image_url ?? "").trim();
    if (imagem && !imagem.startsWith("/") && !/^https?:\/\//i.test(imagem)) {
      setError("O endereço da imagem precisa começar com / ou https://");
      return;
    }

    if (draft.title.length > 200 || draft.summary.length > 600) {
      setError("Título ou resumo muito longos. Reduza o texto.");
      return;
    }

    setSaving(true);
    try {
      await onSave({
        ...draft,
        slug: draft.slug.trim() || slugify(draft.title),
      });
      onOpenChange(false);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro ao salvar o anúncio";
      setError(
        message.includes("duplicate key")
          ? "Já existe um anúncio com esse endereço (slug). Escolha outro."
          : message,
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] max-w-3xl overflow-y-auto rounded-sm border-border bg-card p-0">
        <DialogHeader className="border-b border-border/70 px-6 py-5 text-left">
          <DialogTitle className="font-display text-3xl text-foreground">
            {ad ? "Editar anúncio" : "Novo anúncio"}
          </DialogTitle>
          <DialogDescription className="text-[12px] text-muted-foreground">
            Cada anúncio ganha uma aba própria no site, com ficha completa e
            botão de encaminhamento.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 px-6 py-6">
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <Label className={fieldLabel}>Título *</Label>
              <Input
                value={draft.title}
                onChange={(event) => handleTitle(event.target.value)}
                placeholder="Ex.: Cova dos Inimigos"
                className={fieldClass}
              />
            </div>

            <div className="space-y-2">
              <Label className={fieldLabel}>Aba do site</Label>
              <Select
                value={draft.category}
                onValueChange={(value) => update("category", value)}
              >
                <SelectTrigger className={fieldClass}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="coletivo">Coletivos</SelectItem>
                  <SelectItem value="individual">Individuais</SelectItem>
                  <SelectItem value="consulta">Consultas</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className={fieldLabel}>Endereço (slug)</Label>
              <Input
                value={draft.slug}
                onChange={(event) => {
                  setSlugTouched(true);
                  update("slug", slugify(event.target.value));
                }}
                placeholder="cova-dos-inimigos"
                className={fieldClass}
              />
            </div>

            <div className="space-y-2">
              <Label className={fieldLabel}>Valor exibido</Label>
              <Input
                value={draft.price_label}
                onChange={(event) => update("price_label", event.target.value)}
                placeholder="R$ 37,99"
                className={fieldClass}
              />
            </div>

            <div className="space-y-2">
              <Label className={fieldLabel}>Texto do botão de encaminhamento</Label>
              <Input
                value={draft.forward_label}
                onChange={(event) => update("forward_label", event.target.value)}
                placeholder="Quero participar"
                className={fieldClass}
              />
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label className={fieldLabel}>Link de encaminhamento</Label>
              <Input
                value={draft.forward_url}
                onChange={(event) => update("forward_url", event.target.value)}
                placeholder="https://pay.cakto.com.br/..."
                className={fieldClass}
              />
              <p className="text-[11px] text-muted-foreground">
                Deixe vazio para encaminhar ao WhatsApp cadastrado nas
                configurações.
              </p>
            </div>

            <div className="space-y-2">
              <Label className={fieldLabel}>Linha de apoio (kicker)</Label>
              <Input
                value={draft.kicker}
                onChange={(event) => update("kicker", event.target.value)}
                placeholder="Ritual de cemitério"
                className={fieldClass}
              />
            </div>

            <div className="space-y-2">
              <Label className={fieldLabel}>Selo / badge</Label>
              <Input
                value={draft.badge ?? ""}
                onChange={(event) => update("badge", event.target.value)}
                placeholder="Poucas vagas"
                className={fieldClass}
              />
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label className={fieldLabel}>Resumo do card *</Label>
              <Textarea
                value={draft.summary}
                onChange={(event) => update("summary", event.target.value)}
                rows={3}
                placeholder="Uma ou duas frases que explicam o trabalho."
                className={fieldClass}
              />
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label className={fieldLabel}>Descrição completa</Label>
              <Textarea
                value={draft.description}
                onChange={(event) => update("description", event.target.value)}
                rows={5}
                placeholder="Detalhe como o trabalho é realizado, o que a pessoa recebe e o que precisa fazer."
                className={fieldClass}
              />
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label className={fieldLabel}>O que está incluso (um item por linha)</Label>
              <Textarea
                value={draft.includes.join("\n")}
                onChange={(event) =>
                  update(
                    "includes",
                    event.target.value.split("\n").filter((line) => line.trim() !== ""),
                  )
                }
                rows={4}
                placeholder={"Firmeza em corrente\nAviso da data no WhatsApp"}
                className={fieldClass}
              />
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label className={fieldLabel}>Imagem do anúncio</Label>
              <div className="flex flex-col gap-3 sm:flex-row">
                <div className="flex h-24 w-full shrink-0 items-center justify-center overflow-hidden border border-border/70 bg-background/60 sm:w-40">
                  {draft.image_url ? (
                    <img
                      src={draft.image_url}
                      alt="Prévia"
                      className="h-full w-full object-contain"
                    />
                  ) : (
                    <ImagePlus className="h-5 w-5 text-muted-foreground/60" />
                  )}
                </div>
                <div className="flex-1 space-y-2">
                  <Input
                    value={draft.image_url ?? ""}
                    onChange={(event) => update("image_url", event.target.value)}
                    placeholder="/images/hero-altar.jpg"
                    className={fieldClass}
                  />
                  <Select
                    value={draft.image_url ?? ""}
                    onValueChange={(value) =>
                      update("image_url", value === "__none__" ? null : value)
                    }
                  >
                    <SelectTrigger className={fieldClass}>
                      <SelectValue placeholder="Escolher da biblioteca" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="__none__">Sem imagem</SelectItem>
                      {IMAGE_LIBRARY.map((image) => (
                        <SelectItem key={image.value} value={image.value}>
                          {image.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label className={fieldLabel}>Ordem na aba</Label>
              <Input
                type="number"
                value={draft.sort_order}
                onChange={(event) => update("sort_order", Number(event.target.value))}
                className={fieldClass}
              />
            </div>

            <div className="flex items-end gap-6">
              <div className="flex items-center gap-3">
                <Switch
                  checked={draft.active}
                  onCheckedChange={(value) => update("active", value)}
                />
                <span className="text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
                  Ativo
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Switch
                  checked={draft.featured}
                  onCheckedChange={(value) => update("featured", value)}
                />
                <span className="text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
                  Destaque
                </span>
              </div>
            </div>
          </div>

          {error && (
            <p className="border-l-2 border-destructive bg-destructive/10 px-3 py-2 text-[12px] text-destructive-foreground">
              {error}
            </p>
          )}

          <div className="flex flex-col-reverse gap-2 border-t border-border/70 pt-5 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="ghost"
              size="lg"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" variant="forward" size="lg" disabled={saving}>
              {saving ? <Loader2 className="animate-spin" /> : <Save />}
              {ad ? "Salvar alterações" : "Publicar anúncio"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
