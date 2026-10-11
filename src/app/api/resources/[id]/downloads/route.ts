import { NextResponse } from "next/server";

import { resourcesRepository } from "@/features/resources/repository/resources.repository";
import { verifySession } from "@/lib/auth/session";
import { adminDb } from "@/lib/firebase/admin";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const userId = await verifySession();
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const resource = await resourcesRepository.findById(id);
  if (!resource)
    return NextResponse.json({ error: "Resource not found" }, { status: 404 });

  if (resource.isPremium) {
    const purchase = await adminDb
      .collection("resource_purchases")
      .where("resourceId", "==", id)
      .where("userId", "==", userId)
      .where("status", "in", ["PAID", "CAPTURED", "COMPLETED"])
      .limit(1)
      .get();
    if (purchase.empty)
      return NextResponse.json({ error: "Purchase required" }, { status: 403 });
  }

  const updated = await resourcesRepository.incrementDownloads(id);
  return NextResponse.json(updated);
}
