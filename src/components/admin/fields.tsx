import { useRef, useState } from "react";
import { CheckCircle2, Film, ImagePlus, Loader2, Plus, Trash2, Upload, XCircle } from "lucide-react";
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

type EstadoEnvio = {
  nome: string;
  estado: "enviando" | "ok" | "erro";
  mensagem?: string;
};

function tituloDoArquivo(nome: string) {
  const semExtensao = nome.replace(/\.[a-z0-9]+$/i, "");
  const texto = semExtensao.replace(/[-_]+/g, " ").trim();
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}

/** Envio de vários vídeos de uma vez: cada arquivo vira um card na seção. */
export function MultiVideoField({
  onEnviados,
}: {
  onEnviados: (itens: { title: string; url: string; text: string; cover: string; link: string }[]) => void;
}) {
  const [enviando, setEnviando] = useState(false);
  const [fila, setFila] = useState<EstadoEnvio[]>([]);
  const arquivoRef = useRef<HTMLInputElement | null>(null);

  const enviar = async (arquivos: FileList | null) => {
    if (!arquivos || arquivos.length === 0) return;

    const lista = Array.from(arquivos);
    setEnviando(true);
    setFila(lista.map((arquivo) => ({ nome: arquivo.name, estado: "enviando" })));

    const prontos: { title: string; url: string; text: string; cover: string; link: string }[] = [];

    for (let indice = 0; indice < lista.length; indice++) {
      const arquivo = lista[indice];

      try {
        const url = await uploadSiteVideo(arquivo);
        prontos.push({ title: tituloDoArquivo(arquivo.name), url, text: "", cover: "", link: "" });
        setFila((atual) =>
          atual.map((item, posicao) =>
            posicao === indice ? { ...item, estado: "ok" } : item,
          ),
        );
      } catch (err) {
        const mensagem = err instanceof Error ? err.message : "Falha no envio";
        setFila((atual) =>
          atual.map((item, posicao) =>
            posicao === indice ? { ...item, estado: "erro", mensagem } : item,
          ),
        );
      }
    }

    if (prontos.length > 0) {
      onEnviados(prontos);
      toast.success(
        prontos.length === 1
          ? "1 vídeo adicionado à seção"
          : `${prontos.length} vídeos adicionados à seção`,
      );
    }

    setEnviando(false);
    if (arquivoRef.current) arquivoRef.current.value = "";
  };

  const falhas = fila.filter((item) => item.estado === "erro").length;

  return (
    <div className="space-y-3 rounded-sm border border-secondary/30 bg-secondary/5 p-4">
      <div className="flex flex-wrap items-center gap-3">
        <input
          ref={arquivoRef}
          type="file"
          accept="video/mp4,video/webm,video/quicktime,video/*"
          multiple
          className="hidden"
          onChange={(event) => void enviar(event.target.files)}
        />

        <Button
          type="button"
          variant="gold"
          size="lg"
          disabled={enviando}
          onClick={() => arquivoRef.current?.click()}
        >
          {enviando ? <Loader2 className="animate-spin" /> : <Upload />}
          {enviando ? "Enviando vídeos..." : "Subir vários vídeos"}
        </Button>

        <p className="max-w-md text-[11px] leading-relaxed text-muted-foreground">
          Escolha quantos vídeos quiser de uma vez (MP4, WEBM ou MOV, até 100 MB
          cada). Cada arquivo vira um card na seção, com o nome do arquivo como
          título — depois é só ajustar o texto e a capa.
        </p>
      </div>

      {fila.length > 0 && (
        <ul className="space-y-2">
          {fila.map((item, indice) => (
            <li
              key={`${item.nome}-${indice}`}
              className="flex items-center justify-between gap-3 border border-border/60 bg-background/40 px-3 py-2 text-[12px]"
            >
              <span className="min-w-0 truncate text-foreground">{item.nome}</span>
              <span className="flex shrink-0 items-center gap-2 text-muted-foreground">
                {item.estado === "enviando" && (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    enviando
                  </>
                )}
                {item.estado === "ok" && (
                  <>
                    <CheckCircle2 className="h-3.5 w-3.5 text-secondary" />
                    enviado
                  </>
                )}
                {item.estado === "erro" && (
                  <>
                    <XCircle className="h-3.5 w-3.5 text-destructive" />
                    {item.mensagem}
                  </>
                )}
              </span>
            </li>
          ))}
        </ul>
      )}

      {!enviando && falhas > 0 && (
        <p className="text-[11px] text-destructive">
          {falhas} arquivo(s) não subiram. Confira o formato e o tamanho (limite de
          100 MB por vídeo).
        </p>
      )}
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
