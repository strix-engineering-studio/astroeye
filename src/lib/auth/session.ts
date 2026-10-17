import { cookies } from "next/headers";
import { adminAuth } from "@/lib/firebase/admin";
import { logger } from "@/lib/logger";

export const SESSION_COOKIE_NAME = "__session";

/**
 * Retrieves the customer session token from the cookie store.
 * @returns The session token string, or null if not found.
 */
export async function getSessionToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(SESSION_COOKIE_NAME)?.value ?? null;
}

/**
 * Verifies the customer session token against Firebase Admin SDK.
 * @returns The customer user ID (UID) if the session is valid, or null otherwise.
 */
export async function verifySession(): Promise<string | null> {
  const token = await getSessionToken();
  if (!token) return null;

  try {
    const decodedToken = await adminAuth.verifySessionCookie(token, true);
    if (!decodedToken?.uid) return null;

    return decodedToken.uid;
  } catch (error) {
    logger.warn(
      "Firebase customer session verification failed:",
      { error: error instanceof Error ? error.message : String(error) },
    );
    return null;
  }
}
