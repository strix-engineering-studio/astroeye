import { siteConfig } from "@/lib/seo"

export async function GET() {
    const body = `# ${siteConfig.name}

## Company
Architecture-first product engineering studio for startups and technology businesses.

## Core Philosophy
Build the right system before building the software.
Systems are the product. Applications are outputs.

## Services
- Product engineering
- System architecture
- Technical audits
- Platform modernization
- Engineering partnerships

## Products
- Classes360 - Institute management system
- Imrabo - AI ecosystem
- RacerAPI - Scalable Python backend platform

## Case Studies
- Selected systems and production launches for product teams

## Open Source
- Engineering tools and reusable system patterns

## Insights
- Software architecture
- Backend systems
- Product engineering
- Platform design

## FAQs
- What is Strix? An engineering studio focused on production-grade systems.
- Who is it for? Startups and technology businesses that need durable software.
- What problem does it solve? It reduces architecture risk and delivery drag.
- How does it work? Discovery, system design, implementation, and long-term support.
- Why choose Strix? The practice is oriented around systems thinking, not staffing hours.
`

    return new Response(body, {
        headers: {
            "content-type": "text/plain; charset=utf-8",
            "cache-control": "public, max-age=3600",
        },
    })
}
