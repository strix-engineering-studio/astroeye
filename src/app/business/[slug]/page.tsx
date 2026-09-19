import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight, Sparkles } from "lucide-react";
import { getLandingPagesCollection } from "@/lib/admin-data";
import { Button } from "@/components/ui/button";

type BusinessLandingPage = {
  slug: string;
  businessName: string;
  industry: string;
  heroEyebrow: string;
  heroTitle: string;
  heroDescription: string;
  primaryCtaLabel: string;
  primaryCtaHref: string;
  secondaryCtaLabel: string;
  secondaryCtaHref: string;
  metrics: { label: string; value: string }[];
  features: { title: string; description: string }[];
  offerBullets: string[];
  seoTitle: string;
  seoDescription: string;
  contactEmail: string;
  notes?: string;
  published: boolean;
};

async function getLandingPage(slug: string) {
  const collection = await getLandingPagesCollection();
  return collection.findOne({ slug, published: true });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const landingPage = (await getLandingPage(
    slug,
  )) as BusinessLandingPage | null;

  if (!landingPage) {
    return { title: "Business Landing Page" };
  }

  return {
    title: landingPage.seoTitle,
    description: landingPage.seoDescription,
  };
}

export default async function BusinessLandingPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const landingPage = (await getLandingPage(
    slug,
  )) as BusinessLandingPage | null;

  if (!landingPage) {
    notFound();
  }

  return (
    <section className="px-5 py-12 sm:px-6 lg:px-8 lg:py-16">
      <div className="mx-auto max-w-7xl space-y-10">
        <div className="overflow-hidden rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl sm:p-8 lg:p-10">
          <div className="flex flex-wrap items-center gap-3 text-sm text-white/60">
            <span className="rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1 text-emerald-100">
              {landingPage.heroEyebrow}
            </span>
            <span>{landingPage.industry}</span>
          </div>
          <h1 className="mt-4 max-w-4xl text-balance text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
            {landingPage.heroTitle}
          </h1>
          <p className="mt-5 max-w-3xl text-pretty text-base leading-8 text-white/68 sm:text-lg">
            {landingPage.heroDescription}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button
              asChild
              className="bg-emerald-400 text-slate-950 hover:bg-emerald-300"
            >
              <Link
                href={landingPage.primaryCtaHref}
                className="inline-flex items-center gap-2"
              >
                {landingPage.primaryCtaLabel}
                <ArrowUpRight className="size-4" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="border-white/12 bg-white/5 text-white hover:bg-white/10"
            >
              <Link href={landingPage.secondaryCtaHref}>
                {landingPage.secondaryCtaLabel}
              </Link>
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {landingPage.metrics.map((metric) => (
            <div
              key={metric.label}
              className="rounded-xl border border-white/10 bg-white/5 p-5"
            >
              <p className="text-sm uppercase tracking-[0.3em] text-white/40">
                {metric.label}
              </p>
              <p className="mt-3 text-3xl font-semibold text-white">
                {metric.value}
              </p>
            </div>
          ))}
        </div>

        <div className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-xl border border-white/10 bg-white/5 p-6">
            <p className="text-sm uppercase tracking-[0.35em] text-emerald-300/75">
              What’s included
            </p>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {landingPage.features.map((feature) => (
                <div
                  key={feature.title}
                  className="rounded border border-white/10 bg-black/20 p-4"
                >
                  <h2 className="text-lg font-semibold text-white">
                    {feature.title}
                  </h2>
                  <p className="mt-2 text-sm leading-7 text-white/65">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-5 rounded-xl border border-white/10 bg-white/5 p-6">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-white/40">
                Offer bullets
              </p>
              <div className="mt-4 space-y-3">
                {landingPage.offerBullets.map((bullet) => (
                  <div
                    key={bullet}
                    className="flex items-center gap-3 rounded border border-white/10 bg-black/20 px-4 py-3 text-sm text-white/70"
                  >
                    <Sparkles className="size-4 text-emerald-300" />
                    <span>{bullet}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded border border-emerald-300/15 bg-emerald-300/8 p-5 text-sm text-white/72">
              <p className="font-medium text-emerald-100">Contact</p>
              <p className="mt-2">{landingPage.contactEmail}</p>
              {landingPage.notes ? (
                <p className="mt-3 leading-7 text-white/60">
                  {landingPage.notes}
                </p>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
