import type { Metadata } from "next"
import { buildMetadata } from "@/lib/seo"
import { getAuthorityPage } from "@/lib/seo-content"
import { ContentPage } from "@/components/seo/content-page"

const page = getAuthorityPage("architecture-philosophy")!

export const metadata: Metadata = buildMetadata({
  title: "Architecture Philosophy | Strix Engineering Studio",
  description: page.description,
  path: "/architecture-philosophy",
  keywords: ["architecture philosophy", "systems thinking", "technical architecture"],
})

export default function ArchitecturePhilosophyPage() {
  return <ContentPage eyebrow="Architecture Philosophy" path="/architecture-philosophy" {...page} />
}
