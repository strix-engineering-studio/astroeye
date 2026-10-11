"use client";

import { ExpertRequestsPage } from "@/features/expert-requests";
import { useParams } from "next/navigation";

export default function Page() {
  const { id } = useParams<{ id: string }>();

  return <ExpertRequestsPage filters={{ userId: id }} />;
}
