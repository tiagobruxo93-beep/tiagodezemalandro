import { safeUrl } from "@/lib/security";
import { DEFAULT_CONTENT, type SiteContent } from "@/lib/site-content";
import { AdaptiveFrame } from "@/components/site/adaptive-frame";

export function HowItWorks({ content }: { content: SiteContent }) {
  const bloco = content.steps;
  return (
    <section id="como-funciona" className="relative py-20 sm:py-28">
      <div className="section-shell">
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">{bloco.eyebrow}</p>
          <h2 className="mt-4 font-display text-4xl leading-tight text-foreground sm:text-5xl">
            {bloco.title}
          </h2>
          <p className="mt-5 text-sm leading-relaxed text-muted-foreground sm:text-base">
            {bloco.text}
          </p>
        </div>

        <div className="mt-14 grid gap-px overflow-hidden border border-border/70 bg-border/60 sm:grid-cols-2 lg:grid-cols-4">
          {bloco.items.map((step, index) => (
            <div
              key={step.title}
              className="group relative bg-background/95 p-7 transition-colors duration-300 hover:bg-card"
            >
              <span className="font-display text-[42px] leading-none text-secondary/90">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-4 font-display text-[22px] leading-tight text-foreground">
                {step.title}
              </h3>
              <p className="mt-2.5 text-[13px] leading-relaxed text-muted-foreground">
                {step.text}
              </p>
              <span className="absolute inset-x-0 bottom-0 h-px w-0 bg-secondary/70 transition-all duration-500 group-hover:w-full" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function CorrenteBanner({
  content,
  onCta,
}: {
  content: SiteContent;
  onCta?: () => void;
}) {
  return (
    <section className="relative isolate overflow-hidden border-y border-border/60">
      <div className="absolute inset-0 -z-10 bg-candle" />

      <div className="section-shell grid items-center gap-10 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
        <div className="max-w-xl">
          <p className="eyebrow">{content.corrente.eyebrow}</p>
          <h2 className="mt-4 font-display text-4xl leading-[1.05] text-foreground sm:text-5xl">
            {content.corrente.title}
            <span className="block italic text-primary">{content.corrente.highlight}</span>
          </h2>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
            {content.corrente.text}
          </p>
          <a
            href="#trabalhos"
            onClick={onCta}
            className="mt-8 inline-flex items-center gap-2 border-b border-secondary/50 pb-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-secondary transition-colors hover:border-secondary hover:text-foreground"
          >
            {content.corrente.button}
          </a>
        </div>

        <div className="relative">
          <div className="pointer-events-none absolute -inset-3 -z-10 border border-secondary/20" />
          <AdaptiveFrame
            src={
              safeUrl(content.corrente.image) ||
              safeUrl(content.hero.image) ||
              DEFAULT_CONTENT.corrente.image
            }
            alt="Firmeza da corrente de fé no terreiro"
          />
        </div>
      </div>
    </section>
  );
}
