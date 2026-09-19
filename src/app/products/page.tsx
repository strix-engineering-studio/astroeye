import type { Metadata } from "next"
import Link from "next/link"
import { PageShell } from "@/components/shared/page-shell"
import { featuredProjects } from "@/lib/site"
import { buildMetadata } from "@/lib/seo"

export const metadata: Metadata = buildMetadata({
  title: "Products | Strix Engineering Studio",
  description: "Classes360, Imrabo, RacerAPI, and future product systems from Strix Engineering Studio.",
  path: "/products",
  keywords: ["product engineering", "product portfolio", "software products"],
})

export default function ProductsPage() {
  return (
    <PageShell
      eyebrow="Products"
      title="Products are first-class systems"
      description="Classes360, Imrabo, RacerAPI, and future products that reflect how Strix builds and operates software."
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {featuredProjects.map((project) => (
          <article key={project.slug} className="rounded-xl border border-white/10 bg-white/4 p-5">
            <p className="text-[11px] uppercase tracking-[0.38em] text-white/50">{project.category}</p>
            <h2 className="mt-3 text-xl font-semibold text-foreground">{project.title}</h2>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">{project.summary}</p>
            <div className="mt-4">
              <Link href={`/products/${project.slug}`} className="text-sm font-medium text-foreground underline underline-offset-4">
                View product page
              </Link>
            </div>
          </article>
        ))}
      </div>
    </PageShell>
  )
}
