import type { Metadata } from "next"
import Link from "next/link"
import { PageShell } from "@/components/shared/page-shell"
import { featuredProjects } from "@/lib/site"
import { buildMetadata } from "@/lib/seo"

export const metadata: Metadata = buildMetadata({
  title: "Case Studies | Strix Engineering Studio",
  description: "Selected product systems and architecture-led implementations from Strix Engineering Studio.",
  path: "/case-studies",
  keywords: ["case studies", "architecture case studies", "product engineering examples"],
})

export default function CaseStudiesPage() {
  return (
    <PageShell
      eyebrow="Case Studies"
      title="Selected product systems shaped around real operating needs"
      description="Each engagement focused on one practical question: how to make the product clearer, faster, or more dependable."
    >
      <div className="grid gap-4">
        {featuredProjects.map((project) => (
          <article key={project.slug} className="rounded-[18px] border border-black/10 bg-background/70 p-5 shadow-[0_8px_30px_rgba(11,11,10,0.03)] dark:border-white/10">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="max-w-2xl">
                <p className="text-[11px] uppercase tracking-[0.38em] text-foreground/55">{project.category}</p>
                <h2 className="mt-3 text-2xl font-semibold text-foreground">{project.title}</h2>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">{project.summary}</p>
              </div>
              <div className="rounded-[10px] border border-black/10 bg-background/80 px-4 py-3 text-sm text-foreground/75 dark:border-white/10">
                {project.timeline} · {project.spotlight}
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {project.architecture.slice(0, 4).map((item) => (
                <span key={item} className="rounded-full border border-black/10 bg-background/80 px-3 py-1 text-[11px] uppercase tracking-[0.26em] text-foreground/70 dark:border-white/10">
                  {item}
                </span>
              ))}
            </div>
            <div className="mt-4">
              <Link href={`/case-studies/${project.slug}`} className="text-sm font-medium text-foreground underline underline-offset-4">
                View case study
              </Link>
            </div>
          </article>
        ))}
      </div>
    </PageShell>
  )
}
