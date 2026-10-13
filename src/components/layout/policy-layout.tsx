import type { ReactNode } from "react";

interface PolicySection {
  title: string;
  content: ReactNode;
}

interface PolicyLayoutProps {
  title: string;
  description: string;
  lastUpdated?: string;
  sections: PolicySection[];
}

export default function PolicyLayout({
  title,
  description,
  lastUpdated = "October 13, 2026",
  sections,
}: PolicyLayoutProps) {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="border-b bg-muted/30">
        <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <p className="mb-3 text-sm font-medium uppercase tracking-wider text-muted-foreground">
            Astroeye Policies
          </p>

          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {title}
          </h1>

          <p className="mt-4 max-w-3xl text-base leading-7 text-muted-foreground">
            {description}
          </p>

          <p className="mt-5 text-sm text-muted-foreground">
            Last updated: {lastUpdated}
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-14">
          <aside className="h-fit lg:sticky lg:top-8">
            <p className="mb-3 text-sm font-semibold">On this page</p>

            <nav aria-label="Policy sections" className="space-y-2">
              {sections.map((section, index) => (
                <a
                  key={section.title}
                  href={`#section-${index + 1}`}
                  className="block text-sm leading-6 text-muted-foreground transition-colors hover:text-foreground"
                >
                  {section.title}
                </a>
              ))}
            </nav>
          </aside>

          <article className="min-w-0 space-y-10">
            {sections.map((section, index) => (
              <section
                key={section.title}
                id={`section-${index + 1}`}
                className="scroll-mt-8 space-y-3"
              >
                <h2 className="text-xl font-semibold tracking-tight">
                  {section.title}
                </h2>

                <div className="space-y-3 text-sm leading-7 text-muted-foreground sm:text-base">
                  {section.content}
                </div>
              </section>
            ))}

            <div className="border-t pt-6 text-sm text-muted-foreground">
              Questions about this policy? Contact Astroeye through the contact
              details published on our website.
            </div>
          </article>
        </div>
      </div>
    </main>
  );
}
