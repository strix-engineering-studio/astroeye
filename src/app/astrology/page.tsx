import type { Metadata } from "next";

import { AstrologyPage } from "@/components/astrology/astrology-page";
import { JsonLd } from "@/components/seo/json-ld";
import { astrologyContent } from "@/content/astrology/profile";
import { buildMetadata, faqSchema } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Astrology Consultation | Astroeye",
  description:
    "Personalised astrology consultations for career, relationships, marriage, business, birth charts and important life decisions.",
  path: "/astrology",
  keywords: [
    "astrology consultation",
    "career guidance",
    "relationship guidance",
    "marriage guidance",
    "birth chart analysis",
    "WhatsApp community",
  ],
});

export default function AstrologyRoutePage() {
  return (
    <>
      <JsonLd data={[faqSchema(astrologyContent.faqs.map(({ question, answer }) => ({ question, answer })))]} />
      <AstrologyPage />
    </>
  );
}
