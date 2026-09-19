import type { Metadata } from "next"
import { PageShell } from "@/components/shared/page-shell"
import { buildMetadata } from "@/lib/seo"

const partners = [
  { name: "Agency partners", description: "Teams that need architecture depth or implementation support." },
  { name: "Consultants", description: "Independent advisors who refer delivery work that needs a systems partner." },
  { name: "Referral partners", description: "Operators and founders who introduce teams that need long-term help." },
  { name: "Technology partners", description: "Tool vendors and platforms that integrate into product ecosystems." },
]

export const metadata: Metadata = buildMetadata({
  title: "Partners | Strix Engineering Studio",
  description: "The partner network around Strix Engineering Studio.",
  path: "/partners",
  keywords: ["partners", "referral partners", "technology partners"],
})

export default function PartnersPage() {
  return (
    <PageShell
      eyebrow="Partners"
      title="Partner network"
      description="A practical network of agencies, consultants, and technology partners that extend delivery capacity and reach."
    >
      <div className="grid gap-4 md:grid-cols-2">
        {partners.map((partner) => (
          <article key={partner.name} className="rounded-xl border border-white/10 bg-white/4 p-5">
            <h2 className="text-xl font-semibold text-foreground">{partner.name}</h2>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">{partner.description}</p>
          </article>
        ))}
      </div>
    </PageShell>
  )
}
