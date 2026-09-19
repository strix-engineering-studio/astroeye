import type { Metadata } from "next"
import { buildMetadata } from "@/lib/seo"
import { getAuthorityPage } from "@/lib/seo-content"
import { ContentPage } from "@/components/seo/content-page"

const page = getAuthorityPage("engineering-principles")!

export const metadata: Metadata = buildMetadata({
  title: "Engineering Principles | Strix Engineering Studio",
  description: page.description,
  path: "/engineering-principles",
  keywords: ["engineering principles", "system-first engineering", "product engineering"],
})

export default function EngineeringPrinciplesPage() {
  return <ContentPage eyebrow="Engineering Principles" path="/engineering-principles" {...page} />
}
