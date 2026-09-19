import type { Metadata } from "next"
import { BlogIndex } from "@/components/blog/blog-index"
import { PageShell } from "@/components/shared/page-shell"
import { getBlogPosts } from "@/lib/content"
import { buildMetadata } from "@/lib/seo"

export const metadata: Metadata = buildMetadata({
  title: "Insights | Strix Engineering Studio",
  description: "Architecture guides, system design notes, and product engineering thinking from Strix.",
  path: "/insights",
  keywords: ["architecture guides", "system design", "product engineering"],
})

export default async function InsightsPage() {
  const posts = await getBlogPosts()

  return (
    <PageShell
      eyebrow="Insights"
      title="Architecture guides, system design notes, and product engineering thinking"
      description="Practical writing that explains the decisions behind durable systems, not generic marketing content."
    >
      <BlogIndex posts={posts} />
    </PageShell>
  )
}
