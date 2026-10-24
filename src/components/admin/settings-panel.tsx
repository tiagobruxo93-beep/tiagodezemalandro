import { useEffect, useState } from "react";
import { Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { IMAGE_LIBRARY, type SiteSettings } from "@/lib/ads";
import { saveSettings } from "@/lib/admin-ads";

const fieldLabel = "text-[10px] uppercase tracking-[0.16em] text-muted-foreground";
const fieldClass =
  "rounded-sm border-border bg-background/70 text-sm focus-visible:ring-secondary/50";

export function SettingsPanel({
  settings,
  onSaved,
}: {
  settings: SiteSettings;
  onSaved: () => Promise<void>;
}) {
  const [draft, setDraft] = useState<SiteSettings>(settings);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setDraft(settings);
  }, [settings]);

  const update = <K extends keyof SiteSettings>(key: K, value: SiteSettings[K]) =>
    setDraft((current) => ({ ...current, [key]: value }));

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    try {
      await saveSettings(draft);
      await onSaved();
      toast.success("Configurações salvas");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao salvar");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <section className="border border-border/70 bg-card/40 p-5 sm:p-6">
        <p className="eyebrow">Primeira dobra do site</p>
        <h2 className="mt-2 font-display text-2xl text-foreground">Hero</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div className="space-y-2 sm:col-span-2">
            <Label className={fieldLabel}>Linha de apoio</Label>
            <Input
              value={draft.heroEyebrow}
              onChange={(event) => update("heroEyebrow", event.target.value)}
              className={fieldClass}
            />
          </div>
          <div className="space-y-2">
            <Label className={fieldLabel}>Título</Label>
            <Input
              value={draft.heroTitle}
              onChange={(event) => update("heroTitle", event.target.value)}
              className={fieldClass}
            />
          </div>
          <div className="space-y-2">
            <Label className={fieldLabel}>Destaque em vermelho</Label>
            <Input
              value={draft.heroHighlight}
              onChange={(event) => update("heroHighlight", event.target.value)}
              className={fieldClass}
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label className={fieldLabel}>Subtítulo</Label>
            <Textarea
              value={draft.heroSubtitle}
              onChange={(event) => update("heroSubtitle", event.target.value)}
              rows={3}
              className={fieldClass}
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label className={fieldLabel}>Imagem do hero</Label>
            <Select
              value={draft.heroImageUrl}
              onValueChange={(value) => update("heroImageUrl", value)}
            >
              <SelectTrigger className={fieldClass}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {IMAGE_LIBRARY.map((image) => (
                  <SelectItem key={image.value} value={image.value}>
                    {image.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      <section className="border border-border/70 bg-card/40 p-5 sm:p-6">
        <p className="eyebrow">Sobre mim</p>
        <h2 className="mt-2 font-display text-2xl text-foreground">Apresentação</h2>
        <div className="mt-5 space-y-4">
          <div className="space-y-2">
            <Label className={fieldLabel}>Título da seção</Label>
            <Input
              value={draft.aboutTitle}
              onChange={(event) => update("aboutTitle", event.target.value)}
              className={fieldClass}
            />
          </div>
          <div className="space-y-2">
            <Label className={fieldLabel}>Texto principal</Label>
            <Textarea
              value={draft.aboutText}
              onChange={(event) => update("aboutText", event.target.value)}
              rows={5}
              className={fieldClass}
            />
          </div>
        </div>
      </section>

      <section className="border border-border/70 bg-card/40 p-5 sm:p-6">
        <p className="eyebrow">Contato e pagamento</p>
        <h2 className="mt-2 font-display text-2xl text-foreground">Atendimento</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label className={fieldLabel}>WhatsApp (só números, com DDI e DDD)</Label>
            <Input
              value={draft.whatsappNumber}
              onChange={(event) => update("whatsappNumber", event.target.value)}
              placeholder="5511999999999"
              className={fieldClass}
            />
            <p className="text-[11px] text-muted-foreground">
              Usado por todos os anúncios sem link próprio.
            </p>
          </div>
          <div className="space-y-2">
            <Label className={fieldLabel}>Aviso de pagamento</Label>
            <Input
              value={draft.paymentNote}
              onChange={(event) => update("paymentNote", event.target.value)}
              className={fieldClass}
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label className={fieldLabel}>Frase do rodapé</Label>
            <Input
              value={draft.footerNote}
              onChange={(event) => update("footerNote", event.target.value)}
              className={fieldClass}
            />
          </div>
        </div>
      </section>

      <div className="flex justify-end">
        <Button type="submit" variant="forward" size="lg" disabled={saving}>
          {saving ? <Loader2 className="animate-spin" /> : <Save />}
          Salvar configurações
        </Button>
      </div>
    </form>
  );
}
