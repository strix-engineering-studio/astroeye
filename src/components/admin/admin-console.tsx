"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  BriefcaseBusiness,
  Building2,
  Inbox,
  Shield,
  Sparkles,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type LandingPageRecord = {
  id: string;
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
  createdAt: string;
  updatedAt: string;
};

type ClientRecord = {
  id: string;
  name: string;
  industry: string;
  status: string;
  owner: string;
  website: string;
  contactEmail: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
};

type IndustrySignal = {
  id: string;
  title: string;
  source: string;
  industry: string;
  summary: string;
  impact: string;
  link: string;
  priority: "low" | "medium" | "high";
  createdAt: string;
  updatedAt: string;
};

type ContactInquiry = {
  id: string;
  name: string;
  email: string;
  company?: string;
  category?: string;
  budget?: string;
  timeline?: string;
  brief?: string;
  status?: string;
  createdAt: string;
  updatedAt: string;
};

type AdminConsoleProps = {
  initialLandingPages: LandingPageRecord[];
  initialClients: ClientRecord[];
  initialSignals: IndustrySignal[];
  initialInquiries: ContactInquiry[];
};

type LandingPageDraft = {
  id?: string;
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
  metricsText: string;
  featuresText: string;
  offerBulletsText: string;
  seoTitle: string;
  seoDescription: string;
  contactEmail: string;
  notes: string;
  published: boolean;
};

type ClientDraft = {
  id?: string;
  name: string;
  industry: string;
  status: string;
  owner: string;
  website: string;
  contactEmail: string;
  notes: string;
};

type SignalDraft = {
  id?: string;
  title: string;
  source: string;
  industry: string;
  summary: string;
  impact: string;
  link: string;
  priority: "low" | "medium" | "high";
};

const emptyLandingDraft: LandingPageDraft = {
  slug: "",
  businessName: "",
  industry: "",
  heroEyebrow: "",
  heroTitle: "",
  heroDescription: "",
  primaryCtaLabel: "",
  primaryCtaHref: "",
  secondaryCtaLabel: "",
  secondaryCtaHref: "",
  metricsText: "Label|Value",
  featuresText: "Title|Description",
  offerBulletsText: "",
  seoTitle: "",
  seoDescription: "",
  contactEmail: "",
  notes: "",
  published: false,
};

const emptyClientDraft: ClientDraft = {
  name: "",
  industry: "",
  status: "active",
  owner: "",
  website: "",
  contactEmail: "",
  notes: "",
};

const emptySignalDraft: SignalDraft = {
  title: "",
  source: "",
  industry: "",
  summary: "",
  impact: "",
  link: "",
  priority: "medium",
};

