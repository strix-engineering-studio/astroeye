import type { Metadata } from "next";

import { buildMetadata } from "@/lib/seo";
import { AstrologyPage } from "../components/astrology/astrology-page";

export const metadata: Metadata = buildMetadata({
  title: "Strix Engineering Studio | Architecture-First Product Engineering",
  description:
    "Strix Engineering Studio helps startups and technology businesses design, build, deploy, and evolve production-grade software systems.",
  path: "/",
  keywords: ["product engineering", "software systems", "architecture first"],
});

export default function Home() {
  return <AstrologyPage />;
}
