"use client";

import PostsPage from "@/features/feed/pages/PostsPage";

import { useParams } from "next/navigation";

export default function Page() {
  const { id } = useParams<{ id: string }>();

  return <PostsPage filters={{ userId: id }} />;
}
