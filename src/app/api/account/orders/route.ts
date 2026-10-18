import { NextResponse } from "next/server";
import { verifySession } from "@/lib/auth/session";
import { adminDb } from "@/lib/firebase/admin";
import { COLLECTIONS } from "@/lib/constants/COLLECTIONS";

export async function GET() {
  const userId = await verifySession();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const snapshot = await adminDb.collection(COLLECTIONS.ORDERS).where("userId", "==", userId).get();
    const orders = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })).sort((a, b) => {
      const aTime = a.createdAt && typeof a.createdAt === "object" && "toMillis" in a.createdAt ? Number((a.createdAt as { toMillis: () => number }).toMillis()) : new Date(a.createdAt as string).getTime();
      const bTime = b.createdAt && typeof b.createdAt === "object" && "toMillis" in b.createdAt ? Number((b.createdAt as { toMillis: () => number }).toMillis()) : new Date(b.createdAt as string).getTime();
      return bTime - aTime;
    });
    return NextResponse.json({ orders });
  } catch (error) {
    console.error("Unable to load customer orders:", error);
    return NextResponse.json({ error: "Unable to load orders." }, { status: 500 });
  }
}