function linesToList(value: string) {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function linesToPairs(value: string) {
  return linesToList(value).map((line) => {
    const [left, ...rest] = line.split("|");
    return {
      label: left?.trim() ?? "",
      value: rest.join("|").trim(),
    };
  });
}

function pairsToText(pairs: { label: string; value: string }[]) {
  return pairs.map((pair) => `${pair.label}|${pair.value}`).join("\n");
}


export function AdminConsole({
  initialLandingPages,
  initialClients,
  initialSignals,
  initialInquiries,
}: AdminConsoleProps) {
  const [landingPages, setLandingPages] = useState(initialLandingPages);
  const [clients, setClients] = useState(initialClients);
  const [signals, setSignals] = useState(initialSignals);
  const [inquiries, setInquiries] = useState(initialInquiries);
  const [activeTab, setActiveTab] = useState<
    "overview" | "pages" | "clients" | "signals" | "inquiries"
  >("overview");
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [landingDraft, setLandingDraft] =
    useState<LandingPageDraft>(emptyLandingDraft);
  const [clientDraft, setClientDraft] = useState<ClientDraft>(emptyClientDraft);
  const [signalDraft, setSignalDraft] = useState<SignalDraft>(emptySignalDraft);

  const metricsCount = useMemo(
    () => landingPages.reduce((count, page) => count + page.metrics.length, 0),
    [landingPages],
  );

  async function refreshResource(
    resource: "landing-pages" | "clients" | "signals" | "inquiries",
  ) {
    const response = await fetch(`/api/admin/${resource}`, {
      cache: "no-store",
    });
    const payload = await response.json();
    if (!response.ok)
      throw new Error(payload?.message ?? "Unable to refresh resource");

    if (resource === "landing-pages") setLandingPages(payload.items);
    if (resource === "clients") setClients(payload.items);
    if (resource === "signals") setSignals(payload.items);
    if (resource === "inquiries") setInquiries(payload.items);
  }

  async function saveLandingPage() {
    setLoading(true);
    setMessage(null);
    try {
      const response = await fetch("/api/admin/landing-pages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...landingDraft,
          metrics: linesToPairs(landingDraft.metricsText),
          features: linesToPairs(landingDraft.featuresText).map((pair) => ({
            title: pair.label,
            description: pair.value,
          })),
          offerBullets: linesToList(landingDraft.offerBulletsText),
        }),
      });
      const payload = await response.json();
      if (!response.ok)
        throw new Error(payload?.message ?? "Unable to save landing page");

      await refreshResource("landing-pages");
      setLandingDraft(emptyLandingDraft);
      setMessage("Landing page saved");
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Something went wrong",
      );
    } finally {
      setLoading(false);
    }
  }

  async function saveClient() {
    setLoading(true);
    setMessage(null);
    try {
      const response = await fetch("/api/admin/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(clientDraft),
      });
      const payload = await response.json();
      if (!response.ok)
        throw new Error(payload?.message ?? "Unable to save client");

      await refreshResource("clients");
      setClientDraft(emptyClientDraft);
      setMessage("Client saved");
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Something went wrong",
      );
    } finally {
      setLoading(false);
    }
  }

  async function saveSignal() {
    setLoading(true);
    setMessage(null);
    try {
      const response = await fetch("/api/admin/signals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(signalDraft),
      });
      const payload = await response.json();
      if (!response.ok)
        throw new Error(payload?.message ?? "Unable to save signal");

      await refreshResource("signals");
      setSignalDraft(emptySignalDraft);
      setMessage("Industry signal saved");
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Something went wrong",
      );
    } finally {
      setLoading(false);
    }
  }

  async function archiveInquiry(id: string) {
    setLoading(true);
    setMessage(null);
    try {
      const response = await fetch(
        `/api/admin/inquiries?id=${encodeURIComponent(id)}`,
        {
          method: "DELETE",
        },
      );
      const payload = await response.json();
      if (!response.ok)
        throw new Error(payload?.message ?? "Unable to archive inquiry");

      await refreshResource("inquiries");
      setMessage("Inquiry archived");
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Something went wrong",
      );
    } finally {
      setLoading(false);
    }
  }

  async function removeResource(
    resource: "landing-pages" | "clients" | "signals",
    id: string,
  ) {
    setLoading(true);
    setMessage(null);
    try {
      const response = await fetch(
        `/api/admin/${resource}?id=${encodeURIComponent(id)}`,
        {
          method: "DELETE",
        },
      );
      const payload = await response.json();
      if (!response.ok)
        throw new Error(payload?.message ?? "Unable to delete item");

      await refreshResource(resource);
      setMessage("Item deleted");
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Something went wrong",
      );
    } finally {
      setLoading(false);
    }
  }

  async function signOut() {
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.href = "/admin/login";
  }

  return (
    <section className="px-5 py-8 sm:px-6 lg:px-8 lg:py-10">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="rounded-[36px] border border-white/10 bg-white/5 p-6 backdrop-blur-xl sm:p-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1 text-xs uppercase tracking-[0.35em] text-emerald-100">
                <Shield className="size-3.5" />
                Admin Console
              </div>
              <h1 className="text-balance text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                Operations, content, and landing pages in one place.
              </h1>
              <p className="max-w-3xl text-sm leading-7 text-white/65 sm:text-base">
                Manage business landing pages, track contact leads, record
                clients, and capture industry signals without leaving the
                console.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button
                asChild
                variant="outline"
                className="border-white/12 bg-white/5 text-white hover:bg-white/10"
              >
                <Link href="/" className="inline-flex items-center gap-2">
                  View site
                  <ArrowUpRight className="size-4" />
                </Link>
              </Button>
              <Button
                onClick={signOut}
                className="bg-emerald-400 text-slate-950 hover:bg-emerald-300"
              >
                Sign out
              </Button>
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-4">
            <StatCard
              label="Landing pages"
              value={landingPages.length}
              icon={<BriefcaseBusiness className="size-4" />}
            />
            <StatCard
              label="Clients"
              value={clients.length}
              icon={<Building2 className="size-4" />}
            />
            <StatCard
              label="Inquiries"
              value={inquiries.length}
              icon={<Inbox className="size-4" />}
            />
            <StatCard
              label="Content metrics"
              value={metricsCount}
              icon={<Sparkles className="size-4" />}
            />
          </div>

          {message ? (
            <p className="mt-4 text-sm text-emerald-200">{message}</p>
          ) : null}
        </div>

        <div className="flex flex-wrap gap-2">
          {[
            ["overview", "Overview"],
            ["pages", "Landing pages"],
            ["clients", "Clients"],
            ["signals", "Industry signals"],
            ["inquiries", "Contact inbox"],
          ].map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => setActiveTab(key as typeof activeTab)}
              className={cn(
                "rounded-full border px-4 py-2 text-sm transition",
                activeTab === key
                  ? "border-emerald-300/25 bg-emerald-300/12 text-emerald-100"
                  : "border-white/10 bg-white/5 text-white/65 hover:bg-white/10",
              )}
            >
              {label}
            </button>
          ))}
        </div>

        {activeTab === "overview" ? (
          <div className="grid gap-5 lg:grid-cols-2">
            <SectionCard
              title="Business landing pages"
              description="Create and publish dedicated landing pages for each business or campaign."
            >
              <p className="text-sm text-white/60">
                Use the Landing pages tab to edit SEO, hero copy, feature
                blocks, and CTA links.
              </p>
            </SectionCard>
            <SectionCard
              title="Lead flow"
              description="Track form submissions and move them through your workflow."
            >
              <p className="text-sm text-white/60">
                Archive inquiries once they are reviewed or assigned.
              </p>
            </SectionCard>
            <SectionCard
              title="Client tracking"
              description="Keep a living record of active and past clients."
            >
              <p className="text-sm text-white/60">
                Store status, owner, website, and notes in one place.
              </p>
            </SectionCard>
            <SectionCard
              title="Industry monitoring"
              description="Capture market signals and references you want to revisit."
            >
              <p className="text-sm text-white/60">
                Record a source, impact level, and the takeaway that matters.
              </p>
            </SectionCard>
          </div>
        ) : null}

        {activeTab === "pages" ? (
          <div className="grid gap-5 xl:grid-cols-[0.8fr_1.2fr]">
            <ListPanel
              title="Published pages"
              items={landingPages}
              renderItem={(item) => (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-white">
                    {item.businessName}
                  </p>
                  <p className="text-xs text-white/45">/{item.slug}</p>
                  <p className="text-xs text-white/55">{item.industry}</p>
                </div>
              )}
              onEdit={(item) =>
                setLandingDraft({
                  id: item.id,
                  slug: item.slug,
                  businessName: item.businessName,
                  industry: item.industry,
                  heroEyebrow: item.heroEyebrow,
                  heroTitle: item.heroTitle,
                  heroDescription: item.heroDescription,
                  primaryCtaLabel: item.primaryCtaLabel,
                  primaryCtaHref: item.primaryCtaHref,
                  secondaryCtaLabel: item.secondaryCtaLabel,
                  secondaryCtaHref: item.secondaryCtaHref,
                  metricsText: pairsToText(item.metrics),
                  featuresText: item.features
                    .map((feature) => `${feature.title}|${feature.description}`)
                    .join("\n"),
                  offerBulletsText: item.offerBullets.join("\n"),
                  seoTitle: item.seoTitle,
                  seoDescription: item.seoDescription,
                  contactEmail: item.contactEmail,
                  notes: item.notes ?? "",
                  published: item.published,
                })
              }
              onDelete={(id) => removeResource("landing-pages", id)}
            />
            <DraftPanel
              title={landingDraft.id ? "Edit landing page" : "New landing page"}
              subtitle="Build a slug-based landing page from the console."
            >
              <ResourceFormGrid>
                <TextField
                  label="Business name"
                  value={landingDraft.businessName}
                  onChange={(value) =>
                    setLandingDraft({ ...landingDraft, businessName: value })
                  }
                />
                <TextField
                  label="Slug"
                  value={landingDraft.slug}
                  onChange={(value) =>
                    setLandingDraft({ ...landingDraft, slug: value })
                  }
                />
                <TextField
                  label="Industry"
                  value={landingDraft.industry}
                  onChange={(value) =>
                    setLandingDraft({ ...landingDraft, industry: value })
                  }
                />
                <TextField
                  label="Contact email"
                  value={landingDraft.contactEmail}
                  onChange={(value) =>
                    setLandingDraft({ ...landingDraft, contactEmail: value })
                  }
                />
                <TextField
                  label="Hero eyebrow"
                  value={landingDraft.heroEyebrow}
                  onChange={(value) =>
                    setLandingDraft({ ...landingDraft, heroEyebrow: value })
                  }
                />
                <TextField
                  label="Primary CTA label"
                  value={landingDraft.primaryCtaLabel}
                  onChange={(value) =>
                    setLandingDraft({ ...landingDraft, primaryCtaLabel: value })
                  }
                />
                <TextField
                  label="Primary CTA href"
                  value={landingDraft.primaryCtaHref}
                  onChange={(value) =>
                    setLandingDraft({ ...landingDraft, primaryCtaHref: value })
                  }
                />
                <TextField
                  label="Secondary CTA label"
                  value={landingDraft.secondaryCtaLabel}
                  onChange={(value) =>
                    setLandingDraft({
                      ...landingDraft,
                      secondaryCtaLabel: value,
                    })
                  }
                />
                <TextField
                  label="Secondary CTA href"
                  value={landingDraft.secondaryCtaHref}
                  onChange={(value) =>
                    setLandingDraft({
                      ...landingDraft,
                      secondaryCtaHref: value,
                    })
                  }
                />
              </ResourceFormGrid>

              <div className="mt-5 grid gap-4">
                <TextAreaField
                  label="Hero title"
                  value={landingDraft.heroTitle}
                  onChange={(value) =>
                    setLandingDraft({ ...landingDraft, heroTitle: value })
                  }
                />
                <TextAreaField
                  label="Hero description"
                  value={landingDraft.heroDescription}
                  onChange={(value) =>
                    setLandingDraft({ ...landingDraft, heroDescription: value })
                  }
                  rows={4}
                />
                <TextAreaField
                  label="Metrics (Label|Value per line)"
                  value={landingDraft.metricsText}
                  onChange={(value) =>
                    setLandingDraft({ ...landingDraft, metricsText: value })
                  }
                  rows={4}
                />
                <TextAreaField
                  label="Features (Title|Description per line)"
                  value={landingDraft.featuresText}
                  onChange={(value) =>
                    setLandingDraft({ ...landingDraft, featuresText: value })
                  }
                  rows={4}
                />
                <TextAreaField
                  label="Offer bullets"
                  value={landingDraft.offerBulletsText}
                  onChange={(value) =>
                    setLandingDraft({
                      ...landingDraft,
                      offerBulletsText: value,
                    })
                  }
                  rows={4}
                />
                <TextAreaField
                  label="SEO title"
                  value={landingDraft.seoTitle}
                  onChange={(value) =>
                    setLandingDraft({ ...landingDraft, seoTitle: value })
                  }
                />
                <TextAreaField
                  label="SEO description"
                  value={landingDraft.seoDescription}
                  onChange={(value) =>
                    setLandingDraft({ ...landingDraft, seoDescription: value })
                  }
                  rows={3}
                />
                <TextAreaField
                  label="Notes"
                  value={landingDraft.notes}
                  onChange={(value) =>
                    setLandingDraft({ ...landingDraft, notes: value })
                  }
                  rows={3}
                />
              </div>

              <div className="mt-5 flex items-center gap-3">
                <label className="flex items-center gap-2 text-sm text-white/70">
                  <input
                    type="checkbox"
                    checked={landingDraft.published}
                    onChange={(event) =>
                      setLandingDraft({
                        ...landingDraft,
                        published: event.target.checked,
                      })
                    }
                  />
                  Published
                </label>
                <Button
                  type="button"
                  onClick={saveLandingPage}
                  disabled={loading}
                  className="bg-emerald-400 text-slate-950 hover:bg-emerald-300"
                >
                  {landingDraft.id ? "Update page" : "Create page"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setLandingDraft(emptyLandingDraft)}
                  className="border-white/12 bg-white/5 text-white hover:bg-white/10"
                >
                  Clear
                </Button>
              </div>
            </DraftPanel>
          </div>
        ) : null}

        {activeTab === "clients" ? (
          <div className="grid gap-5 xl:grid-cols-[0.8fr_1.2fr]">
            <ListPanel
              title="Client records"
              items={clients}
              renderItem={(item) => (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-white">{item.name}</p>
                  <p className="text-xs text-white/45">{item.industry}</p>
                  <p className="text-xs text-white/55">{item.status}</p>
                </div>
              )}
              onEdit={(item) => setClientDraft({ ...item })}
              onDelete={(id) => removeResource("clients", id)}
            />
            <DraftPanel
              title={clientDraft.id ? "Edit client" : "New client"}
              subtitle="Keep a structured client record."
            >
              <ResourceFormGrid>
                <TextField
                  label="Client name"
                  value={clientDraft.name}
                  onChange={(value) =>
                    setClientDraft({ ...clientDraft, name: value })
                  }
                />
                <TextField
                  label="Industry"
                  value={clientDraft.industry}
                  onChange={(value) =>
                    setClientDraft({ ...clientDraft, industry: value })
                  }
                />
                <TextField
                  label="Status"
                  value={clientDraft.status}
                  onChange={(value) =>
                    setClientDraft({ ...clientDraft, status: value })
                  }
                />
                <TextField
                  label="Owner"
                  value={clientDraft.owner}
                  onChange={(value) =>
                    setClientDraft({ ...clientDraft, owner: value })
                  }
                />
                <TextField
                  label="Website"
                  value={clientDraft.website}
                  onChange={(value) =>
                    setClientDraft({ ...clientDraft, website: value })
                  }
                />
                <TextField
                  label="Contact email"
                  value={clientDraft.contactEmail}
                  onChange={(value) =>
                    setClientDraft({ ...clientDraft, contactEmail: value })
                  }
                />
              </ResourceFormGrid>
              <div className="mt-5">
                <TextAreaField
                  label="Notes"
                  value={clientDraft.notes}
                  onChange={(value) =>
                    setClientDraft({ ...clientDraft, notes: value })
                  }
                  rows={5}
                />
              </div>
              <div className="mt-5 flex items-center gap-3">
                <Button
                  type="button"
                  onClick={saveClient}
                  disabled={loading}
                  className="bg-emerald-400 text-slate-950 hover:bg-emerald-300"
                >
                  {clientDraft.id ? "Update client" : "Create client"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setClientDraft(emptyClientDraft)}
                  className="border-white/12 bg-white/5 text-white hover:bg-white/10"
                >
                  Clear
                </Button>
              </div>
            </DraftPanel>
          </div>
        ) : null}

        {activeTab === "signals" ? (
          <div className="grid gap-5 xl:grid-cols-[0.8fr_1.2fr]">
            <ListPanel
              title="Signals"
              items={signals}
              renderItem={(item) => (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-white">{item.title}</p>
                  <p className="text-xs text-white/45">{item.source}</p>
                  <p className="text-xs text-white/55 capitalize">
                    {item.priority} priority
                  </p>
                </div>
              )}
              onEdit={(item) => setSignalDraft({ ...item })}
              onDelete={(id) => removeResource("signals", id)}
            />
            <DraftPanel
              title={signalDraft.id ? "Edit signal" : "New signal"}
              subtitle="Track what is changing in a market or niche."
            >
              <ResourceFormGrid>
                <TextField
                  label="Title"
                  value={signalDraft.title}
                  onChange={(value) =>
                    setSignalDraft({ ...signalDraft, title: value })
                  }
                />
                <TextField
                  label="Source"
                  value={signalDraft.source}
                  onChange={(value) =>
                    setSignalDraft({ ...signalDraft, source: value })
                  }
                />
                <TextField
                  label="Industry"
                  value={signalDraft.industry}
                  onChange={(value) =>
                    setSignalDraft({ ...signalDraft, industry: value })
                  }
                />
                <TextField
                  label="Priority"
                  value={signalDraft.priority}
                  onChange={(value) =>
                    setSignalDraft({
                      ...signalDraft,
                      priority: value as SignalDraft["priority"],
                    })
                  }
                />
              </ResourceFormGrid>
              <div className="mt-5 grid gap-4">
                <TextAreaField
                  label="Summary"
                  value={signalDraft.summary}
                  onChange={(value) =>
                    setSignalDraft({ ...signalDraft, summary: value })
                  }
                  rows={4}
                />
                <TextAreaField
                  label="Impact"
                  value={signalDraft.impact}
                  onChange={(value) =>
                    setSignalDraft({ ...signalDraft, impact: value })
                  }
                  rows={4}
                />
                <TextAreaField
                  label="Link"
                  value={signalDraft.link}
                  onChange={(value) =>
                    setSignalDraft({ ...signalDraft, link: value })
                  }
                  rows={2}
                />
              </div>
              <div className="mt-5 flex items-center gap-3">
                <Button
                  type="button"
                  onClick={saveSignal}
                  disabled={loading}
                  className="bg-emerald-400 text-slate-950 hover:bg-emerald-300"
                >
                  {signalDraft.id ? "Update signal" : "Create signal"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setSignalDraft(emptySignalDraft)}
                  className="border-white/12 bg-white/5 text-white hover:bg-white/10"
                >
                  Clear
                </Button>
              </div>
            </DraftPanel>
          </div>
        ) : null}

        {activeTab === "inquiries" ? (
          <div className="space-y-5">
            {inquiries.length === 0 ? (
              <SectionCard
                title="No inquiries yet"
                description="Incoming leads will appear here automatically."
              >
                <p className="text-sm text-white/60">
                  Share the contact page to begin collecting inquiries.
                </p>
              </SectionCard>
            ) : (
              <div className="grid gap-4 lg:grid-cols-2">
                {inquiries.map((inquiry) => (
                  <div
                    key={inquiry.id}
                    className="rounded-[28px] border border-white/10 bg-white/5 p-5"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-lg font-semibold text-white">
                          {inquiry.name}
                        </p>
                        <p className="text-sm text-white/55">{inquiry.email}</p>
                      </div>
                      <span
                        className={cn(
                          "rounded-full border px-3 py-1 text-xs uppercase tracking-[0.3em]",
                          inquiry.status === "archived"
                            ? "border-white/10 bg-white/5 text-white/45"
                            : "border-emerald-300/20 bg-emerald-300/10 text-emerald-100",
                        )}
                      >
                        {inquiry.status ?? "new"}
                      </span>
                    </div>
                    <div className="mt-4 grid gap-3 text-sm text-white/65">
                      <p>
                        <span className="text-white/40">Company:</span>{" "}
                        {inquiry.company || "—"}
                      </p>
                      <p>
                        <span className="text-white/40">Category:</span>{" "}
                        {inquiry.category || "—"}
                      </p>
                      <p>
                        <span className="text-white/40">Budget:</span>{" "}
                        {inquiry.budget || "—"}
                      </p>
                      <p>
                        <span className="text-white/40">Timeline:</span>{" "}
                        {inquiry.timeline || "—"}
                      </p>
                      <p className="leading-7">
                        <span className="text-white/40">Brief:</span>{" "}
                        {inquiry.brief || "—"}
                      </p>
                    </div>
                    <div className="mt-5 flex flex-wrap gap-3">
                      <Button
                        asChild
                        variant="outline"
                        className="border-white/12 bg-white/5 text-white hover:bg-white/10"
                      >
                        <a href={`mailto:${inquiry.email}`}>Reply</a>
                      </Button>
                      <Button
                        type="button"
                        onClick={() => archiveInquiry(inquiry.id)}
                        className="bg-emerald-400 text-slate-950 hover:bg-emerald-300"
                        disabled={loading}
                      >
                        Archive
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : null}
      </div>
    </section>
  );
}

function StatCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded border border-white/10 bg-black/20 p-5">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm uppercase tracking-[0.3em] text-white/40">
          {label}
        </p>
        <span className="rounded-full border border-white/10 bg-white/5 p-2 text-white/65">
          {icon}
        </span>
      </div>
      <p className="mt-4 text-3xl font-semibold text-white">{value}</p>
    </div>
  );
}

function SectionCard({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="rounded border border-white/10 bg-white/5 p-5">
      <p className="text-lg font-semibold text-white">{title}</p>
      <p className="mt-2 text-sm leading-7 text-white/60">{description}</p>
      {children ? <div className="mt-4">{children}</div> : null}
    </div>
  );
}

function ListPanel<T extends { id: string }>({
  title,
  items,
  renderItem,
  onEdit,
  onDelete,
}: {
  title: string;
  items: T[];
  renderItem: (item: T) => React.ReactNode;
  onEdit: (item: T) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div className="space-y-4 rounded-[32px] border border-white/10 bg-white/5 p-5">
      <p className="text-lg font-semibold text-white">{title}</p>
      <div className="space-y-3">
        {items.map((item) => (
          <div
            key={item.id}
            className="rounded-3xl border border-white/10 bg-black/20 p-4"
          >
            {renderItem(item)}
            <div className="mt-4 flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onEdit(item)}
                className="border-white/12 bg-white/5 text-white hover:bg-white/10"
              >
                Edit
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => onDelete(item.id)}
                className="border-white/12 bg-white/5 text-white hover:bg-white/10"
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
          </div>
        ))}
        {items.length === 0 ? (
          <p className="text-sm text-white/55">No records yet.</p>
        ) : null}
      </div>
    </div>
  );
}

function DraftPanel({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-[32px] border border-white/10 bg-white/5 p-5">
      <p className="text-lg font-semibold text-white">{title}</p>
      <p className="mt-2 text-sm leading-7 text-white/60">{subtitle}</p>
      <div className="mt-4">{children}</div>
    </div>
  );
}

function ResourceFormGrid({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-4 md:grid-cols-2">{children}</div>;
}

function TextField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="space-y-2 text-sm text-white/70">
      <span>{label}</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-3xl border border-white/10 bg-black/25 px-4 py-3 text-sm text-white outline-none placeholder:text-white/35"
      />
    </label>
  );
}

function TextAreaField({
  label,
  value,
  onChange,
  rows = 3,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
}) {
  return (
    <label className="space-y-2 text-sm text-white/70">
      <span>{label}</span>
      <textarea
        value={value}
        rows={rows}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-3xl border border-white/10 bg-black/25 px-4 py-3 text-sm text-white outline-none placeholder:text-white/35"
      />
    </label>
  );
}
