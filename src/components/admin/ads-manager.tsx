import { useMemo, useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  Copy,
  ExternalLink,
  MoreHorizontal,
  Pencil,
  Search,
  Star,
  Trash2,
  Wallet,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CATEGORY_META, type Ad } from "@/lib/ads";
import {
  deleteAd,
  duplicateAd,
  reorderAd,
  toggleAdActive,
  toggleAdFeatured,
} from "@/lib/admin-ads";

type Props = {
  ads: Ad[];
  clickCounts: Record<string, number>;
  onEdit: (ad: Ad) => void;
  onChanged: () => Promise<void>;
};

async function copy(value: string, label: string) {
  try {
    await navigator.clipboard.writeText(value);
    toast.success(label);
  } catch {
    toast.error("Não foi possível copiar o link.");
  }
}

export function AdsManager({ ads, clickCounts, onEdit, onChanged }: Props) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("todas");
  const [status, setStatus] = useState<string>("todos");
  const [pendingDelete, setPendingDelete] = useState<Ad | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return ads.filter((ad) => {
      const matchesQuery =
        !query ||
        `${ad.title} ${ad.slug} ${ad.summary}`
          .toLowerCase()
          .includes(query.toLowerCase());
      const matchesCategory = category === "todas" || ad.category === category;
      const matchesStatus =
        status === "todos" ||
        (status === "ativos" ? ad.active : !ad.active);
      return matchesQuery && matchesCategory && matchesStatus;
    });
  }, [ads, query, category, status]);

  const siblings = (ad: Ad) =>
    ads.filter((item) => item.category === ad.category);

  const run = async (id: string, action: () => Promise<void>, message: string) => {
    setBusyId(id);
    try {
      await action();
      await onChanged();
      toast.success(message);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Não foi possível concluir");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div>
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-1 flex-col gap-2 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Buscar por título, slug ou resumo"
              className="h-10 rounded-sm border-border bg-card/60 pl-9 text-sm focus-visible:ring-secondary/50"
            />
          </div>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="h-10 w-full rounded-sm border-border bg-card/60 text-sm sm:w-[160px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todas">Todas as abas</SelectItem>
              <SelectItem value="coletivo">Coletivos</SelectItem>
              <SelectItem value="individual">Individuais</SelectItem>
              <SelectItem value="consulta">Consultas</SelectItem>
            </SelectContent>
          </Select>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="h-10 w-full rounded-sm border-border bg-card/60 text-sm sm:w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos</SelectItem>
              <SelectItem value="ativos">Ativos</SelectItem>
              <SelectItem value="inativos">Inativos</SelectItem>
            </SelectContent>
          </Select>
        </div>

      </div>

      <div className="mt-4 flex items-center justify-between text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
        <span>
          {filtered.length} de {ads.length} anúncios
        </span>
        <span>Clique no menu para mais comandos</span>
      </div>

      <div className="mt-3 hidden overflow-hidden border border-border/70 bg-card/30 md:block">
        <div className="grid grid-cols-[minmax(0,1fr)_120px_120px_80px_80px_48px] items-center gap-3 border-b border-border/70 bg-card/60 px-4 py-3 text-[9px] uppercase tracking-[0.16em] text-muted-foreground">
          <span>Anúncio</span>
          <span>Aba</span>
          <span>Valor</span>
          <span>Cliques</span>
          <span>Status</span>
          <span className="text-right">Ações</span>
        </div>

        {filtered.length === 0 && (
          <p className="px-4 py-12 text-center text-sm text-muted-foreground">
            Nenhum anúncio com esses filtros.
          </p>
        )}

        {filtered.map((ad) => {
          const meta = CATEGORY_META[ad.category];
          const sortedSiblings = [...siblings(ad)].sort(
            (a, b) => a.sortOrder - b.sortOrder,
          );
          const position = sortedSiblings.findIndex((item) => item.id === ad.id);
          const disabled = busyId === ad.id;

          return (
            <div
              key={ad.id}
              className="grid grid-cols-[minmax(0,1fr)_120px_120px_80px_80px_48px] items-center gap-3 border-b border-border/50 px-4 py-3 transition-colors last:border-0 hover:bg-card/50"
            >
              <div className="flex min-w-0 items-center gap-3">
                <div className="h-11 w-11 shrink-0 overflow-hidden border border-border/60 bg-background">
                  {ad.imageUrl ? (
                    <img src={ad.imageUrl} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center font-display text-lg text-secondary/60">
                      {ad.title.charAt(0)}
                    </div>
                  )}
                </div>
                <div className="min-w-0">
                  <p className="flex items-center gap-1.5 truncate text-sm text-foreground">
                    {ad.title}
                    {ad.featured && <Star className="h-3 w-3 shrink-0 text-secondary" />}
                  </p>
                  <p className="truncate text-[11px] text-muted-foreground">/anuncio/{ad.slug}</p>
                </div>
              </div>

              <span className="text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                {meta.label}
              </span>
              <span className="font-display text-base text-secondary">{ad.priceLabel}</span>
              <span className="text-xs text-muted-foreground">
                {clickCounts[ad.id] ?? 0}
              </span>

              <div className="flex items-center gap-2">
                <Switch
                  checked={ad.active}
                  disabled={disabled}
                  onCheckedChange={() =>
                    void run(ad.id, () => toggleAdActive(ad), ad.active ? "Anúncio desativado" : "Anúncio ativado")
                  }
                />
                <span className="text-[9px] uppercase tracking-[0.1em] text-muted-foreground">
                  {ad.active ? "On" : "Off"}
                </span>
              </div>

              <div className="flex justify-end">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" disabled={disabled}>
                      <MoreHorizontal />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 border-border bg-popover">
                    <DropdownMenuLabel className="text-[9px] uppercase tracking-[0.18em] text-muted-foreground">
                      Comandos
                    </DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => onEdit(ad)}>
                      <Pencil /> Editar anúncio
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => void run(ad.id, () => duplicateAd(ad), "Anúncio duplicado")}
                    >
                      <Copy /> Duplicar
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        void copy(
                          `${window.location.origin}/anuncio/${ad.slug}`,
                          "Link do anúncio copiado",
                        )
                      }
                    >
                      <ExternalLink /> Copiar link do anúncio
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      disabled={!ad.forwardUrl}
                      onClick={() => void copy(ad.forwardUrl, "Link de pagamento copiado")}
                    >
                      <Wallet /> Copiar link de encaminhamento
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() =>
                        void run(
                          ad.id,
                          () => toggleAdFeatured(ad),
                          ad.featured ? "Destaque removido" : "Anúncio em destaque",
                        )
                      }
                    >
                      <Star /> {ad.featured ? "Remover destaque" : "Marcar destaque"}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      disabled={position <= 0}
                      onClick={() =>
                        void run(ad.id, () => reorderAd(ad, "up", sortedSiblings), "Anúncio movido para cima")
                      }
                    >
                      <ArrowUp /> Mover para cima
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      disabled={position < 0 || position >= sortedSiblings.length - 1}
                      onClick={() =>
                        void run(ad.id, () => reorderAd(ad, "down", sortedSiblings), "Anúncio movido para baixo")
                      }
                    >
                      <ArrowDown /> Mover para baixo
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => window.open(`/anuncio/${ad.slug}`, "_blank")}
                    >
                      <ExternalLink /> Abrir no site
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      disabled={!ad.forwardUrl}
                      onClick={() => window.open(ad.forwardUrl, "_blank")}
                    >
                      <Wallet /> Testar encaminhamento
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-destructive focus:text-destructive"
                      onClick={() => setPendingDelete(ad)}
                    >
                      <Trash2 /> Excluir anúncio
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-3 space-y-2 md:hidden">
        {filtered.length === 0 && (
          <p className="border border-dashed border-border/70 px-4 py-10 text-center text-sm text-muted-foreground">
            Nenhum anúncio com esses filtros.
          </p>
        )}
        {filtered.map((ad) => (
          <div key={ad.id} className="border border-border/70 bg-card/40 p-3">
            <div className="flex items-start gap-3">
              <div className="h-12 w-12 shrink-0 overflow-hidden border border-border/60">
                {ad.imageUrl ? (
                  <img src={ad.imageUrl} alt="" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center font-display text-lg text-secondary/60">
                    {ad.title.charAt(0)}
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm text-foreground">{ad.title}</p>
                <p className="text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                  {CATEGORY_META[ad.category].label} · {ad.priceLabel}
                </p>
              </div>
              <Switch
                checked={ad.active}
                onCheckedChange={() =>
                  void run(ad.id, () => toggleAdActive(ad), ad.active ? "Anúncio desativado" : "Anúncio ativado")
                }
              />
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <Button variant="hairline" size="sm" onClick={() => onEdit(ad)}>
                <Pencil /> Editar
              </Button>
              <Button
                variant="hairline"
                size="sm"
                onClick={() => void run(ad.id, () => duplicateAd(ad), "Anúncio duplicado")}
              >
                <Copy /> Duplicar
              </Button>
              <Button
                variant="hairline"
                size="sm"
                onClick={() => window.open(`/anuncio/${ad.slug}`, "_blank")}
              >
                <ExternalLink /> Ver
              </Button>
              <Button
                variant="ghost"
                size="icon"
                aria-label={`Excluir ${ad.title}`}
                className="ml-auto text-destructive hover:bg-destructive/10 hover:text-destructive"
                onClick={() => setPendingDelete(ad)}
              >
                <Trash2 />
              </Button>
            </div>
          </div>
        ))}
      </div>

      <AlertDialog open={Boolean(pendingDelete)} onOpenChange={(open) => !open && setPendingDelete(null)}>
        <AlertDialogContent className="rounded-sm border-border bg-card">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-display text-2xl text-foreground">
              Excluir “{pendingDelete?.title}”?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm text-muted-foreground">
              O anúncio sai do site e os cliques registrados nele também. Se
              quiser só tirar do ar, use o botão de ativar/desativar.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-sm border-border">Cancelar</AlertDialogCancel>
            <AlertDialogAction
              className="rounded-sm bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => {
                if (!pendingDelete) return;
                const target = pendingDelete;
                setPendingDelete(null);
                void run(target.id, () => deleteAd(target.id), "Anúncio excluído");
              }}
            >
              Excluir definitivamente
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
