"use client";
import ResourceDetailsPage from "@/features/resources/pages/ResourceDetailsPage";

import { useParams, useRouter } from "next/navigation";

import { useResourceQuery } from "@/features/resources";
import { useDeleteResourceMutation } from "@/features/resources";

export default function Page() {
  const { id } = useParams<{ id: string }>();

  const router = useRouter();

  const { data, isLoading } = useResourceQuery(id);
  const { mutate: deleteResource } = useDeleteResourceMutation();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!data) {
    return <div>Resource not found.</div>;
  }
  return <ResourceDetailsPage />;
}
