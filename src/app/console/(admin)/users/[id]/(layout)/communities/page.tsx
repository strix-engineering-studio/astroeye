"use client";

import { CommunitiesPage } from "@/features/community/pages/CommunitiesPage";
import { useParams } from "next/navigation";

export default function Page() {
  const { id } = useParams<{ id: string }>();

  return <CommunitiesPage filters={{ userId: id }} />;
}
