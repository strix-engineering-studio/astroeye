import { AstrologyFooter } from "./astrology-footer";
import { AstrologyFaq } from "./astrology-faq";
import { AstrologyHeader } from "./astrology-header";
import { AstrologyHero } from "./astrology-hero";
import { AstrologerProfile } from "./astrologer-profile";
import { CommunityCta } from "./community-cta";
import { ConsultationInfo } from "./consultation-info";
import { ConsultationProcess } from "./consultation-process";
import { ConsultationServices } from "./consultation-services";
import { FinalCta } from "./final-cta";
import { FloatingWhatsAppButton } from "./floating-whatsapp-button";
import { WhyAstroeye } from "./why-astroeye";

export function AstrologyPage() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#F7F9FC] text-[#0A0D14] transition-colors duration-300 dark:bg-[#080A0F] dark:text-[#F8FAFF]">
      <div className="pointer-events-none absolute inset-0 opacity-70">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(0,56,253,0.12),_transparent_35%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(15,23,42,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(15,23,42,0.03)_1px,transparent_1px)] bg-[size:56px_56px] dark:bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] dark:bg-[size:56px_56px]" />
      </div>

      <div className="relative z-10">
        <AstrologyHeader />

        <main>
          <AstrologyHero />
          <AstrologerProfile />
          <ConsultationServices />
          <ConsultationProcess />
          <WhyAstroeye />
          <ConsultationInfo />
          <CommunityCta />
          <AstrologyFaq />
          <FinalCta />
        </main>

        <FloatingWhatsAppButton />
        <AstrologyFooter />
      </div>
    </div>
  );
}
