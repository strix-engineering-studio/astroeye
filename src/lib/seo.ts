import type { Metadata } from "next"

export const siteConfig = {
    name: "Strix Engineering Studio",
    shortName: "Strix",
    domain: "strix.website",
    url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://strix.website",
    description:
        "Strix Engineering Studio helps startups and technology businesses design, build, deploy, and evolve production-grade software systems.",
    founderName: "Strix Engineering Studio",
    foundedAt: "2026-01-01",
    logo: "/strix.svg",
    sameAs: [
        "https://github.com/strix-engineering-studio",
        "https://www.linkedin.com/company/strix-engineering-studio",
        "https://x.com/strix_engineering",
    ],
    defaultKeywords: [
        "product engineering",
        "software architecture",
        "system design",
        "platform engineering",
        "technical audit",
        "engineering studio",
    ],
}

type MetadataInput = {
    title: string
    description: string
    path?: string
    keywords?: string[]
    noIndex?: boolean
    openGraphType?: "website" | "article"
}

export function buildMetadata({
    title,
    description,
    path = "/",
    keywords = [],
    noIndex = false,
    openGraphType = "website",
}: MetadataInput): Metadata {
    const canonical = new URL(path, siteConfig.url).toString()

    return {
        title,
        description,
        keywords: [...siteConfig.defaultKeywords, ...keywords],
        metadataBase: new URL(siteConfig.url),
        alternates: { canonical },
        robots: {
            index: !noIndex,
            follow: !noIndex,
            googleBot: {
                index: !noIndex,
                follow: !noIndex,
                "max-image-preview": "large",
                "max-snippet": -1,
                "max-video-preview": -1,
            },
        },
        openGraph: {
            type: openGraphType,
            title,
            description,
            url: canonical,
            siteName: siteConfig.name,
            images: [
                {
                    url: "/og-image.jpg",
                    width: 1200,
                    height: 630,
                    alt: siteConfig.name,
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
            images: ["/og-image.jpg"],
        },
    }
}

export function organizationSchema() {
    return {
        "@context": "https://schema.org",
        "@type": "Organization",
        name: siteConfig.name,
        url: siteConfig.url,
        logo: new URL(siteConfig.logo, siteConfig.url).toString(),
        description: siteConfig.description,
        foundingDate: siteConfig.foundedAt,
        sameAs: siteConfig.sameAs,
    }
}

export function websiteSchema() {
    return {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: siteConfig.name,
        url: siteConfig.url,
        description: siteConfig.description,
        publisher: {
            "@type": "Organization",
            name: siteConfig.name,
            url: siteConfig.url,
        },
    }
}

export function breadcrumbSchema(items: { name: string; item: string }[]) {
    return {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: items.map((item, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: item.name,
            item: item.item,
        })),
    }
}

export function faqSchema(questions: { question: string; answer: string }[]) {
    return {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: questions.map((qa) => ({
            "@type": "Question",
            name: qa.question,
            acceptedAnswer: {
                "@type": "Answer",
                text: qa.answer,
            },
        })),
    }
}

export function articleSchema(input: {
    title: string
    description: string
    url: string
    publishedAt?: string
    updatedAt?: string
    authorName?: string
    image?: string
}) {
    return {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: input.title,
        description: input.description,
        url: input.url,
        mainEntityOfPage: input.url,
        author: {
            "@type": "Person",
            name: input.authorName ?? siteConfig.name,
        },
        publisher: {
            "@type": "Organization",
            name: siteConfig.name,
            logo: {
                "@type": "ImageObject",
                url: new URL(siteConfig.logo, siteConfig.url).toString(),
            },
        },
        image: input.image ? [input.image] : undefined,
        datePublished: input.publishedAt,
        dateModified: input.updatedAt ?? input.publishedAt,
    }
}

export function softwareApplicationSchema(input: {
    name: string
    description: string
    url: string
    category?: string
}) {
    return {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        name: input.name,
        description: input.description,
        applicationCategory: input.category ?? "BusinessApplication",
        operatingSystem: "Web",
        url: input.url,
        offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "USD",
        },
    }
}
