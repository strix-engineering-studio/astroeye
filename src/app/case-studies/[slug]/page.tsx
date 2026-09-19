import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { PageShell } from "@/components/shared/page-shell"
import { CaseStudyView } from "@/components/case-studies/case-study-view"
import { featuredProjects } from "@/lib/site"
import { buildMetadata, articleSchema } from "@/lib/seo"
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
    path: `/case-studies/${slug}`,
    keywords: [project.category, "case study", "architecture"],
    openGraphType: "article",
  })
}

export default async function CaseStudyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const project = featuredProjects.find((item) => item.slug === slug)

  if (!project) notFound()

  return (
    <>
      <JsonLd
        data={[
          articleSchema({
            title: project.title,
            description: project.summary,
            url: `https://strix.website/case-studies/${project.slug}`,
            authorName: "Strix Engineering Studio",
          }),
        ]}
      />
      <PageShell eyebrow="Case study" title={project.title} description={project.summary}>
        <CaseStudyView project={project} />
      </PageShell>
    </>
  )
}
