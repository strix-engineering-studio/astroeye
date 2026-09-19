import { ArrowUpRight } from "lucide-react";

import { astrologyConfig, astrologyContent } from "@/content/astrology/profile";

export function CommunityCta() {
  return (
    <section id="community" className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
      <div className="relative overflow-hidden rounded-[32px] bg-[#0038FD] p-8 text-white shadow-[0_28px_80px_rgba(0,56,253,0.32)] sm:p-10 lg:p-12">
        <div className="absolute -right-16 top-10 h-52 w-52 rounded-full border border-white/20" />
        <div className="absolute -left-10 bottom-8 h-44 w-44 rounded-full border border-white/15" />
        <div className="absolute left-1/2 top-1/2 h-[24rem] w-[24rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10" />

        <div className="relative grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <div>
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.38em] text-white/75">
              Community
            </p>
            <h2 className="mt-4 text-4xl font-medium tracking-[-0.06em] text-white sm:text-5xl">
              {astrologyContent.community.heading}
            </h2>
            <p className="mt-4 max-w-xl text-lg leading-8 text-white/85">
              {astrologyContent.community.copy}
            </p>
          </div>

          <div className="flex justify-center lg:justify-end">
            <div className="relative flex h-60 w-60 items-center justify-center rounded-full border border-white/30 bg-white/6">
              <div className="absolute inset-8 rounded-full border border-white/25" />
              <div className="absolute inset-[5rem] rounded-full border border-white/20" />
              <div className="absolute h-28 w-28 rounded-full bg-white text-4xl font-semibold text-[#0038FD]">
                <div className="flex h-full w-full items-center justify-center">A</div>
              </div>
            </div>
          </div>
        </div>

        <div className="relative mt-8">
          <a
            href={astrologyConfig.whatsappCommunityUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-[#0038FD] transition hover:bg-[#F3F7FF]"
          >
            Join WhatsApp Community
            <ArrowUpRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
