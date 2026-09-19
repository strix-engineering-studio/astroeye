import type { Metadata } from "next"
import Link from "next/link"
import { PageShell } from "@/components/shared/page-shell"
import { featuredProjects } from "@/lib/site"
import { buildMetadata } from "@/lib/seo"

export const metadata: Metadata = buildMetadata({
  title: "Systems | Strix Engineering Studio",
  description: "The systems Strix designs and ships for startups and technology businesses.",
  path: "/systems",
  keywords: ["systems", "system architecture", "operational software"],
})

export default function SystemsPage() {
  return (
    <PageShell
      eyebrow="Systems"
      title="Systems before software"
      description="A systems view of the products, platforms, and operating surfaces Strix builds and supports."
    >
      <div className="grid gap-4 lg:grid-cols-2">
        {featuredProjects.map((project) => (
          <article key={project.slug} className="rounded-xl border border-white/10 bg-white/4 p-5">
            <p className="text-[11px] uppercase tracking-[0.38em] text-white/50">{project.category}</p>
            <h2 className="mt-3 text-2xl font-semibold text-foreground">{project.title}</h2>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">{project.spotlight}</p>
            <div className="mt-4">
              <Link href={`/case-studies/${project.slug}`} className="text-sm font-medium text-foreground underline underline-offset-4">
                Related case study
              </Link>
            </div>
          </article>
        ))}
      </div>
    </PageShell>
  )
}
