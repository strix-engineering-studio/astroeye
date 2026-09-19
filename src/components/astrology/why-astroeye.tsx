import { astrologyContent } from "@/content/astrology/profile";

export function WhyAstroeye() {
  return (
    <section id="why-astroeye" className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
      <div className="mb-10 text-center">
        <p className="text-[0.7rem] font-semibold uppercase tracking-[0.38em] text-[#0038FD] dark:text-[#8AB4FF]">
          Why Astroeye
        </p>
        <h2 className="mt-4 text-4xl font-medium tracking-[-0.06em] text-[#0A0D14] sm:text-5xl dark:text-[#F8FAFF]">
          Clear guidance with a grounded approach.
        </h2>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {astrologyContent.benefits.map((benefit) => (
          <div
            key={benefit.title}
            className="rounded-[22px] border border-[#E2E6EF] bg-white/90 p-6 shadow-[0_18px_48px_rgba(15,23,42,0.03)] dark:border-[#252A35] dark:bg-[#10131A]/90 dark:shadow-[0_18px_48px_rgba(0,0,0,0.2)]"
          >
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-[#0038FD]/8 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-[#0038FD] dark:bg-[#0038FD]/10 dark:text-[#8AB4FF]">
              {benefit.title.slice(0, 2)}
            </div>
            <h3 className="text-xl font-medium tracking-[-0.05em] text-[#0A0D14] dark:text-[#F8FAFF]">
              {benefit.title}
            </h3>
            <p className="mt-3 text-base leading-7 text-[#667085] dark:text-[#98A2B3]">
              {benefit.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
