import type { Metadata } from "next"
import { ArrowUpRight } from "lucide-react"
import { PageShell } from "@/components/shared/page-shell"
import { experienceTimeline, testimonials } from "@/lib/site"
import { buildMetadata } from "@/lib/seo"

export const metadata: Metadata = buildMetadata({
  title: "About | Strix Engineering Studio",
  description: "A product engineering studio built around systems thinking, architecture, and long-term support.",
  path: "/about",
  keywords: ["about Strix", "engineering studio", "systems thinking"],
})

export default function AboutPage() {
  return (
    <PageShell
      eyebrow="About"
      title="A product engineering studio for modern systems"
      description="Strix exists to make complicated product and workflow systems feel calmer, more maintainable, and easier to evolve over time."
    >
      <div className="grid gap-6 lg:grid-cols-[0.88fr_1.12fr] lg:items-start">
        <div className="space-y-5 rounded-xl border border-white/10 bg-white/4 p-5">
          <p className="text-[11px] uppercase tracking-[0.38em] text-white/50">Story</p>
          <h2 className="text-3xl font-semibold tracking-tight text-foreground">Built for teams that need product, backend, and operations to move together.</h2>
          <p className="text-sm leading-7 text-muted-foreground">The practice focuses on discovery, architecture, and delivery habits that hold up after launch.</p>
          <a href="/contact" className="inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-3 text-sm font-medium text-background transition hover:opacity-90">
            Start a discovery session
            <ArrowUpRight className="size-4" />
          </a>
        </div>

        <div className="space-y-4">
          {experienceTimeline.map((item) => (
            <div key={item.year} className="grid gap-4 rounded-xl border border-white/8 bg-white/4 p-5 sm:grid-cols-[120px_1fr]">
              <div>
                <p className="text-[11px] uppercase tracking-[0.38em] text-white/45">{item.year}</p>
                <p className="mt-2 text-lg font-semibold text-foreground">{item.kind}</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-foreground">{item.title}</h3>
                <p className="mt-2 text-sm leading-7 text-muted-foreground">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {testimonials.map((testimonial) => (
          <div key={testimonial.name} className="rounded-xl border border-white/10 bg-white/4 p-5">
            <p className="text-sm leading-7 text-foreground/90">“{testimonial.quote}”</p>
            <p className="mt-5 text-sm font-medium text-foreground">{testimonial.name}</p>
            <p className="text-sm text-muted-foreground">
              {testimonial.role} · {testimonial.company}
            </p>
          </div>
        ))}
      </div>
    </PageShell>
  )
}
