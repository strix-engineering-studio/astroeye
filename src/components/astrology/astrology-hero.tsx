import Link from "next/link";

import { astrologyConfig, astrologyContent } from "@/content/astrology/profile";

export function AstrologyHero() {
  return (
    <section id="home" className="relative mx-auto max-w-6xl px-4 pb-16 pt-12 sm:px-6 lg:px-8 lg:pb-20 lg:pt-16">
      <div className="grid items-center gap-10 lg:grid-cols-[1.12fr_0.88fr]">
        <div>
          <p className="mb-5 text-[0.72rem] font-semibold uppercase tracking-[0.38em] text-[#0038FD] dark:text-[#8AB4FF]">
            {astrologyContent.hero.eyebrow}
          </p>

          <h1 className="max-w-xl text-5xl font-medium leading-[0.92] tracking-[-0.06em] text-[#0A0D14] sm:text-6xl lg:text-[5.25rem] dark:text-[#F8FAFF]">
            {astrologyContent.hero.heading.split("\n").map((line, index) => (
              <span key={line + index} className="block">
                {line}
              </span>
            ))}
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-8 text-[#667085] dark:text-[#98A2B3]">
            {astrologyContent.hero.supportingText}
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href={astrologyConfig.whatsappCommunityUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-full bg-[#0038FD] px-6 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-[#1649FF]"
            >
              Join WhatsApp Community
            </a>
            <Link
              href="#services"
              className="inline-flex items-center justify-center rounded-full border border-[#E2E6EF] bg-white/80 px-6 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-[#0A0D14] transition hover:border-[#0038FD]/30 hover:text-[#0038FD] dark:border-[#252A35] dark:bg-[#10131A]/80 dark:text-[#F8FAFF]"
            >
              Explore Consultations
            </Link>
          </div>
        </div>

        <div className="relative flex justify-center lg:justify-end">
          <div className="relative flex h-[420px] w-full max-w-[500px] items-center justify-center overflow-hidden rounded-[32px] border border-[#E2E6EF] bg-white/90 p-6 shadow-[0_30px_80px_rgba(31,41,55,0.06)] dark:border-[#252A35] dark:bg-[#10131A]/90 dark:shadow-[0_30px_80px_rgba(0,0,0,0.28)]">
            <div className="absolute inset-6 rounded-full border border-[#0038FD]/15 dark:border-[#0038FD]/20" />
            <div className="absolute inset-[6.5rem] rounded-full border border-[#0038FD]/10 dark:border-[#0038FD]/15" />
            <div className="absolute inset-[10rem] rounded-full border border-[#0038FD]/10 dark:border-[#0038FD]/15" />

            <div className="absolute left-10 top-1/2 h-px w-[22%] bg-[#0038FD]/15 dark:bg-[#0038FD]/20" />
            <div className="absolute right-10 top-1/2 h-px w-[22%] bg-[#0038FD]/15 dark:bg-[#0038FD]/20" />
            <div className="absolute left-1/2 top-10 h-[22%] w-px bg-[#0038FD]/15 dark:bg-[#0038FD]/20" />
            <div className="absolute bottom-10 left-1/2 h-[22%] w-px bg-[#0038FD]/15 dark:bg-[#0038FD]/20" />

            <div className="relative flex h-52 w-52 items-center justify-center rounded-full border border-[#0038FD]/30 bg-[radial-gradient(circle_at_center,_rgba(0,56,253,0.22),_rgba(255,255,255,0)_55%)] shadow-[0_0_60px_rgba(0,56,253,0.12)] dark:shadow-[0_0_60px_rgba(0,56,253,0.18)]">
              <div className="absolute h-32 w-32 rounded-full border border-[#0038FD]/25 dark:border-[#0038FD]/30" />
              <div className="absolute h-44 w-44 rounded-full border border-[#0038FD]/15 dark:border-[#0038FD]/20" />
              <div className="absolute h-2 w-2 rounded-full bg-[#0038FD] shadow-[0_0_18px_rgba(0,56,253,0.55)]" />
              <div className="absolute -left-5 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-[#0038FD]" />
              <div className="absolute -right-6 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-[#0038FD]" />
              <div className="absolute left-1/2 top-0 h-2 w-2 -translate-x-1/2 rounded-full bg-[#0038FD]" />
              <div className="absolute bottom-0 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-[#0038FD]" />

              <div className="flex h-28 w-28 items-center justify-center rounded-full bg-[#0038FD] text-4xl font-semibold text-white shadow-[0_0_30px_rgba(0,56,253,0.35)]">
                A
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
