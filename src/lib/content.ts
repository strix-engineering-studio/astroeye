import fs from "node:fs/promises"
import path from "node:path"
import matter from "gray-matter"
import { cache } from "react"
import { compileMDX } from "next-mdx-remote/rsc"
import rehypePrettyCode from "rehype-pretty-code"

export type BlogFrontmatter = {
    title: string
    excerpt: string
    slug: string
    publishedAt: string
    tag: string
    featured?: boolean
}

export type BlogPostMeta = BlogFrontmatter & {
    readingTime: string
}

const blogDirectory = path.join(process.cwd(), "src", "content", "blog")

export const getBlogPosts = cache(async (): Promise<BlogPostMeta[]> => {
    const files = await fs.readdir(blogDirectory)
    const posts = await Promise.all(
        files
            .filter((file) => file.endsWith(".mdx"))
            .map(async (file) => {
                const slug = file.replace(/\.mdx$/, "")
                const source = await fs.readFile(path.join(blogDirectory, file), "utf8")
                const parsed = matter(source)

                return {
                    ...(parsed.data as BlogFrontmatter),
                    slug: parsed.data.slug ?? slug,
                    readingTime: `${Math.max(2, Math.round(parsed.content.split(/\s+/).length / 220))} min read`,
                }
            })
    )

    return posts.sort((left, right) => +new Date(right.publishedAt) - +new Date(left.publishedAt))
})

export const getBlogPostBySlug = cache(async (slug: string) => {
    const source = await fs.readFile(path.join(blogDirectory, `${slug}.mdx`), "utf8")

    return compileMDX<BlogFrontmatter>({
        source,
        options: {
            parseFrontmatter: true,
            mdxOptions: {
                rehypePlugins: [[rehypePrettyCode, { theme: "github-dark-dimmed", keepBackground: false }]],
            },
        },
    })
})
