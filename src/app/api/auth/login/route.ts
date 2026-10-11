import { NextRequest, NextResponse } from "next/server";
import { authRepository } from "@/features/auth/repository/auth.repository";
import { SESSION_COOKIE_NAME } from "@/lib/auth/session";
import { loginSchema } from "@/features/auth/schemas/auth.schema";
import { logger } from "@/lib/logger";
import { APP_ENV, isDev } from "@/lib/env";

const SESSION_MAX_AGE_MS = 1000 * 60 * 60 * 24 * 7; // 7 days (Firebase max is 14)

const maskEmail = (email: string) => {
  if (isDev) return email;
  const [name, domain] = email.split("@");
  return `${name.slice(0, 2)}***@${domain}`;
};

// Map your repository's auth failures here; anything else is a server error.
// Firebase REST login errors usually contain codes like INVALID_PASSWORD,
// EMAIL_NOT_FOUND, INVALID_LOGIN_CREDENTIALS, USER_DISABLED.
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
    // 1. Parse + validate
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ message: "Invalid request" }, { status: 400 });
    }

    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) {
      logger.warn("Login validation failed", {
        ...log,
        fields: Object.keys(parsed.error.flatten().fieldErrors),
      });
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 400 },
      );
    }

    const { email, password } = parsed.data;

    // 2. Firebase email/password sign-in
    const { idToken, localId: uid } = await authRepository.login(
      email,
      password,
    );

    // 3. Load admin profile and enforce access BEFORE issuing a cookie
    const user = await authRepository.getUser(uid);

    if (!user.isActive) {
      logger.warn("Login blocked: inactive admin", { ...log, uid });
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 401 },
      );
    }

    // 4. Create session cookie
    const sessionCookie = await authRepository.createSession(
      idToken,
      SESSION_MAX_AGE_MS,
    );

    const response = NextResponse.json(user);

    response.cookies.set(SESSION_COOKIE_NAME, sessionCookie, {
      httpOnly: true,
      secure: APP_ENV !== "development",
      sameSite: "lax",
      path: "/",
      maxAge: SESSION_MAX_AGE_MS / 1000,
    });

    logger.info("Login success", { ...log, uid, email: maskEmail(email) });

    return response;
  } catch (error) {
    const authFailure = isAuthFailure(error);

    const details =
      error instanceof Error
        ? {
            name: error.name,
            message: error.message,
            // stacks only outside production
            ...(APP_ENV !== "production" && { stack: error.stack }),
          }
        : { error: String(error) };

    if (authFailure) {
      logger.warn("Login failed: bad credentials", { ...log, ...details });
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 401 },
      );
    }

    logger.error("Login failed: unexpected error", { ...log, ...details });
    return NextResponse.json(
      { message: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}
