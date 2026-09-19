"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";

import { astrologyContent } from "@/content/astrology/profile";

export function AstrologyFaq() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section id="faq" className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
      <div className="mb-10 text-center">
        <p className="text-[0.7rem] font-semibold uppercase tracking-[0.38em] text-[#0038FD] dark:text-[#8AB4FF]">
          FAQ
        </p>
        <h2 className="mt-4 text-4xl font-medium tracking-[-0.06em] text-[#0A0D14] sm:text-5xl dark:text-[#F8FAFF]">
          Common questions about consultations.
        </h2>
      </div>

      <div className="space-y-3">
        {astrologyContent.faqs.map((item, index) => {
          const expanded = openIndex === index;

          return (
            <div
              key={item.question}
              className="overflow-hidden rounded-[18px] border border-[#E2E6EF] bg-white/90 dark:border-[#252A35] dark:bg-[#10131A]/90"
            >
              <button
                type="button"
                className="flex w-full items-center justify-between gap-6 px-5 py-4 text-left sm:px-6"
                aria-expanded={expanded}
                aria-controls={`faq-panel-${index}`}
                onClick={() => setOpenIndex(expanded ? -1 : index)}
              >
                <span className="text-base font-medium text-[#0A0D14] dark:text-[#F8FAFF] sm:text-lg">
                  {item.question}
                </span>
                <ChevronDown
                  className={`h-5 w-5 shrink-0 text-[#0038FD] transition-transform dark:text-[#8AB4FF] ${expanded ? "rotate-180" : ""}`}
                />
              </button>

              {expanded ? (
                <div id={`faq-panel-${index}`} className="border-t border-[#E2E6EF] px-5 py-4 text-base leading-7 text-[#667085] dark:border-[#252A35] dark:text-[#98A2B3] sm:px-6">
                  {item.answer}
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </section>
  );
}
