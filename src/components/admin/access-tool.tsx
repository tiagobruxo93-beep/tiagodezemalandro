import { useEffect, useState } from "react";
import { Globe2, Loader2, Save, ShieldAlert, Timer } from "lucide-react";
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
import { SwitchField, TextField } from "@/components/admin/fields";
import { registrarAtividade } from "@/lib/activity";
import { gravarSeguranca } from "@/lib/site-security";
import { saveSiteContent, type SiteContent } from "@/lib/site-content";

const ROTULO = "text-[10px] uppercase tracking-[0.16em] text-muted-foreground";

/** Regras de acesso aplicadas no servidor (país, robôs e limite por minuto). */
export function AccessTool({
  content,
  onSaved,
}: {
  content: SiteContent;
  onSaved: () => Promise<void>;
}) {
  const [acesso, setAcesso] = useState(content.seguranca.acesso);
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    setAcesso(content.seguranca.acesso);
  }, [content.seguranca.acesso]);

  const salvar = async () => {
    setSalvando(true);

    try {
      const seguranca = { ...content.seguranca, acesso };
      await saveSiteContent({ ...content, seguranca });
      gravarSeguranca(seguranca);
      await registrarAtividade("acesso_regras_alteradas", acesso);
      await onSaved();
      toast.success("Regras de acesso atualizadas");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Não foi possível salvar");
    } finally {
      setSalvando(false);
    }
  };

  return (
    <section className="border border-border/70 bg-card/40 p-5 sm:p-6">
      <div className="flex items-start gap-3">
        <span className="mt-0.5 text-secondary">
          <ShieldAlert className="h-5 w-5" />
        </span>
        <div>
          <h2 className="font-display text-2xl leading-tight text-foreground">
            Controle de acesso
          </h2>
          <p className="mt-1 max-w-xl text-[12px] leading-relaxed text-muted-foreground">
            Regras aplicadas pelo servidor antes de mostrar o site. Quem for barrado vê a
            tela de bloqueio ao carregar a página.
          </p>
        </div>
      </div>

      <div className="mt-5 space-y-5">
        <div className="space-y-2">
          <TextField
            rotulo="Países bloqueados"
            valor={acesso.paisesBloqueados}
            onChange={(valor) => setAcesso({ ...acesso, paisesBloqueados: valor })}
            placeholder="US, CN, RU"
            ajuda="Códigos de 2 letras separados por vírgula (US, CN, RU, NG). Vazio = todos liberados."
          />
          <p className="flex items-start gap-1.5 text-[11px] leading-relaxed text-muted-foreground">
            <Globe2 className="mt-0.5 h-3 w-3 shrink-0" />
            Bloqueie só quando tiver certeza — quem estiver nesses países não abre o site.
          </p>
        </div>

        <div className="space-y-2">
          <TextField
            rotulo="IPs sempre liberados"
            valor={acesso.ipsLiberados}
            onChange={(valor) => setAcesso({ ...acesso, ipsLiberados: valor })}
            placeholder="189.12.34.56, 201.9.8.7"
            ajuda="Estes IPs ignoram todas as regras abaixo (útil para você e sua equipe)."
          />
        </div>

        <SwitchField
          rotulo="Bloquear robôs, scrapers e leitores automáticos"
          valor={acesso.bloquearBots}
          onChange={(valor) => setAcesso({ ...acesso, bloquearBots: valor })}
          ajuda="Barra ferramentas de cópia em massa. Atenção: também barra o Google e o Bing, então o site deixa de ser rastreado."
        />

        <div className="space-y-2">
          <Label className={ROTULO}>
            <span className="inline-flex items-center gap-1">
              <Timer className="h-3 w-3" />
              Limite de acessos por minuto (por IP)
            </span>
          </Label>
          <Select
            value={String(acesso.limitePorMinuto)}
            onValueChange={(valor) =>
              setAcesso({ ...acesso, limitePorMinuto: Number(valor) })
            }
          >
            <SelectTrigger className="w-[240px] rounded-sm border-border bg-background/70 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">Sem limite</SelectItem>
              <SelectItem value="30">30 acessos por minuto</SelectItem>
              <SelectItem value="60">60 acessos por minuto</SelectItem>
              <SelectItem value="120">120 acessos por minuto</SelectItem>
              <SelectItem value="300">300 acessos por minuto</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-[11px] leading-relaxed text-muted-foreground">
            Protege contra abertura automática em massa. Use valores altos para não
            barrar visitante apressado — 60 é um bom começo.
          </p>
        </div>

        <Button type="button" variant="forward" onClick={() => void salvar()} disabled={salvando}>
          {salvando ? <Loader2 className="animate-spin" /> : <Save />}
          Salvar regras de acesso
        </Button>
      </div>
    </section>
  );
}
