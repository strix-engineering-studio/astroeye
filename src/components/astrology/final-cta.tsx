import { ArrowUpRight } from "lucide-react";

import { astrologyConfig } from "@/content/astrology/profile";

export function FinalCta() {
  return (
    <section className="mx-auto max-w-6xl px-4 pb-20 pt-6 sm:px-6 lg:px-8">
      <div className="relative overflow-hidden rounded-[32px] bg-[#0038FD] p-8 text-white shadow-[0_28px_80px_rgba(0,56,253,0.32)] sm:p-10 lg:p-12">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.18),_transparent_32%)]" />
        <div className="absolute -left-10 top-10 h-40 w-40 rounded-full border border-white/15" />
        <div className="absolute -right-10 bottom-10 h-44 w-44 rounded-full border border-white/15" />

        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.38em] text-white/75">
              Ready to connect?
            </p>
            <h2 className="mt-4 text-4xl font-medium tracking-[-0.06em] text-white sm:text-5xl">
              Join the Astroeye WhatsApp community and stay connected for consultation information, updates and astrology content.
            </h2>
          </div>

          <a
            href={astrologyConfig.whatsappCommunityUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-[#0038FD] transition hover:bg-[#F3F7FF]"
          >
            Join WhatsApp Community
            <ArrowUpRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
