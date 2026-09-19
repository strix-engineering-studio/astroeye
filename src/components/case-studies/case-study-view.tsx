"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowUpRight,
  CheckCircle2,
  ShieldCheck,
  Workflow,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { Project } from "@/lib/site";

const sections = [
  { id: "overview", label: "Overview" },
  { id: "problem", label: "Problem" },
  { id: "solution", label: "Solution" },
  { id: "architecture", label: "Architecture" },
  { id: "pipeline", label: "Pipeline" },
  { id: "result", label: "Result" },
];

export function CaseStudyView({ project }: { project: Project }) {
  return (
    <section className="px-3 py-10 sm:px-4 lg:px-6 lg:py-14">
      <div className="mx-auto grid max-w-7xl gap-8 xl:grid-cols-[220px_1fr]">
        <aside className="hidden xl:block">
          <div className="sticky top-28 space-y-4 rounded border border-white/10 bg-white/4 p-4 backdrop-blur-xl">
            <Link
              href="/work"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground"
            >
              <ArrowLeft className="size-4" />
              Back to work
            </Link>
            <div className="space-y-2 border-t border-white/10 pt-4">
              {sections.map((section) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className="block rounded-xl px-3 py-2 text-sm text-muted-foreground transition hover:bg-white/6 hover:text-foreground"
                >
                  {section.label}
                </a>
              ))}
            </div>
          </div>
        </aside>

        <div className="space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="overflow-hidden rounded-xl border border-white/10 bg-white/4 p-6 sm:p-8"
          >
            <p className="text-xs uppercase tracking-[0.35em] text-white/55">
              {project.category}
            </p>
            <h1 className="mt-3 text-balance text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
              {project.title}
            </h1>
            <p className="mt-4 max-w-3xl text-lg leading-8 text-muted-foreground">
              {project.tagline}
            </p>
            <div className="mt-8 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="rounded border border-white/8 bg-black/20 p-5">
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>Launch profile</span>
                  <span>{project.timeline}</span>
                </div>
                <div className="mt-5 grid gap-3 sm:grid-cols-3">
                  {project.metrics.map((metric) => (
                    <div
                      key={metric}
                      className="rounded border border-white/8 bg-white/4 p-4 text-sm text-foreground"
                    >
                      {metric}
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded border border-white/8 bg-[linear-gradient(135deg,rgba(216,158,88,0.12),rgba(122,168,112,0.08))] p-5">
                <p className="text-sm uppercase tracking-[0.3em] text-white/55">
                  Highlights
                </p>
                <div className="mt-4 space-y-3 text-sm text-white/74">
                  {project.highlights.map((item) => (
                    <div
                      key={item}
                      className="flex items-start gap-3 rounded border border-white/8 bg-black/20 px-4 py-3"
                    >
                      <CheckCircle2 className="mt-0.5 size-4 text-foreground" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          <div id="overview" className="grid gap-5 lg:grid-cols-2">
            <InfoPanel title="Project overview" text={project.summary} />
            <InfoPanel
              title="Problem"
              text={project.problem}
              icon={ShieldCheck}
            />
          </div>

          <section
            id="solution"
            className="grid gap-5 lg:grid-cols-[0.95fr_1.05fr]"
          >
            <InfoPanel title="Solution" text={project.solution} />
            <div className="rounded-xl border border-white/10 bg-white/4 p-5">
              <div className="flex items-center gap-3">
                <div className="rounded border border-white/10 bg-black/20 p-3 text-foreground">
                  <Workflow className="size-5" />
                </div>
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-white/45">
                    System flow
                  </p>
                  <p className="text-lg font-semibold text-foreground">
                    Architecture diagram
                  </p>
                </div>
              </div>
              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                {project.architecture.map((item, index) => (
                  <div
                    key={item}
                    className="rounded border border-white/8 bg-black/20 p-4"
                  >
                    <p className="text-[11px] uppercase tracking-[0.25em] text-white/38">
                      0{index + 1}
                    </p>
                    <p className="mt-2 text-sm text-foreground">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <div id="architecture" className="grid gap-5 lg:grid-cols-2">
            <InfoPanel title="Tech stack" text={project.stack.join(" • ")} />
            <div
              id="pipeline"
              className="rounded-xl border border-white/10 bg-white/4 p-5"
            >
              <p className="text-sm uppercase tracking-[0.3em] text-white/45">
                Deployment pipeline
              </p>
              <div className="mt-5 space-y-3">
                {project.deployment.map((step, index) => (
                  <div
                    key={step}
                    className="flex items-center gap-4 rounded border border-white/8 bg-black/20 px-4 py-3"
                  >
                    <span className="flex size-8 items-center justify-center rounded-full bg-white/8 text-xs text-foreground">
                      0{index + 1}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {step}
                    </span>
                    <ArrowUpRight className="ml-auto size-4 text-white/35" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div id="problem" className="grid gap-5 lg:grid-cols-2">
            <InfoPanel
              title="Challenges"
              text="Scoped work into a sequence of solvable releases so product quality stayed high while the system evolved."
            />
            <InfoPanel
              title="Result"
              text={project.result}
              icon={CheckCircle2}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function InfoPanel({
  title,
  text,
  icon: Icon,
}: {
  title: string;
  text: string;
  icon?: LucideIcon;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/4 p-5">
      <div className="flex items-center gap-3">
        {Icon ? (
          <div className="rounded border border-white/10 bg-black/20 p-3 text-foreground">
            <Icon className="size-5" />
          </div>
        ) : null}
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-white/45">
            {title}
          </p>
          <h2 className="text-lg font-semibold text-foreground">{title}</h2>
        </div>
      </div>
      <p className="mt-4 text-sm leading-7 text-muted-foreground">{text}</p>
    </div>
  );
}
