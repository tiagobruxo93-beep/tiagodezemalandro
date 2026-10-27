import { useRef, useState } from "react";
import { Film, ImagePlus, Loader2, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CONTENT_IMAGES, uploadSiteImage, uploadSiteVideo } from "@/lib/site-content";
import { safeUrl } from "@/lib/security";

const LABEL = "text-[10px] uppercase tracking-[0.16em] text-muted-foreground";
const FIELD = "rounded-sm border-border bg-background/70 text-sm focus-visible:ring-secondary/50";

export function TextField({
  rotulo,
  valor,
  onChange,
  placeholder,
  ajuda,
}: {
  rotulo: string;
  valor: string;
  onChange: (valor: string) => void;
  placeholder?: string;
  ajuda?: string;
}) {
  return (
    <div className="space-y-2">
      <Label className={LABEL}>{rotulo}</Label>
      <Input
        value={valor}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        maxLength={400}
        className={FIELD}
      />
      {ajuda && <p className="text-[11px] text-muted-foreground">{ajuda}</p>}
    </div>
  );
}

export function TextAreaField({
  rotulo,
  valor,
  onChange,
  rows = 3,
  ajuda,
}: {
  rotulo: string;
  valor: string;
  onChange: (valor: string) => void;
  rows?: number;
  ajuda?: string;
}) {
  return (
    <div className="space-y-2">
      <Label className={LABEL}>{rotulo}</Label>
      <Textarea
        value={valor}
        onChange={(event) => onChange(event.target.value)}
        rows={rows}
        maxLength={6000}
        className={FIELD}
      />
      {ajuda && <p className="text-[11px] text-muted-foreground">{ajuda}</p>}
    </div>
  );
}

export function SwitchField({
  rotulo,
  valor,
  onChange,
  ajuda,
}: {
  rotulo: string;
  valor: boolean;
  onChange: (valor: boolean) => void;
  ajuda?: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <Switch checked={valor} onCheckedChange={onChange} />
      <div>
        <p className="text-[12px] text-foreground">{rotulo}</p>
        {ajuda && <p className="text-[11px] text-muted-foreground">{ajuda}</p>}
      </div>
    </div>
  );
}

