import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { PageShell } from "@/components/shared/page-shell"
import { featuredProjects } from "@/lib/site"
import { buildMetadata, softwareApplicationSchema } from "@/lib/seo"
import { JsonLd } from "@/components/seo/json-ld"

export function generateStaticParams() {
  return featuredProjects.map((project) => ({ slug: project.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const project = featuredProjects.find((item) => item.slug === slug)

  if (!project) return {}

  return buildMetadata({
    title: `${project.title} | Strix Engineering Studio`,
    description: project.summary,
    path: `/products/${slug}`,
    keywords: [project.category, "product engineering", "software product"],
  })
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const project = featuredProjects.find((item) => item.slug === slug)

  if (!project) notFound()

  return (
    <>
      <JsonLd
        data={[
          softwareApplicationSchema({
            name: project.title,
            description: project.summary,
            url: `https://strix.website/products/${project.slug}`,
            category: project.category,
          }),
        ]}
      />
      <PageShell eyebrow="Product" title={project.title} description={project.summary}>
        <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
          <div className="space-y-4 rounded-xl border border-white/10 bg-white/4 p-5">
            <p className="text-sm leading-7 text-muted-foreground">{project.problem}</p>
            <p className="text-sm leading-7 text-muted-foreground">{project.solution}</p>
            <p className="text-sm leading-7 text-muted-foreground">{project.result}</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-black/20 p-5">
            <p className="text-[11px] uppercase tracking-[0.35em] text-white/45">Architecture</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {project.architecture.map((item) => (
                <span key={item} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] uppercase tracking-[0.26em] text-white/68">
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </PageShell>
    </>
  )
}
