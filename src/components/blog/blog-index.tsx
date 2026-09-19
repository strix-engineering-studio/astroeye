"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowUpRight, Search, Tag } from "lucide-react";
import type { BlogPostMeta } from "@/lib/content";
import { cn } from "@/lib/utils";

type BlogIndexProps = {
  posts: BlogPostMeta[];
};

export function BlogIndex({ posts }: BlogIndexProps) {
  const [query, setQuery] = useState("");
  const [tag, setTag] = useState("All");

  const tags = useMemo(
    () => ["All", ...new Set(posts.map((post) => post.tag))],
    [posts],
  );

  const filtered = useMemo(
    () =>
      posts.filter((post) => {
        const matchesQuery = [post.title, post.excerpt, post.tag]
          .join(" ")
          .toLowerCase()
          .includes(query.toLowerCase());
        const matchesTag = tag === "All" || post.tag === tag;
        return matchesQuery && matchesTag;
      }),
    [posts, query, tag],
  );

  return (
    <div className="space-y-8">
      <div className="grid gap-4 rounded-xl border border-white/10 bg-white/4 p-4 lg:grid-cols-[1fr_auto] lg:items-center">
        <label className="flex items-center gap-3 rounded border border-white/10 bg-black/20 px-4 py-3 text-white/60">
          <Search className="size-4" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search articles"
            className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/35"
          />
        </label>
        <div className="flex flex-wrap gap-2">
          {tags.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setTag(item)}
              className={cn(
                "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition",
                tag === item
                  ? "border-white/20 bg-white/10 text-foreground"
                  : "border-white/10 bg-white/5 text-white/68 hover:bg-white/8",
              )}
            >
              <Tag className="size-4" />
              {item}
            </button>
          ))}
        </div>
      </div>

      {filtered[0] ? (
        <Link
          href={`/blog/${filtered[0].slug}`}
          className="group grid overflow-hidden rounded-xl border border-white/10 bg-white/4 lg:grid-cols-[0.95fr_1.05fr]"
        >
          <div className="min-h-72 bg-[radial-gradient(circle_at_18%_22%,rgba(216,158,88,0.3),transparent_24%),radial-gradient(circle_at_82%_24%,rgba(122,168,112,0.22),transparent_22%),linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))]" />
          <div className="space-y-4 p-5 sm:p-6 lg:p-8">
            <div className="flex items-center justify-between gap-4 text-xs uppercase tracking-[0.35em] text-white/45">
              <span>{filtered[0].tag}</span>
              <span>{filtered[0].readingTime}</span>
            </div>
            <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              {filtered[0].title}
            </h2>
            <p className="max-w-2xl text-sm leading-7 text-muted-foreground">
              {filtered[0].excerpt}
            </p>
            <div className="flex items-center justify-between pt-4 text-sm text-muted-foreground">
              <span>
                {new Date(filtered[0].publishedAt).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
              <span className="inline-flex items-center gap-2 text-foreground transition group-hover:translate-x-0.5">
                Read article
                <ArrowUpRight className="size-4" />
              </span>
            </div>
          </div>
        </Link>
      ) : null}

      <div className="grid gap-5 lg:grid-cols-2">
        {filtered.slice(1).map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="group overflow-hidden rounded-xl border border-white/10 bg-white/4 transition hover:-translate-y-1 hover:bg-white/5"
          >
            <div className="h-40 bg-[radial-gradient(circle_at_25%_20%,rgba(216,158,88,0.24),transparent_24%),radial-gradient(circle_at_70%_25%,rgba(122,168,112,0.18),transparent_22%),linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.012))]" />
            <div className="space-y-4 p-5">
              <div className="flex items-center justify-between gap-4">
                <p className="text-xs uppercase tracking-[0.35em] text-white/45">
                  {post.tag}
                </p>
                <span className="text-xs text-white/38">
                  {post.readingTime}
                </span>
              </div>
              <h3 className="text-2xl font-semibold text-foreground">
                {post.title}
              </h3>
              <p className="max-w-2xl text-sm leading-7 text-muted-foreground">
                {post.excerpt}
              </p>
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>
                  {new Date(post.publishedAt).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
                <span className="inline-flex items-center gap-2 text-foreground transition group-hover:translate-x-0.5">
                  Read article
                  <ArrowUpRight className="size-4" />
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
