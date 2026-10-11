import { cookies } from "next/headers";
import { adminAuth } from "@/lib/firebase/admin";
import { firestoreService } from "@/lib/firebase/admin-firestore";

export const SESSION_COOKIE_NAME = "__session";

/**
 * Retrieves the session token from the cookie store.
 * @returns The session token string, or null if not found.
 */
export async function getSessionToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(SESSION_COOKIE_NAME)?.value ?? null;
}
/**
 * Verifies the session token against Firebase Admin SDK.
 * @returns The user's UID if the session is valid, or null otherwise.
 */
export async function verifySession(): Promise<string | null> {
  const token = await getSessionToken();
  if (!token) return null;

  try {
    // Assuming adminAuth.verifySessionCookie returns a structure containing the user ID (UID)
    const decodedToken = await adminAuth.verifySessionCookie(token, true);
    if (!decodedToken?.uid) return null;

    // A valid Firebase session must also belong to an active admin profile.
    return (await firestoreService.isActive(decodedToken.uid))
      ? decodedToken.uid
      : null;
  } catch (error) {
    console.warn(
      "Firebase session verification failed:",
      error instanceof Error ? error.message : String(error),
    );
    // Log the failure but return null to allow graceful fallback
    return null;
  }
}
