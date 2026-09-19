"use client";

import { MessageCircleDashed } from "lucide-react";
import { usePathname } from "next/navigation";

export function CommandMenu() {
  const pathname = usePathname();

  if (pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <a
      href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}`}
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-5 right-5 z-50 inline-flex items-center gap-2 rounded border border-emerald-300/20 bg-emerald-400 px-4 py-3 text-sm font-medium text-slate-950 shadow-2xl shadow-emerald-500/20 transition hover:-translate-y-0.5 hover:bg-emerald-300 dark:border-emerald-200/25 dark:bg-emerald-400 dark:text-slate-950"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircleDashed className="size-4" />
      <span>WhatsApp</span>
    </a>
  );
}
