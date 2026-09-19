import Link from "next/link";
import { JsonLd } from "@/components/seo/json-ld";
import {
  breadcrumbSchema,
  faqSchema,
  organizationSchema,
  websiteSchema,
} from "@/lib/seo";
import { PageShell } from "@/components/shared/page-shell";

type ContentPageProps = {
  path: string;
  eyebrow: string;
  title: string;
  description: string;
  whatIsThis: string;
  whoIsItFor: string;
  whatProblemDoesItSolve: string;
  howDoesItWork: string;
  whyChooseStrix: string;
  related: { label: string; href: string }[];
  faqs: { question: string; answer: string }[];
  children?: React.ReactNode;
};

export function ContentPage(props: ContentPageProps) {
  return (
    <>
      <JsonLd
        data={[
          organizationSchema(),
          websiteSchema(),
          breadcrumbSchema([
            { name: "Home", item: "https://strix.website/" },
            { name: props.title, item: `https://strix.website${props.path}` },
          ]),
          faqSchema(props.faqs),
        ]}
      />

      <PageShell
        eyebrow={props.eyebrow}
        title={props.title}
        description={props.description}
      >
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-6 rounded-xl border border-white/10 bg-white/4 p-5">
            <Section title="What is this?" body={props.whatIsThis} />
            <Section title="Who is it for?" body={props.whoIsItFor} />
            <Section
              title="What problem does it solve?"
              body={props.whatProblemDoesItSolve}
            />
            <Section title="How does it work?" body={props.howDoesItWork} />
            <Section title="Why choose Strix?" body={props.whyChooseStrix} />
          </div>

          <aside className="space-y-6 rounded-xl border border-white/10 bg-black/20 p-5">
            <div>
              <p className="text-[11px] uppercase tracking-[0.35em] text-white/45">
                Related
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {props.related.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-foreground transition hover:bg-white/10"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <p className="text-[11px] uppercase tracking-[0.35em] text-white/45">
                FAQs
              </p>
              <div className="mt-4 space-y-4">
                {props.faqs.map((faq) => (
                  <div
                    key={faq.question}
                    className="rounded border border-white/10 bg-white/5 p-4"
                  >
                    <p className="font-medium text-foreground">
                      {faq.question}
                    </p>
                    <p className="mt-2 text-sm leading-7 text-muted-foreground">
                      {faq.answer}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>

        {props.children}
      </PageShell>
    </>
  );
}

function Section({ title, body }: { title: string; body: string }) {
  return (
    <section>
      <p className="text-[11px] uppercase tracking-[0.35em] text-white/45">
        {title}
      </p>
      <p className="mt-3 text-sm leading-7 text-muted-foreground">{body}</p>
    </section>
  );
}
