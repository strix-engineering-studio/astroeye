import { ArrowUpRight } from "lucide-react";

import { astrologyConfig, astrologyContent } from "@/content/astrology/profile";

export function ConsultationInfo() {
  return (
    <section id="consultation" className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
      <div className="rounded-[30px] border border-[#E2E6EF] bg-white/90 p-6 shadow-[0_25px_70px_rgba(15,23,42,0.04)] dark:border-[#252A35] dark:bg-[#10131A]/90 dark:shadow-[0_25px_70px_rgba(0,0,0,0.25)] sm:p-8 lg:p-10">
        <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
          <div>
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.38em] text-[#0038FD] dark:text-[#8AB4FF]">
              {astrologyContent.consultation.heading}
            </p>

            <h2 className="mt-4 text-4xl font-medium tracking-[-0.06em] text-[#0A0D14] sm:text-5xl dark:text-[#F8FAFF]">
              What you may need before your session.
            </h2>

            <ul className="mt-6 space-y-3">
              {astrologyContent.consultation.whatYouMayNeed.map((item) => (
                <li key={item} className="flex items-center gap-3 text-base text-[#667085] dark:text-[#98A2B3]">
                  <span className="inline-flex h-2.5 w-2.5 rounded-full bg-[#0038FD]" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-[24px] border border-[#E2E6EF] bg-[#F7F9FC] p-5 dark:border-[#252A35] dark:bg-[#0B0F16]">
            <p className="text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-[#0038FD] dark:text-[#8AB4FF]">
              Consultation format
            </p>
            <ul className="mt-5 space-y-3 text-base text-[#0A0D14] dark:text-[#F8FAFF]">
              {astrologyContent.consultation.format.map((item) => (
                <li key={item} className="flex items-center justify-between gap-4 rounded-full border border-[#E2E6EF] bg-white px-4 py-3 dark:border-[#252A35] dark:bg-[#10131A]">
                  <span>{item}</span>
                  <span className="h-2 w-2 rounded-full bg-[#0038FD]" />
                </li>
              ))}
            </ul>

            <div className="mt-6 rounded-[18px] border border-[#E2E6EF] bg-white p-4 dark:border-[#252A35] dark:bg-[#10131A]">
              <p className="text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-[#0038FD] dark:text-[#8AB4FF]">
                Availability
              </p>
              <p className="mt-2 text-base text-[#0A0D14] dark:text-[#F8FAFF]">
                {astrologyContent.consultation.availability}
              </p>
            </div>

            <a
              href={astrologyConfig.whatsappCommunityUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#0038FD] px-5 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-[#1649FF]"
            >
              Join WhatsApp Community
              <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
