import type { Metadata } from "next";
import { ArrowUpRight, Mail, ShieldCheck } from "lucide-react";
import { ContactForm } from "@/components/contact/contact-form";
import { PageShell } from "@/components/shared/page-shell";
import { contactCategories } from "@/lib/site";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Contact | Strix Engineering Studio",
  description: "Start a discovery session with Strix Engineering Studio.",
  path: "/contact",
  keywords: ["contact", "discovery session", "engineering studio"],
});

export default function ContactPage() {
  return (
    <PageShell
      eyebrow="Contact"
      title="Start a discovery session with Strix"
      description="Get help with your workflows, explore a redesign, or talk through a product system that needs calmer execution."
    >
      <div className="grid gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
        <div className="space-y-5 rounded-xl border border-white/10 bg-white/4 p-5 lg:sticky lg:top-28">
          <p className="text-[11px] uppercase tracking-[0.38em] text-white/50">
            Contact
          </p>
          <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            A short intake, not a long form maze.
          </h2>
          <p className="text-sm leading-7 text-muted-foreground">
            The goal is to get enough context to shape the right conversation,
            not to make you fill out a spreadsheet.
          </p>
          <div className="flex flex-wrap gap-2">
            {contactCategories.map((item) => (
              <span
                key={item}
                className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] uppercase tracking-[0.26em] text-white/68"
              >
                {item}
              </span>
            ))}
          </div>
          <a
            href="mailto:hello@strix.com"
            className="inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-3 text-sm font-medium text-background transition hover:opacity-90"
          >
            hello@strix.com
            <Mail className="size-4" />
          </a>
          <div className="grid gap-3 sm:grid-cols-2">
            <InfoCard
              title="Response"
              description="Usually within 48 hours."
              icon={<ArrowUpRight className="size-4" />}
            />
            <InfoCard
              title="Fit"
              description="Best for systems, workflows, and product delivery."
              icon={<ShieldCheck className="size-4" />}
            />
          </div>
        </div>

        <div className="rounded-xl border border-white/10 bg-white/4 p-4 sm:p-5 lg:p-6">
          <div className="mb-5 grid gap-3 sm:grid-cols-3">
            {[
              ["< 48h", "Typical response"],
              ["1 pass", "Discovery review"],
              ["3 tracks", "Systems, support, launch"],
            ].map(([value, label]) => (
              <div
                key={label}
                className="rounded border border-white/8 bg-black/20 px-4 py-4"
              >
                <p className="text-2xl font-semibold text-foreground">
                  {value}
                </p>
                <p className="mt-2 text-[11px] uppercase tracking-[0.3em] text-white/45">
                  {label}
                </p>
              </div>
            ))}
          </div>
          <ContactForm />
        </div>
      </div>
    </PageShell>
  );
}

function InfoCard({
  title,
  description,
  icon,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded border border-white/8 bg-black/20 px-4 py-4">
      <div className="flex items-center gap-2 text-sm font-medium text-foreground">
        {icon}
        {title}
      </div>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        {description}
      </p>
    </div>
  );
}
