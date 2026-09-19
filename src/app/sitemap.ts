import type { MetadataRoute } from "next"
import { featuredProjects } from "@/lib/site"
import { getBlogPosts } from "@/lib/content"

const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://strix.website"

// Update this when static pages are actually modified
const STATIC_LAST_MODIFIED = new Date("2026-05-31")

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const routes = [
        "",
        "/capabilities",
        "/systems",
        "/products",
        "/case-studies",
        "/open-source",
        "/partners",
        "/process",
        "/insights",
        "/contact",
        "/about",
        "/privacy",
        "/terms",
    ]

    const pages: MetadataRoute.Sitemap = routes.map((route) => ({
        url: `${siteUrl}${route}`,
        lastModified: STATIC_LAST_MODIFIED,
        changeFrequency: "monthly",
        priority: route === "" ? 1.0 : 0.8,
    }))

    const products: MetadataRoute.Sitemap = featuredProjects.map((project) => ({
        url: `${siteUrl}/products/${project.slug}`,
        lastModified: STATIC_LAST_MODIFIED,
        changeFrequency: "monthly",
        priority: 0.9,
    }))

    const studies: MetadataRoute.Sitemap = featuredProjects.map((project) => ({
        url: `${siteUrl}/case-studies/${project.slug}`,
        lastModified: STATIC_LAST_MODIFIED,
        changeFrequency: "monthly",
        priority: 0.8,
    }))

    const openSource: MetadataRoute.Sitemap = [
        "system-patterns",
        "admin-workflows",
        "ai-guardrails",
    ].map((slug) => ({
        url: `${siteUrl}/open-source/${slug}`,
        lastModified: STATIC_LAST_MODIFIED,
        changeFrequency: "monthly",
        priority: 0.7,
    }))

    const posts = await getBlogPosts()

    const insights: MetadataRoute.Sitemap = posts.map((post) => ({
        url: `${siteUrl}/insights/${post.slug}`,
        lastModified: new Date(post.publishedAt),
        changeFrequency: "yearly",
        priority: 0.7,
    }))

    return [
        ...pages,
        ...products,
        ...studies,
        ...openSource,
        ...insights,
    ]
}