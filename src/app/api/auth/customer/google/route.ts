import { NextRequest, NextResponse } from "next/server";
import { authRepository } from "@/features/auth/repository/auth.repository";
import { firestoreService } from "@/lib/firebase/admin-firestore";
import { COLLECTIONS } from "@/lib/constants/COLLECTIONS";
import { SESSION_COOKIE_NAME } from "@/lib/auth/session";
import { logger } from "@/lib/logger";
import { APP_ENV } from "@/lib/env";
import { MembershipType } from "@/features/customers/types/users.enums";

const SESSION_MAX_AGE_MS = 1000 * 60 * 60 * 24 * 7; // 7 days

export async function POST(request: NextRequest) {
  try {
    let body: { idToken?: string };
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid request payload" },
        { status: 400 },
      );
    }

    const { idToken } = body;
    if (!idToken || typeof idToken !== "string") {
      return NextResponse.json(
        { error: "Firebase ID token is required" },
        { status: 400 },
      );
    }

    // Authenticate with Google via auth repository
    const authResult = await authRepository.loginWithGoogle(
      idToken,
      SESSION_MAX_AGE_MS,
    );

    const { uid, sessionCookie, email, displayName, photoURL, phoneNumber } =
      authResult;

    // Check if customer profile exists in Firestore
    let existingCustomer = await firestoreService.getDocument<
      Record<string, unknown>
    >(COLLECTIONS.USERS, uid);

    if (!existingCustomer && email) {
      const byEmail = await firestoreService.getDocumentsByField<
        Record<string, unknown>
      >(COLLECTIONS.USERS, "email", email);
      if (byEmail.length > 0) {
        existingCustomer = byEmail[0];
      }
    }

    const now = new Date();

    if (existingCustomer) {
      // Existing customer: preserve profile, update lastLoginAt
      await firestoreService.updateDocument(
        COLLECTIONS.USERS,
        (existingCustomer.id as string) || uid,
        {
          lastLoginAt: now.toISOString(),
          lastActiveAt: now.toISOString(),
          updatedAt: now,
          ...(photoURL && !existingCustomer.profileImageUrl
            ? { profileImageUrl: photoURL }
            : {}),
        },
      );
      logger.info("Existing customer signed in with Google", { uid, email });
    } else {
      // First-time customer: create new customer profile
      await firestoreService.setDocument(COLLECTIONS.USERS, uid, {
        id: uid,
        fullName: displayName || "Customer",
        email: email || "",
        phoneNumber: phoneNumber || "",
        profileImageUrl: photoURL || "",
        membershipType: MembershipType.free,
        isActive: true,
        isExpert: false,
        isDeleted: false,
        dateOfBirth: now,
        gender: "OTHER",
        createdAt: now,
        updatedAt: now,
        lastLoginAt: now.toISOString(),
        lastActiveAt: now.toISOString(),
      });
      logger.info("New customer profile created via Google Sign-In", {
        uid,
        email,
      });
    }

    const customerUser = {
      uid,
      provider: "google.com" as const,
      email: email || undefined,
      displayName: displayName || undefined,
      photoURL: photoURL || undefined,
      phoneNumber: phoneNumber || undefined,
    };

    const response = NextResponse.json({
      user: customerUser,
    });

    response.cookies.set(SESSION_COOKIE_NAME, sessionCookie, {
      httpOnly: true,
      secure: APP_ENV !== "development",
      sameSite: "lax",
      path: "/",
      maxAge: SESSION_MAX_AGE_MS / 1000,
    });

    return response;
  } catch (error) {
    logger.error("Google customer login failed:", {
      error: error instanceof Error ? error.message : String(error),
    });
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to sign in with Google",
      },
      { status: 401 },
    );
  }
}
