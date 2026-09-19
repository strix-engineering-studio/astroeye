"use client";

import { LinkedInPost } from "../social/linkedin-post";

const posts = [
  {
    embedUrl:
      "https://www.linkedin.com/embed/feed/update/urn:li:share:7496604617246613506?collapsed=1",
    date: "22 AUG 2026",
  },
  {
    embedUrl:
      "https://www.linkedin.com/embed/feed/update/urn:li:ugcPost:7495022826131963904?compact=1",
    date: "18 AUG 2026",
  },
  {
    embedUrl:
      "https://www.linkedin.com/embed/feed/update/urn:li:share:7493359812563353601?collapsed=1",
    date: "15 AUG 2026",
  },
];

export function LinkedInSection() {
  return (
    <section className="relative overflow-hidden py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10 flex items-end justify-between gap-6">
          <div>
            <div className="mb-3 font-mono text-[9px] uppercase tracking-[0.3em] text-foreground/40">
              SIGNALS / LINKEDIN
            </div>

            <h2 className="font-sans text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
              From the{" "}
              <span className="font-display font-normal italic">studio.</span>
            </h2>
          </div>

          <a
            href="https://www.linkedin.com/company/strix-engineering-studio/"
            target="_blank"
            rel="noopener noreferrer"
            className="
              hidden
              font-mono
              text-[9px]
              uppercase
              tracking-[0.2em]
              text-foreground/45
              transition-colors
              hover:text-[#e8541c]
              sm:block
            "
          >
            View LinkedIn →
          </a>
        </div>

        {/* Horizontal rail */}
        <div
          className="
            -mx-4
            overflow-x-auto
            px-4
            pb-6
            sm:-mx-6
            sm:px-6
            lg:-mx-8
            lg:px-8
            [scrollbar-width:none]
            [&::-webkit-scrollbar]:hidden
          "
        >
          <div
            className="
              flex
              w-max
              snap-x
              snap-mandatory
              gap-5
            "
          >
            {posts.map((post, index) => (
              <div
                key={post.embedUrl}
                className="
                  w-[calc(100vw-2rem)]
                  max-w-[560px]
                  shrink-0
                  snap-start
                  sm:w-[520px]
                  lg:w-[560px]
                "
              >
                <LinkedInPost
                  embedUrl={post.embedUrl}
                  signal={`SIGNAL / ${String(index + 1).padStart(3, "0")}`}
                  date={post.date}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="mt-2 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="h-px w-10 bg-foreground/20" />

            <span className="font-mono text-[8px] uppercase tracking-[0.2em] text-foreground/30">
              Scroll to explore
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {posts.map((post, index) => (
              <span
                key={post.embedUrl}
                className={`
                  h-1
                  transition-all
                  ${index === 0 ? "w-6 bg-[#e8541c]" : "w-2 bg-foreground/20"}
                `}
              />
            ))}
          </div>
        </div>

        {/* Mobile LinkedIn link */}
        <div className="mt-6 sm:hidden">
          <a
            href="https://www.linkedin.com/company/strix-engineering-studio/"
            target="_blank"
            rel="noopener noreferrer"
            className="
              font-mono
              text-[9px]
              uppercase
              tracking-[0.2em]
              text-foreground/45
              transition-colors
              hover:text-[#e8541c]
            "
          >
            View LinkedIn →
          </a>
        </div>
      </div>
    </section>
  );
}
