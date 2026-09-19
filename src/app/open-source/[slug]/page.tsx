import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { PageShell } from "@/components/shared/page-shell"
import { buildMetadata, softwareApplicationSchema } from "@/lib/seo"
import { JsonLd } from "@/components/seo/json-ld"

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

export function generateStaticParams() {
  return openSourceItems.map((item) => ({ slug: item.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const item = openSourceItems.find((entry) => entry.slug === slug)
  if (!item) return {}

  return buildMetadata({
    title: `${item.title} | Strix Engineering Studio`,
    description: item.description,
    path: `/open-source/${slug}`,
    keywords: [item.category, "open source", "system pattern"],
  })
}

export default async function OpenSourceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const item = openSourceItems.find((entry) => entry.slug === slug)
  if (!item) notFound()

  return (
    <>
      <JsonLd
        data={[
          softwareApplicationSchema({
            name: item.title,
            description: item.description,
            url: `https://strix.website/open-source/${item.slug}`,
            category: item.category,
          }),
        ]}
      />
      <PageShell eyebrow="Open Source" title={item.title} description={item.description}>
        <div className="rounded-xl border border-white/10 bg-white/4 p-5">
          <p className="text-sm leading-7 text-muted-foreground">
            This page documents a reusable pattern or tool that reflects how Strix engineers production software systems.
          </p>
        </div>
      </PageShell>
    </>
  )
}
