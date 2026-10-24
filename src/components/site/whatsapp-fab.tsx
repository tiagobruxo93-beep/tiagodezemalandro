import { MessageCircle } from "lucide-react";
import { buildWhatsAppLink, type SiteSettings } from "@/lib/ads";

export function WhatsAppFab({ settings }: { settings: SiteSettings }) {
  return (
    <a
      href={buildWhatsAppLink(settings.whatsappNumber)}
      target="_blank"
      rel="noreferrer"
      aria-label="Falar no WhatsApp"
      className="group fixed bottom-5 right-5 z-40 inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary px-4 py-3.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-primary-foreground shadow-glow transition-transform duration-300 hover:scale-[1.03] sm:bottom-7 sm:right-7"
    >
      <MessageCircle className="h-4 w-4" />
      <span className="hidden sm:inline">Falar com o Pai Tiago</span>
    </a>
  );
}
