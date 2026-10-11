"use client";

import { ResourcesPage } from "@/features/resources";

import { useParams } from "next/navigation";

export default function Page() {
  const { id } = useParams<{ id: string }>();

  return <ResourcesPage filters={{ userId: id }} />;
}
