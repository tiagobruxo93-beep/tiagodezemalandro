import { useMemo, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { AdCard } from "@/components/site/ad-card";
import {
  AD_TABS,
  CATEGORY_META,
  type Ad,
  type AdCategory,
  type SiteSettings,
} from "@/lib/ads";
import type { SiteContent } from "@/lib/site-content";

export function AdsTabsSection({
  ads,
  settings,
  content,
  loading,
}: {
  ads: Ad[];
  settings: SiteSettings;
  content: SiteContent;
  loading: boolean;
}) {
  const [tab, setTab] = useState<AdCategory>("coletivo");

  const porAba = useMemo(() => {
    const grupos = {
      coletivo: [] as Ad[],
      individual: [] as Ad[],
      consulta: [] as Ad[],
    };

    ads.forEach((ad) => {
      grupos[ad.category].push(ad);
    });

    return grupos;
  }, [ads]);

  const listaDaAba = porAba[tab] ?? [];

  return (
    <section id="trabalhos" className="relative scroll-mt-24 pb-16 pt-8 sm:pb-24 sm:pt-10">
      <div className="section-shell">
        <div className="flex flex-col gap-8 border-b border-border/60 pb-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-xl">
            <p className="eyebrow">{content.trabalhos.eyebrow}</p>
            <h2 className="mt-4 font-display text-4xl leading-tight text-foreground sm:text-5xl">
              {content.trabalhos.title}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              {content.trabalhos.text}
            </p>
          </div>

          <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            {ads.length} anúncios ativos
          </div>
        </div>

        <Tabs
          value={tab}
          onValueChange={(valor) => setTab(valor as AdCategory)}
          className="mt-8"
        >
          <div className="overflow-x-auto pb-1 scrollbar-none">
            <TabsList className="inline-flex h-auto min-w-full gap-1 rounded-none border border-border/70 bg-card/40 p-1 sm:min-w-0">
              {AD_TABS.map((item) => (
                <TabsTrigger
                  key={item.value}
                  value={item.value}
                  className="group flex items-center gap-2 rounded-sm px-3 py-2.5 font-sans text-[9px] font-medium uppercase tracking-[0.1em] text-muted-foreground transition-all data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-glow sm:px-5 sm:text-[11px] sm:tracking-[0.14em]"
                >
                  {item.label}
                  <span className="hidden rounded-sm border border-border/70 px-1.5 py-0.5 text-[9px] leading-none text-muted-foreground group-data-[state=active]:border-primary-foreground/30 group-data-[state=active]:text-primary-foreground/80 sm:inline">
                    {porAba[item.value].length}
                  </span>
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {AD_TABS.map((item) => {
            const lista = porAba[item.value];

            return (
              <TabsContent key={item.value} value={item.value} className="mt-8">
                <div className="mb-6 flex flex-wrap items-center justify-between gap-2">
                  <p className="max-w-xl text-[13px] leading-relaxed text-muted-foreground">
                    {CATEGORY_META[item.value].description}
                  </p>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground/70">
                    {item.hint}
                  </p>
                </div>

                {loading ? (
                  <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {[0, 1, 2, 3, 4, 5].map((key) => (
                      <div
                        key={key}
                        className="h-[430px] animate-pulse rounded-sm border border-border/60 bg-card/50"
                      >
                        <Skeleton className="h-[200px] w-full rounded-none" />
                        <div className="space-y-3 p-5">
                          <Skeleton className="h-6 w-3/4" />
                          <Skeleton className="h-3 w-full" />
                          <Skeleton className="h-3 w-5/6" />
                          <Skeleton className="mt-8 h-10 w-full" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : lista.length === 0 ? (
                  <div className="rounded-sm border border-dashed border-border/70 px-6 py-16 text-center">
                    <p className="font-display text-2xl text-foreground">
                      Nenhum anúncio nesta aba por enquanto
                    </p>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Fale com o Pai Tiago no WhatsApp para saber das próximas
                      aberturas.
                    </p>
                  </div>
                ) : (
                  <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {lista.map((ad) => (
                      <AdCard key={ad.id} ad={ad} settings={settings} />
                    ))}
                  </div>
                )}
              </TabsContent>
            );
          })}
        </Tabs>

        <p className="mt-8 text-center text-[10px] uppercase tracking-[0.2em] text-muted-foreground/70">
          {content.contato.paymentNote}
        </p>

        <p className="sr-only" aria-live="polite">
          {listaDaAba.length} anúncios nesta aba
        </p>
      </div>
    </section>
  );
}
