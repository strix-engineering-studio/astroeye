import type { Metadata } from "next"
import { buildMetadata } from "@/lib/seo"
import { getAuthorityPage } from "@/lib/seo-content"
import { ContentPage } from "@/components/seo/content-page"

const page = getAuthorityPage("system-design-framework")!

export const metadata: Metadata = buildMetadata({
  title: "System Design Framework | Strix Engineering Studio",
  description: page.description,
  path: "/system-design-framework",
  keywords: ["system design", "software systems", "framework"],
})

export default function SystemDesignFrameworkPage() {
  return <ContentPage eyebrow="System Design Framework" path="/system-design-framework" {...page} />
}
