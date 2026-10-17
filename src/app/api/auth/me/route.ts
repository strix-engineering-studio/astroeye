import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { authRepository } from "@/features/auth/repository/auth.repository";
import { firestoreService } from "@/lib/firebase/admin-firestore";
import { COLLECTIONS } from "@/lib/constants/COLLECTIONS";
import { SESSION_COOKIE_NAME } from "@/lib/auth/session";

export async function GET() {
  try {
    const cookieStore = await cookies();

    const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME)?.value;

    if (!sessionCookie) {
      return NextResponse.json(null, { status: 401 });
    }

    const decoded = await authRepository.verifySession(sessionCookie);
    if (!decoded?.uid) {
      return NextResponse.json(null, { status: 401 });
    }

    // Retrieve the customer profile from the authoritative USERS collection
    const customer = await firestoreService.getDocument<Record<string, unknown>>(
      COLLECTIONS.USERS,
      decoded.uid,
    );

    if (customer) {
      return NextResponse.json({
        uid: decoded.uid,
        id: customer.id || decoded.uid,
        fullName: customer.fullName || customer.displayName || "Customer",
        email: customer.email || decoded.email,
        phoneNumber: customer.phoneNumber || decoded.phone_number,
        profileImageUrl: customer.profileImageUrl || customer.photoURL,
        membershipType: customer.membershipType || "FREE",
        isActive: customer.isActive ?? true,
        createdAt: customer.createdAt,
      });
    }

    // Fallback to decoded token data if profile is still syncing
    return NextResponse.json({
      uid: decoded.uid,
      id: decoded.uid,
      email: decoded.email,
      phoneNumber: decoded.phone_number,
    });
  } catch {
    return NextResponse.json(null, { status: 401 });
  }
}