export function ImageField({
  rotulo,
  valor,
  onChange,
  ajuda,
}: {
  rotulo: string;
  valor: string;
  onChange: (valor: string) => void;
  ajuda?: string;
}) {
  const [enviando, setEnviando] = useState(false);
  const arquivoRef = useRef<HTMLInputElement | null>(null);

  const enviar = async (file: File | undefined) => {
    if (!file) return;
    setEnviando(true);
    try {
      const url = await uploadSiteImage(file);
      onChange(url);
      toast.success("Foto enviada");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Falha no envio da foto");
    } finally {
      setEnviando(false);
      if (arquivoRef.current) arquivoRef.current.value = "";
    }
  };

  return (
    <div className="space-y-3">
      <Label className={LABEL}>{rotulo}</Label>

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="flex h-28 w-full shrink-0 items-center justify-center overflow-hidden border border-border/70 bg-background/60 sm:w-44">
          {valor ? (
            <img src={safeUrl(valor)} alt="" className="h-full w-full object-contain" />
          ) : (
            <ImagePlus className="h-5 w-5 text-muted-foreground/60" />
          )}
        </div>

        <div className="flex-1 space-y-2">
          <Input
            value={valor}
            onChange={(event) => onChange(event.target.value)}
            placeholder="https://... ou /images/..."
            maxLength={500}
            className={FIELD}
          />

          <div className="flex flex-wrap gap-2">
            <input
              ref={arquivoRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(event) => void enviar(event.target.files?.[0])}
            />
            <Button
              type="button"
              variant="hairline"
              size="sm"
              disabled={enviando}
              onClick={() => arquivoRef.current?.click()}
            >
              {enviando ? <Loader2 className="animate-spin" /> : <ImagePlus />}
              Enviar foto
            </Button>

            <Select
              value=""
              onValueChange={(value) => {
                if (value === "__limpar__") {
                  onChange("");
                  return;
                }
                onChange(value);
              }}
            >
              <SelectTrigger className="h-9 w-[190px] rounded-sm border-border bg-background/70 text-xs">
                <SelectValue placeholder="Escolher da biblioteca" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__limpar__">Sem imagem</SelectItem>
                {CONTENT_IMAGES.map((imagem) => (
                  <SelectItem key={imagem.value} value={imagem.value}>
                    {imagem.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {ajuda && <p className="text-[11px] text-muted-foreground">{ajuda}</p>}
        </div>
      </div>
    </div>
  );
}

export function VideoField({
  rotulo,
  valor,
  onChange,
  ajuda,
}: {
  rotulo: string;
  valor: string;
  onChange: (valor: string) => void;
  ajuda?: string;
}) {
  const [enviando, setEnviando] = useState(false);
  const arquivoRef = useRef<HTMLInputElement | null>(null);

  const enviar = async (file: File | undefined) => {
    if (!file) return;
    setEnviando(true);

    try {
      const url = await uploadSiteVideo(file);
      onChange(url);
      toast.success("Vídeo enviado");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Falha no envio do vídeo");
    } finally {
      setEnviando(false);
      if (arquivoRef.current) arquivoRef.current.value = "";
    }
  };

  return (
    <div className="space-y-3">
      <Label className={LABEL}>{rotulo}</Label>

      {valor && (
        <video
          src={safeUrl(valor)}
          controls
          preload="metadata"
          className="max-h-64 w-full rounded-sm border border-border/70 bg-black"
        />
      )}

      <Input
        value={valor}
        onChange={(event) => onChange(event.target.value)}
        placeholder="https://www.youtube.com/watch?v=... ou arquivo enviado"
        maxLength={500}
        className={FIELD}
      />

      <div className="flex flex-wrap items-center gap-3">
        <input
          ref={arquivoRef}
          type="file"
          accept="video/mp4,video/webm,video/quicktime,video/*"
          className="hidden"
          onChange={(event) => void enviar(event.target.files?.[0])}
        />
        <Button
          type="button"
          variant="hairline"
          size="sm"
          disabled={enviando}
          onClick={() => arquivoRef.current?.click()}
        >
          {enviando ? <Loader2 className="animate-spin" /> : <Film />}
          {enviando ? "Enviando vídeo..." : "Enviar vídeo do computador"}
        </Button>
        <span className="text-[11px] text-muted-foreground">
          MP4, WEBM ou MOV até 100 MB. Vídeos grandes podem levar alguns minutos.
        </span>
      </div>

      {ajuda && <p className="text-[11px] text-muted-foreground">{ajuda}</p>}
    </div>
  );
}

export interface CampoLista<T> {
  chave: keyof T & string;
  rotulo: string;
  tipo?: "text" | "textarea";
  ajuda?: string;
}

export function ListEditor<T extends Record<string, string>>({
  rotulo,
  itens,
  onChange,
  vazio,
  campos,
  ajuda,
  botao = "Adicionar item",
}: {
  rotulo: string;
  itens: T[];
  onChange: (itens: T[]) => void;
  vazio: T;
  campos: CampoLista<T>[];
  ajuda?: string;
  botao?: string;
}) {
  const atualizar = (indice: number, chave: keyof T & string, valor: string) => {
    const lista = [...itens];
    lista[indice] = { ...lista[indice], [chave]: valor };
    onChange(lista);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-end justify-between gap-3">
        <div>
          <Label className={LABEL}>{rotulo}</Label>
          {ajuda && <p className="mt-1 text-[11px] text-muted-foreground">{ajuda}</p>}
        </div>
        <Button
          type="button"
          variant="hairline"
          size="sm"
          onClick={() => onChange([...itens, { ...vazio }])}
        >
          <Plus />
          {botao}
        </Button>
      </div>

      <div className="space-y-3">
        {itens.map((item, indice) => (
          <div
            key={indice}
            className="rounded-sm border border-border/70 bg-background/40 p-4"
          >
            <div className="grid gap-3 sm:grid-cols-2">
              {campos.map((campo) => (
                <div
                  key={campo.chave}
                  className={campo.tipo === "textarea" ? "sm:col-span-2" : ""}
                >
                  {campo.tipo === "textarea" ? (
                    <TextAreaField
                      rotulo={campo.rotulo}
                      valor={item[campo.chave] ?? ""}
                      onChange={(valor) => atualizar(indice, campo.chave, valor)}
                      rows={2}
                    />
                  ) : (
                    <TextField
                      rotulo={campo.rotulo}
                      valor={item[campo.chave] ?? ""}
                      onChange={(valor) => atualizar(indice, campo.chave, valor)}
                      ajuda={campo.ajuda}
                    />
                  )}
                </div>
              ))}
            </div>

            <div className="mt-3 flex justify-end">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-destructive hover:bg-destructive/10"
                onClick={() => onChange(itens.filter((_, posicao) => posicao !== indice))}
              >
                <Trash2 />
                Remover
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
