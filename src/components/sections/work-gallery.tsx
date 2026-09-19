"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { featuredProjects } from "@/lib/site";

export function WorkGallery() {
  return (
    <div className="grid gap-5 lg:grid-cols-3">
      {featuredProjects.slice(0, 3).map((project) => (
        <Link
          key={project.slug}
          href={`/case-studies/${project.slug}`}
          className="group overflow-hidden rounded-xl border border-white/10 bg-white/5 p-5 transition duration-500 hover:-translate-y-1 hover:border-white/16 hover:bg-white/7"
        >
          <div className="space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[11px] uppercase tracking-[0.42em] text-sky-200/78">
                  {project.category}
                </p>
                <h3 className="mt-2 text-2xl font-semibold text-foreground">
                  {project.title}
                </h3>
              </div>
              <ArrowUpRight className="size-5 text-white/50 transition group-hover:text-sky-200" />
            </div>
            <p className="max-w-xl text-sm leading-7 text-muted-foreground">
              {project.summary}
            </p>
            <div className="grid gap-3 sm:grid-cols-3">
              {project.metrics.map((metric) => (
                <div
                  key={metric}
                  className="rounded border border-white/8 bg-black/20 px-4 py-3 text-sm text-white/72"
                >
                  {metric}
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              {project.stack.slice(0, 4).map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-white/8 bg-black/20 px-3 py-1.5 text-xs text-white/68"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
