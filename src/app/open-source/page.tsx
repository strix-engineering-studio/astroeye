import type { Metadata } from "next"
import Link from "next/link"
import { PageShell } from "@/components/shared/page-shell"
import { buildMetadata } from "@/lib/seo"

const openSourceItems = [
  {
    slug: "system-patterns",
    title: "Strix system patterns",
    description: "Reusable architecture thinking for product systems and internal tools.",
    category: "Architecture",
  },
  {
    slug: "admin-workflows",
    title: "Auth and admin workflows",
    description: "Practical patterns for protected dashboards and operational interfaces.",
    category: "Platform",
  },
  {
    slug: "ai-guardrails",
    title: "AI workflow guardrails",
    description: "Structure for queued, observable, and approval-based AI tasks.",
    category: "AI",
  },
]

export const metadata: Metadata = buildMetadata({
  title: "Open Source | Strix Engineering Studio",
  description: "Open source tools, system patterns, and reusable engineering ideas from Strix.",
  path: "/open-source",
  keywords: ["open source", "engineering patterns", "system architecture"],
})

export default function OpenSourcePage() {
  return (
    <PageShell
      eyebrow="Open Source"
      title="Open source tools and system patterns"
      description="Engineering ideas and reusable building blocks that reflect how Strix approaches software systems."
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {openSourceItems.map((item) => (
          <article key={item.title} className="rounded-xl border border-white/10 bg-white/4 p-5">
            <p className="text-[11px] uppercase tracking-[0.38em] text-white/50">{item.category}</p>
            <h2 className="mt-3 text-xl font-semibold text-foreground">{item.title}</h2>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">{item.description}</p>
            <div className="mt-4">
              <Link href={`/open-source/${item.slug}`} className="text-sm font-medium text-foreground underline underline-offset-4">
                View details
              </Link>
            </div>
          </article>
        ))}
      </div>
    </PageShell>
  )
}
