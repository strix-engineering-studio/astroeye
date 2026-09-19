import { MessageCircleMore } from "lucide-react";

import { astrologyConfig } from "@/content/astrology/profile";

export function FloatingWhatsAppButton() {
  return (
    <a
      href={astrologyConfig.whatsappCommunityUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Join Astroeye WhatsApp community"
      className="fixed bottom-5 right-5 z-50 inline-flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-3 text-sm font-semibold text-white shadow-[0_18px_32px_rgba(37,211,102,0.32)] transition hover:scale-[1.02] hover:bg-[#22c55e] sm:bottom-7 sm:right-7 md:px-5"
    >
      <MessageCircleMore className="h-5 w-5" />
      <span className="hidden md:inline">WhatsApp</span>
    </a>
  );
}
