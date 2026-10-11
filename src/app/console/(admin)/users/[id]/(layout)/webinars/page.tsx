"use client";

import WebinarRegistrationsTable from "@/features/webinars/pages/WebinarRegistrationsPage";
import { useParams } from "next/navigation";

export default function WebinarsPage() {
  const userId = useParams<{ id: string }>().id;

  return <WebinarRegistrationsTable userId={userId} />;
}
