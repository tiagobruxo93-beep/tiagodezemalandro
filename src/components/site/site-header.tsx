import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TridentMark } from "@/components/brand/trident-mark";
import { cn } from "@/lib/utils";
import { buildWhatsAppLink, type SiteSettings } from "@/lib/ads";
import type { SiteContent } from "@/lib/site-content";

const NAV_LINKS = [
  { href: "/#trabalhos", label: "Trabalhos" },
  { href: "/#como-funciona", label: "Como funciona" },
  { href: "/#sobre", label: "Sobre mim" },
  { href: "/#duvidas", label: "Dúvidas" },
];

export function SiteHeader({
  settings,
  content,
}: {
  settings: SiteSettings;
  content: SiteContent;
}) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  // O espaço de vídeos fica sempre visível no menu, mesmo antes do primeiro envio.
  const links = content.videos.enabled
    ? [
        { href: "/#trabalhos", label: "Trabalhos" },
        { href: "/videos", label: "Vídeos" },
        { href: "/#como-funciona", label: "Como funciona" },
        { href: "/#sobre", label: "Sobre mim" },
        { href: "/#duvidas", label: "Dúvidas" },
      ]
    : NAV_LINKS;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled || open
          ? "border-b border-border/70 bg-background/90 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <div className="section-shell flex h-[74px] items-center justify-between gap-6">
        <Link
          to="/"
          className="group flex items-center gap-2.5 leading-none"
          onClick={() => setOpen(false)}
        >
          <TridentMark className="h-6 w-6 text-secondary transition-colors duration-300 group-hover:text-primary" />
          <span className="flex flex-col">
            <span className="font-display text-[22px] tracking-tight text-foreground">
              Pai Tiago
            </span>
            <span className="font-display text-[13px] italic text-primary">
              de Zé Malandro
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="group relative font-sans text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
              <span className="absolute -bottom-1.5 left-0 h-px w-0 bg-secondary transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button asChild variant="forward" size="sm" className="hidden sm:inline-flex">
            <a
              href={buildWhatsAppLink(settings.whatsappNumber)}
              target="_blank"
              rel="noopener noreferrer"
            >
              Participar
              <ArrowUpRight />
            </a>
          </Button>
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-label={open ? "Fechar menu" : "Abrir menu"}
            className="inline-flex h-10 w-10 items-center justify-center rounded-sm border border-border text-foreground transition-colors hover:border-secondary/60 hover:text-secondary lg:hidden"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-border/70 bg-background/98 backdrop-blur-xl lg:hidden">
          <div className="section-shell flex flex-col py-4">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="flex items-center justify-between border-b border-border/50 py-4 font-display text-xl text-foreground"
              >
                {link.label}
                <ArrowUpRight className="h-4 w-4 text-secondary" />
              </a>
            ))}
            <div className="mt-5 flex flex-col gap-2">
              <Button asChild variant="forward" size="lg">
                <a
                  href={buildWhatsAppLink(settings.whatsappNumber)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Falar no WhatsApp
                  <ArrowUpRight />
                </a>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
