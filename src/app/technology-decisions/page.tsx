import type { Metadata } from "next"
import { buildMetadata } from "@/lib/seo"
import { getAuthorityPage } from "@/lib/seo-content"
import { ContentPage } from "@/components/seo/content-page"

const page = getAuthorityPage("technology-decisions")!

export const metadata: Metadata = buildMetadata({
  title: "Technology Decisions | Strix Engineering Studio",
  description: page.description,
  path: "/technology-decisions",
  keywords: ["technology decisions", "tradeoffs", "production readiness"],
})

export default function TechnologyDecisionsPage() {
  return <ContentPage eyebrow="Technology Decisions" path="/technology-decisions" {...page} />
}
