import { astrologyContent } from "@/content/astrology/profile";

export function ConsultationProcess() {
  return (
    <section id="process" className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
      <div className="mb-10 text-center">
        <p className="text-[0.7rem] font-semibold uppercase tracking-[0.38em] text-[#0038FD] dark:text-[#8AB4FF]">
          How It Works
        </p>
        <h2 className="mt-4 text-4xl font-medium tracking-[-0.06em] text-[#0A0D14] sm:text-5xl dark:text-[#F8FAFF]">
          A simple process, designed for clarity.
        </h2>
      </div>

      <div className="relative">
        <div className="absolute left-1/2 top-0 hidden h-[2px] w-[80%] -translate-x-1/2 bg-[linear-gradient(90deg,transparent,rgba(0,56,253,0.15),transparent)] lg:block" />

        <div className="grid gap-6 lg:grid-cols-4">
          {astrologyContent.process.map((step, index) => (
            <div
              key={step.title}
              className="relative rounded-[22px] border border-[#E2E6EF] bg-white/90 p-6 shadow-[0_18px_48px_rgba(15,23,42,0.03)] dark:border-[#252A35] dark:bg-[#10131A]/90 dark:shadow-[0_18px_48px_rgba(0,0,0,0.2)]"
            >
              <div className="mb-5 flex items-center justify-between">
                <span className="text-[0.7rem] font-semibold uppercase tracking-[0.32em] text-[#0038FD] dark:text-[#8AB4FF]">
                  {String(index + 1).padStart(2, "0")}
                </span>
                {index < astrologyContent.process.length - 1 ? (
                  <span className="hidden h-px flex-1 bg-[#0038FD]/15 dark:bg-[#0038FD]/20 lg:block" />
                ) : null}
              </div>

              <h3 className="text-2xl font-medium tracking-[-0.05em] text-[#0A0D14] dark:text-[#F8FAFF]">
                {step.title}
              </h3>
              <p className="mt-3 text-base leading-7 text-[#667085] dark:text-[#98A2B3]">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
