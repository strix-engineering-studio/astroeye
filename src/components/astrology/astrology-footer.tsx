import Link from "next/link";

import { astrologyConfig, astrologyContent } from "@/content/astrology/profile";

export function AstrologyFooter() {
  return (
    <footer className="border-t border-[#E2E6EF] bg-white/80 dark:border-[#252A35] dark:bg-[#10131A]/80">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-[1.2fr_0.8fr_0.8fr_1.2fr]">
          <div>
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.38em] text-[#0038FD] dark:text-[#8AB4FF]">
              {astrologyContent.brand}
            </p>
            <p className="mt-3 max-w-xs text-base leading-7 text-[#667085] dark:text-[#98A2B3]">
              {astrologyContent.brandDescription}
            </p>
          </div>

          <div>
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.26em] text-[#0A0D14] dark:text-[#F8FAFF]">
              Navigation
            </p>
            <ul className="mt-4 space-y-2 text-sm text-[#667085] dark:text-[#98A2B3]">
              <li><Link href="#about" className="transition hover:text-[#0038FD] dark:hover:text-[#B9D1FF]">About</Link></li>
              <li><Link href="#services" className="transition hover:text-[#0038FD] dark:hover:text-[#B9D1FF]">Services</Link></li>
              <li><Link href="#process" className="transition hover:text-[#0038FD] dark:hover:text-[#B9D1FF]">Process</Link></li>
              <li><Link href="#faq" className="transition hover:text-[#0038FD] dark:hover:text-[#B9D1FF]">FAQ</Link></li>
            </ul>
          </div>

          <div>
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.26em] text-[#0A0D14] dark:text-[#F8FAFF]">
              Community
            </p>
            <ul className="mt-4 space-y-2 text-sm text-[#667085] dark:text-[#98A2B3]">
              <li>
                <a
                  href={astrologyConfig.whatsappCommunityUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition hover:text-[#0038FD] dark:hover:text-[#B9D1FF]"
                >
                  Join WhatsApp
                </a>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.26em] text-[#0A0D14] dark:text-[#F8FAFF]">
              Legal
            </p>
            <ul className="mt-4 space-y-2 text-sm text-[#667085] dark:text-[#98A2B3]">
              <li>Privacy Policy</li>
              <li>Terms</li>
              <li>Disclaimer</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-[#E2E6EF] pt-6 dark:border-[#252A35]">
          <p className="text-sm leading-7 text-[#667085] dark:text-[#98A2B3]">
            {astrologyContent.disclaimer}
          </p>
        </div>
      </div>
    </footer>
  );
}
