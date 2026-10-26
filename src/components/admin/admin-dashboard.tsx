import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Activity,
  Download,
  ExternalLink,
  LayoutList,
  LogOut,
  Megaphone,
  Plus,
  Settings2,
  Star,
  Wallet,
  Video,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { AdsManager } from "@/components/admin/ads-manager";
import { AdFormDialog } from "@/components/admin/ad-form-dialog";
import { ContentEditor } from "@/components/admin/content-editor";
import { TridentMark } from "@/components/brand/trident-mark";
import { useAds, useSiteSettings } from "@/hooks/use-site-data";
import { createAd, fetchClickCounts, updateAd, type AdDraft } from "@/lib/admin-ads";
import { exportarDados } from "@/lib/backup";
import type { Ad } from "@/lib/ads";
import { cn } from "@/lib/utils";

type View = "anuncios" | "conteudo";

export function AdminDashboard({
  email,
  onSignOut,
}: {
  email: string;
  onSignOut: () => void;
}) {
  const { ads, loading, reload: reloadAds } = useAds();
  const { settings, content, reload: reloadSettings } = useSiteSettings();
  const [view, setView] = useState<View>("anuncios");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Ad | null>(null);
  const [clicks, setClicks] = useState<{ byAd: Record<string, number>; total: number }>({
    byAd: {},
    total: 0,
  });

  const loadClicks = useCallback(async () => {
    setClicks(await fetchClickCounts());
  }, []);

  useEffect(() => {
    void loadClicks();
  }, [loadClicks]);

  const nextOrder = useMemo(() => {
    if (ads.length === 0) return 1;
    return Math.max(...ads.map((ad) => ad.sortOrder)) + 1;
  }, [ads]);

  const stats = useMemo(
    () => [
      {
        label: "Anúncios",
        value: String(ads.length),
        hint: `${ads.filter((ad) => ad.active).length} no ar`,
        icon: LayoutList,
      },
      {
        label: "Encaminhamentos",
        value: String(clicks.total),
        hint: "cliques nos botões",
        icon: Activity,
      },
      {
        label: "Destaques",
        value: String(ads.filter((ad) => ad.featured).length),
        hint: "aparecem primeiro",
        icon: Star,
      },
      {
        label: "Links externos",
        value: String(ads.filter((ad) => ad.forwardUrl.startsWith("http")).length),
        hint: "checkout configurado",
        icon: Wallet,
      },
      {
        label: "Vídeos publicados",
        value: String(content.videos.items.length),
        hint: content.videos.enabled ? "seção visível no site" : "seção desligada",
        icon: Video,
      },
    ],
    [ads, clicks.total, content.videos.enabled, content.videos.items.length],
  );

  const openNew = () => {
    setEditing(null);
    setDialogOpen(true);
  };

  const openEdit = (ad: Ad) => {
    setEditing(ad);
    setDialogOpen(true);
  };

  const handleSave = async (draft: AdDraft) => {
    if (editing) {
      await updateAd(editing.id, draft);
      toast.success("Anúncio atualizado");
    } else {
      await createAd(draft);
      toast.success("Anúncio publicado");
    }
    await reloadAds();
  };

  const refreshAll = async () => {
    await Promise.all([reloadAds(), reloadSettings(), loadClicks()]);
  };

  const navItems: { id: View; label: string; icon: typeof LayoutList }[] = [
    { id: "anuncios", label: "Anúncios", icon: Megaphone },
    { id: "conteudo", label: "Conteúdo do site", icon: Settings2 },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="lg:grid lg:grid-cols-[260px_1fr]">
        <aside className="hidden border-r border-border/70 bg-card/30 lg:flex lg:h-screen lg:flex-col lg:justify-between lg:sticky lg:top-0">
          <div>
            <div className="border-b border-border/70 px-6 py-6">
              <Link to="/" className="flex items-center gap-2.5 leading-none">
                <TridentMark className="h-6 w-6 text-secondary" />
                <span className="flex flex-col">
                  <span className="font-display text-xl text-foreground">Pai Tiago</span>
                  <span className="font-display text-[12px] italic text-primary">
                    de Zé Malandro
                  </span>
                </span>
              </Link>
              <p className="mt-3 text-[9px] uppercase tracking-[0.24em] text-secondary">
                Painel da casa
              </p>
            </div>

            <nav className="space-y-1 p-3">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setView(item.id)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-sm px-3 py-2.5 text-left text-[11px] font-medium uppercase tracking-[0.12em] transition-colors",
                    view === item.id
                      ? "bg-primary/15 text-foreground"
                      : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
                  )}
                >
                  <item.icon className={cn("h-4 w-4", view === item.id && "text-secondary")} />
                  {item.label}
                </button>
              ))}
            </nav>

            <div className="px-3 pt-2">
              <div className="border border-border/60 bg-background/40 p-3">
                <p className="text-[9px] uppercase tracking-[0.18em] text-muted-foreground">
                  Encurtador da casa
                </p>
                <p className="mt-2 text-[12px] leading-relaxed text-muted-foreground">
                  Cada anúncio tem uma página própria: compartilhe o link direto
                  no Instagram ou no WhatsApp.
                </p>
                <Link
                  to="/#trabalhos"
                  className="mt-3 inline-flex items-center gap-1 text-[10px] uppercase tracking-[0.14em] text-secondary hover:text-foreground"
                >
                  Ver site <ExternalLink className="h-3 w-3" />
                </Link>
              </div>
            </div>
          </div>

          <div className="border-t border-border/70 p-3">
            <p className="truncate px-2 text-[11px] text-muted-foreground">{email}</p>
            <button
              type="button"
              onClick={onSignOut}
              className="mt-2 flex w-full items-center gap-3 rounded-sm px-3 py-2 text-left text-[11px] uppercase tracking-[0.12em] text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground"
            >
              <LogOut className="h-4 w-4" />
              Sair do painel
            </button>
          </div>
        </aside>

        <div className="min-w-0">
          <header className="sticky top-0 z-30 border-b border-border/70 bg-background/90 backdrop-blur-xl">
            <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-8">
              <div className="flex items-center gap-3">
                <Link to="/" className="flex flex-col leading-none lg:hidden">
                  <span className="font-display text-lg text-foreground">Pai Tiago</span>
                  <span className="font-display text-[10px] italic text-primary">
                    de Zé Malandro
                  </span>
                </Link>
                <span className="hidden text-[10px] uppercase tracking-[0.2em] text-muted-foreground lg:inline">
                  Administração
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
                  <Link to="/">
                    <ExternalLink />
                    Ver site
                  </Link>
                </Button>
                <Button
                  variant="hairline"
                  size="sm"
                  onClick={() => {
                    void exportarDados()
                      .then(() => toast.success("Cópia de segurança baixada"))
                      .catch(() =>
                        toast.error("Não foi possível gerar a cópia de segurança"),
                      );
                  }}
                >
                  <Download />
                  Baixar cópia
                </Button>
                <Button variant="forward" size="sm" onClick={openNew}>
                  <Plus />
                  Novo anúncio
                </Button>
              </div>
            </div>

            <div className="flex gap-1 overflow-x-auto border-t border-border/60 px-4 py-2 scrollbar-none lg:hidden">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setView(item.id)}
                  className={cn(
                    "whitespace-nowrap rounded-sm px-3 py-1.5 text-[10px] uppercase tracking-[0.12em]",
                    view === item.id
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground",
                  )}
                >
                  {item.label}
                </button>
              ))}
              <button
                type="button"
                onClick={onSignOut}
                className="ml-auto whitespace-nowrap px-3 py-1.5 text-[10px] uppercase tracking-[0.12em] text-muted-foreground"
              >
                Sair
              </button>
            </div>
          </header>

          <main className="px-4 py-6 sm:px-8 sm:py-8">
            {view === "anuncios" ? (
              <>
                <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
                  <div>
                    <p className="eyebrow">Painel de administração</p>
                    <h1 className="mt-3 font-display text-4xl text-foreground sm:text-5xl">
                      Seus anúncios
                    </h1>
                    <p className="mt-2 max-w-xl text-[13px] leading-relaxed text-muted-foreground">
                      Crie abas individuais, troque links de pagamento, reordene,
                      destaque e ative cada trabalho. Tudo que você muda aqui
                      aparece no site na hora.
                    </p>
                  </div>
                  <p className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                    {settings.paymentNote}
                  </p>
                </div>

                <div className="mt-7 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
                  {stats.map((stat) => (
                    <div
                      key={stat.label}
                      className="border border-border/70 bg-card/40 p-4"
                    >
                      <div className="flex items-center justify-between">
                        <p className="text-[9px] uppercase tracking-[0.16em] text-muted-foreground">
                          {stat.label}
                        </p>
                        <stat.icon className="h-3.5 w-3.5 text-secondary/70" />
                      </div>
                      <p className="mt-2 font-display text-3xl leading-none text-foreground">
                        {stat.value}
                      </p>
                      <p className="mt-1 text-[10px] uppercase tracking-[0.12em] text-muted-foreground/70">
                        {stat.hint}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-8">
                  {loading ? (
                    <div className="space-y-2">
                      {[0, 1, 2, 3].map((key) => (
                        <div
                          key={key}
                          className="h-[68px] animate-pulse border border-border/60 bg-card/40"
                        />
                      ))}
                    </div>
                  ) : (
                    <AdsManager
                      ads={ads}
                      clickCounts={clicks.byAd}
                      onEdit={openEdit}
                      onChanged={refreshAll}
                    />
                  )}
                </div>
              </>
            ) : (
              <>
                <div>
                  <p className="eyebrow">Painel de administração</p>
                  <h1 className="mt-3 font-display text-4xl text-foreground sm:text-5xl">
                    Conteúdo do site
                  </h1>
                  <p className="mt-2 max-w-xl text-[13px] leading-relaxed text-muted-foreground">
                    Fotos, textos, vídeos, dúvidas e contato — tudo que aparece no
                    site, sem mexer em código.
                  </p>
                </div>
                <div className="mt-7 max-w-4xl">
                  <ContentEditor content={content} onSaved={reloadSettings} />
                </div>
              </>
            )}
          </main>
        </div>
      </div>

      <AdFormDialog
        open={dialogOpen}
        ad={editing}
        nextOrder={nextOrder}
        onOpenChange={setDialogOpen}
        onSave={handleSave}
      />
    </div>
  );
}
