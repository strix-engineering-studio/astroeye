import { astrologyContent } from "@/content/astrology/profile";

export function AstrologerProfile() {
  return (
    <section id="about" className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
      <div className="mb-8 text-center lg:text-left">
        <p className="text-[0.72rem] font-semibold uppercase tracking-[0.38em] text-[#0038FD] dark:text-[#8AB4FF]">
          About the Astrologer
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="relative overflow-hidden rounded-[26px] border border-[#E2E6EF] bg-white/90 p-6 shadow-[0_25px_60px_rgba(15,23,42,0.05)] dark:border-[#252A35] dark:bg-[#10131A]/90 dark:shadow-[0_25px_60px_rgba(0,0,0,0.25)]">
          <div className="relative mx-auto flex h-[320px] max-w-[320px] items-center justify-center overflow-hidden rounded-full border border-[#E2E6EF] bg-[radial-gradient(circle_at_center,_rgba(0,56,253,0.18),_rgba(255,255,255,0)_55%)] dark:border-[#252A35] dark:bg-[radial-gradient(circle_at_center,_rgba(0,56,253,0.24),_rgba(16,19,26,0.0)_58%)]">
            <div className="absolute inset-8 rounded-full border border-[#0038FD]/15 dark:border-[#0038FD]/20" />
            <div className="absolute inset-[5rem] rounded-full border border-[#0038FD]/10 dark:border-[#0038FD]/15" />
            <div className="absolute h-40 w-40 rounded-full bg-[#0038FD] text-6xl font-medium text-white shadow-[0_0_32px_rgba(0,56,253,0.28)]">
              <div className="flex h-full w-full items-center justify-center">A</div>
            </div>
          </div>
        </div>

        <div className="rounded-[26px] border border-[#E2E6EF] bg-white/90 p-6 shadow-[0_25px_60px_rgba(15,23,42,0.05)] dark:border-[#252A35] dark:bg-[#10131A]/90 dark:shadow-[0_25px_60px_rgba(0,0,0,0.25)] sm:p-8">
          <h2 className="text-3xl font-medium tracking-[-0.05em] text-[#0A0D14] dark:text-[#F8FAFF] sm:text-4xl">
            Meet {astrologyContent.astrologer.name}
          </h2>

          <p className="mt-5 text-base leading-8 text-[#667085] dark:text-[#98A2B3]">
            {astrologyContent.astrologer.shortBio}
          </p>

          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            <div className="rounded-[18px] border border-[#E2E6EF] bg-[#F7F9FC] p-4 dark:border-[#252A35] dark:bg-[#0B0F16]">
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.26em] text-[#0038FD] dark:text-[#8AB4FF]">
                Experience
              </p>
              <p className="mt-2 text-sm leading-7 text-[#0A0D14] dark:text-[#F8FAFF]">
                {astrologyContent.astrologer.experience}
              </p>
            </div>

            <div className="rounded-[18px] border border-[#E2E6EF] bg-[#F7F9FC] p-4 dark:border-[#252A35] dark:bg-[#0B0F16]">
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.26em] text-[#0038FD] dark:text-[#8AB4FF]">
                Specialisation
              </p>
              <p className="mt-2 text-sm leading-7 text-[#0A0D14] dark:text-[#F8FAFF]">
                {astrologyContent.astrologer.specialisation}
              </p>
            </div>

            <div className="rounded-[18px] border border-[#E2E6EF] bg-[#F7F9FC] p-4 dark:border-[#252A35] dark:bg-[#0B0F16] sm:col-span-2">
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.26em] text-[#0038FD] dark:text-[#8AB4FF]">
                Languages
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {astrologyContent.astrologer.languages.map((language) => (
                  <span
                    key={language}
                    className="rounded-full border border-[#E2E6EF] bg-white px-3 py-1.5 text-xs font-medium text-[#0A0D14] dark:border-[#252A35] dark:bg-[#10131A] dark:text-[#F8FAFF]"
                  >
                    {language}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
