import { NextRequest, NextResponse } from "next/server";
import { authRepository } from "@/features/auth-admin/repository/auth.repository";
import { loginSchema } from "@/features/auth-admin/schemas/auth.schema";
import { logger } from "@/lib/logger";
import { APP_ENV, isDev } from "@/lib/env";
import { ADMIN_SESSION_COOKIE, ADMIN_SESSION_TTL_MS } from "@/lib/admin-auth";

const maskEmail = (email: string) => {
  if (isDev) return email;
  const [name, domain] = email.split("@");
  return `${name.slice(0, 2)}***@${domain}`;
};

const isAuthFailure = (error: unknown) => {
  const msg = error instanceof Error ? error.message : String(error);
  return /INVALID_PASSWORD|EMAIL_NOT_FOUND|INVALID_LOGIN_CREDENTIALS|USER_DISABLED|auth\//i.test(
    msg,
  );
};

export async function POST(request: NextRequest) {
  const requestId = crypto.randomUUID();
  const log = { requestId, appEnv: APP_ENV };

  try {
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ message: "Invalid request" }, { status: 400 });
    }

    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) {
      logger.warn("Admin login validation failed", {
        ...log,
        fields: Object.keys(parsed.error.flatten().fieldErrors),
      });
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 400 },
      );
    }

    const { email, password } = parsed.data;

    // Firebase email/password sign-in
    const { idToken, localId: uid } = await authRepository.login(
      email,
      password,
    );

    // Load admin profile and enforce access BEFORE issuing a cookie
    const user = await authRepository.getUser(uid);

    if (!user.isActive) {
      logger.warn("Admin login blocked: inactive admin", { ...log, uid });
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 401 },
      );
    }

    // Create session cookie
    const sessionCookie = await authRepository.createSession(
      idToken,
      ADMIN_SESSION_TTL_MS,
    );

    const safeUser = { ...user };
    delete (safeUser as { password?: string }).password;

    const response = NextResponse.json(safeUser);

    response.cookies.set(ADMIN_SESSION_COOKIE, sessionCookie, {
      httpOnly: true,
      secure: APP_ENV !== "development",
      sameSite: "lax",
      path: "/",
      maxAge: ADMIN_SESSION_TTL_MS / 1000,
    });

    logger.info("Admin login success", { ...log, uid, email: maskEmail(email) });

    return response;
  } catch (error) {
    const authFailure = isAuthFailure(error);

    const details =
      error instanceof Error
        ? {
            name: error.name,
            message: error.message,
            ...(APP_ENV !== "production" && { stack: error.stack }),
          }
        : { error: String(error) };

    if (authFailure) {
      logger.warn("Admin login failed: bad credentials", { ...log, ...details });
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 401 },
      );
    }

    logger.error("Admin login failed: unexpected error", { ...log, ...details });
    return NextResponse.json(
      { message: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}
