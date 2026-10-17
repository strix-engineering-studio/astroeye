import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { authRepository } from "@/features/auth-admin/repository/auth.repository";
import { ADMIN_SESSION_COOKIE } from "@/lib/admin-auth";

export async function GET() {
  try {
    const cookieStore = await cookies();

    const sessionCookie = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;

    if (!sessionCookie) {
      return NextResponse.json(null, { status: 401 });
    }

    const decoded = await authRepository.verifySession(sessionCookie);
    if (!decoded?.uid) {
      return NextResponse.json(null, { status: 401 });
    }

    const user = await authRepository.getUser(decoded.uid);

    const safeUser = { ...user };
    delete (safeUser as { password?: string }).password;

    return NextResponse.json(safeUser);
  } catch {
    return NextResponse.json(null, { status: 401 });
  }
}
