import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { authRepository } from "@/features/auth-admin/repository/auth.repository";
import { ADMIN_SESSION_COOKIE } from "@/lib/admin-auth";

export async function POST() {
  try {
    const cookieStore = await cookies();

    const sessionCookie = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;

    if (sessionCookie) {
      try {
        const decoded = await authRepository.verifySession(sessionCookie);
        if (decoded?.uid) {
          await authRepository.logout(decoded.uid);
        }
      } catch {
        // Continue to clear cookie even if token verification fails
      }
    }

    const response = NextResponse.json({ success: true });

    response.cookies.delete(ADMIN_SESSION_COOKIE);

    return response;
  } catch {
    const response = NextResponse.json({ success: true });

    response.cookies.delete(ADMIN_SESSION_COOKIE);

    return response;
  }
}
