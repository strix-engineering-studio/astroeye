import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { PageShell } from "@/components/shared/page-shell"
import { buildMetadata, articleSchema } from "@/lib/seo"
import { JsonLd } from "@/components/seo/json-ld"
import { getBlogPostBySlug, getBlogPosts } from "@/lib/content"

export async function generateStaticParams() {
  const posts = await getBlogPosts()
  return posts.map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  try {
    const { frontmatter } = await getBlogPostBySlug(slug)
    return buildMetadata({
      title: `${frontmatter.title} | Strix Engineering Studio`,
      description: frontmatter.excerpt,
      path: `/insights/${slug}`,
      keywords: [frontmatter.tag, "software architecture", "product engineering"],
      openGraphType: "article",
    })
  } catch {
    return buildMetadata({
      title: "Insight | Strix Engineering Studio",
      description: "Architecture and product engineering insights.",
      path: `/insights/${slug}`,
    })
  }
}

export default async function InsightsPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  const post = await getBlogPostBySlug(slug).catch(() => null)
  if (!post) notFound()

  const { content, frontmatter } = post
  const publishedDate = new Date(frontmatter.publishedAt).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  })

  return (
    <>
      <JsonLd
        data={[
          articleSchema({
            title: frontmatter.title,
            description: frontmatter.excerpt,
            url: `https://strix.website/insights/${slug}`,
            publishedAt: frontmatter.publishedAt,
            authorName: "Strix Engineering Studio",
          }),
        ]}
      />
      <PageShell eyebrow={frontmatter.tag} title={frontmatter.title} description={frontmatter.excerpt}>
        <article className="prose max-w-none prose-invert prose-headings:tracking-tight prose-a:text-[color:var(--foreground)] prose-strong:text-foreground prose-code:text-foreground prose-pre:border prose-pre:border-white/10 prose-pre:bg-black/30">
          <div className="mb-8 flex items-center gap-4 text-sm text-muted-foreground">
            <span>{publishedDate}</span>
            <span>{frontmatter.tag}</span>
          </div>
          {content}
        </article>
      </PageShell>
    </>
  )
}
