import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { authRepository } from "@/features/auth-admin/repository/auth.repository";

export const ADMIN_SESSION_COOKIE = "strix_admin_session";

export const ADMIN_SESSION_TTL_MS = 1000 * 60 * 60 * 12;

export interface AdminSession {
  uid: string;
  email: string;
  expiresAt: number;
}

export async function getAdminSession(): Promise<AdminSession | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;

  if (!sessionCookie) {
    return null;
  }

  try {
    // Verify the Firebase session and check whether it has been revoked.
    const decodedClaims =
      await authRepository.verifySession(sessionCookie);

    if (!decodedClaims.uid || !decodedClaims.email) {
      return null;
    }

    // Verify that this Firebase account is an active admin.
    await authRepository.getUser(decodedClaims.uid);

    return {
      uid: decodedClaims.uid,
      email: decodedClaims.email,
      expiresAt: decodedClaims.exp * 1000,
    };
  } catch {
    // Invalid, expired, revoked, or unauthorized sessions are rejected.
    return null;
  }
}

export async function setAdminSessionCookie(
  sessionCookie: string,
): Promise<void> {
  const cookieStore = await cookies();

  cookieStore.set(ADMIN_SESSION_COOKIE, sessionCookie, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: ADMIN_SESSION_TTL_MS / 1000,
  });
}

export async function clearAdminSessionCookie(): Promise<void> {
  const cookieStore = await cookies();

  cookieStore.set(ADMIN_SESSION_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}

export async function requireAdminSession(): Promise<AdminSession> {
  const session = await getAdminSession();

  if (!session) {
    redirect("/console/login");
  }

  return session;
}