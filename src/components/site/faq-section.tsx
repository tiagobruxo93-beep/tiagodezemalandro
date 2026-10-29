import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { SiteContent } from "@/lib/site-content";
import { SectionBackdrop } from "@/components/site/section-backdrop";

export function FaqSection({ content }: { content: SiteContent }) {
  const faq = content.faq;

  if (faq.items.length === 0) return null;

  return (
    <section
      id="duvidas"
      className="relative isolate scroll-mt-24 overflow-hidden py-20 sm:py-24"
    >
      <SectionBackdrop
        src={content.fundos?.duvidas}
        opacidade={content.fundos?.opacidade}
      />
      <div className="section-shell grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <div>
          <p className="eyebrow">{faq.eyebrow}</p>
          <h2 className="mt-4 font-display text-4xl leading-[1.05] text-foreground sm:text-5xl">
            {faq.title}
            <span className="block italic text-secondary">{faq.highlight}</span>
          </h2>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
            {faq.intro}
          </p>
        </div>

        <Accordion type="single" collapsible className="w-full">
          {faq.items.map((item, index) => (
            <AccordionItem
              key={`${item.q}-${index}`}
              value={`item-${index}`}
              className="border-b border-border/70"
            >
              <AccordionTrigger className="py-5 text-left font-display text-[21px] leading-snug text-foreground hover:text-secondary hover:no-underline">
                {item.q}
              </AccordionTrigger>
              <AccordionContent className="pb-5 pr-6 text-[13px] leading-relaxed text-muted-foreground">
                {item.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
