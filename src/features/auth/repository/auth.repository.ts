
import { adminAuth } from "@/lib/firebase/admin";
import { firestoreService } from "@/lib/firebase/admin-firestore";
import { COLLECTIONS } from "@/lib/constants/COLLECTIONS";
import type { IAdminUser } from "@/features/admins/types/admins.types";
import { logger } from "@/lib/logger";

const FIREBASE_AUTH_ENDPOINT =
  "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword";

const DEFAULT_SESSION_EXPIRY = 5 * 24 * 60 * 60 * 1000;
const MIN_SESSION_EXPIRY = 5 * 60 * 1000;
const MAX_SESSION_EXPIRY = 14 * 24 * 60 * 60 * 1000;

type CustomerProvider = "google.com" | "phone";

interface FirebaseLoginResponse {
  idToken: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  email?: string;
  registered?: boolean;
}

interface FirebaseAuthErrorResponse {
  error?: {
    code?: number;
    message?: string;
  };
}

interface CustomerAuthResult {
  uid: string;
  sessionCookie: string;
  provider: CustomerProvider;
  phoneNumber?: string;
  email?: string;
  displayName?: string;
  photoURL?: string;
}

function isFirebaseAuthErrorResponse(
  value: unknown,
): value is FirebaseAuthErrorResponse {
  return typeof value === "object" && value !== null && "error" in value;
}

function isFirebaseLoginResponse(
  value: unknown,
): value is FirebaseLoginResponse {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const data = value as Record<string, unknown>;

  return (
    typeof data.idToken === "string" &&
    data.idToken.length > 0 &&
    typeof data.refreshToken === "string" &&
    typeof data.expiresIn === "string" &&
    typeof data.localId === "string"
  );
}

function validateSessionExpiry(expiresIn: number): void {
  if (
    !Number.isSafeInteger(expiresIn) ||
    expiresIn < MIN_SESSION_EXPIRY ||
    expiresIn > MAX_SESSION_EXPIRY
  ) {
    throw new Error(
      "Session expiry must be between 5 minutes and 14 days",
    );
  }
}

class AuthRepository {
  // --------------------------------------------------
  // ADMIN AUTHENTICATION: EMAIL AND PASSWORD ONLY
  // --------------------------------------------------

  async login(
    email: string,
    password: string,
  ): Promise<FirebaseLoginResponse> {
    try {
      const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;

      if (!apiKey) {
        throw new Error("Firebase API key is not configured");
      }

      logger.info("Attempting admin email login");

      const response = await fetch(
        `${FIREBASE_AUTH_ENDPOINT}?key=${encodeURIComponent(apiKey)}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email.trim(),
            password,
            returnSecureToken: true,
          }),
        },
      );

      const data: unknown = await response.json();

      if (!response.ok) {
        const message = isFirebaseAuthErrorResponse(data)
          ? data.error?.message ?? "UNKNOWN_FIREBASE_AUTH_ERROR"
          : "UNKNOWN_FIREBASE_AUTH_ERROR";

        switch (message) {
          case "INVALID_LOGIN_CREDENTIALS":
          case "INVALID_PASSWORD":
          case "EMAIL_NOT_FOUND":
            throw new Error("Invalid email or password");

          case "USER_DISABLED":
            throw new Error("This account has been disabled");

          case "OPERATION_NOT_ALLOWED":
            throw new Error(
              "Email/password authentication is disabled",
            );

          case "TOO_MANY_ATTEMPTS_TRY_LATER":
            throw new Error(
              "Too many login attempts. Please try again later",
            );

          case "INVALID_EMAIL":
            throw new Error("Invalid email address");

          default:
            throw new Error(
              `Admin authentication failed: ${message}`,
            );
        }
      }

      if (!isFirebaseLoginResponse(data)) {
        throw new Error("Invalid Firebase login response");
      }

      // IMPORTANT:
      // The admin API route must verify the ID token,
      // fetch the matching ADMIN_USERS document, and ensure
      // user.isActive === true before issuing an admin session.

      logger.info("Admin email authentication successful");

      return data;
    } catch (error) {
      logger.error("Admin email login failed", { error });
      throw error;
    }
  }

  // --------------------------------------------------
  // CUSTOMER SIGNUP / LOGIN: GOOGLE
  // --------------------------------------------------

  async loginWithGoogle(
    idToken: string,
    expiresIn = DEFAULT_SESSION_EXPIRY,
  ): Promise<CustomerAuthResult> {
    return this.authenticateCustomer(
      idToken,
      "google.com",
      expiresIn,
    );
  }

  // --------------------------------------------------
  // CUSTOMER SIGNUP / LOGIN: PHONE OTP
  // --------------------------------------------------

  async loginWithPhoneNumber(
    idToken: string,
    expiresIn = DEFAULT_SESSION_EXPIRY,
  ): Promise<CustomerAuthResult> {
    return this.authenticateCustomer(
      idToken,
      "phone",
      expiresIn,
    );
  }

  // --------------------------------------------------
  // SHARED CUSTOMER AUTHENTICATION
  // --------------------------------------------------

  private async authenticateCustomer(
    idToken: string,
    expectedProvider: CustomerProvider,
    expiresIn: number,
  ): Promise<CustomerAuthResult> {
    try {
      if (!idToken || typeof idToken !== "string") {
        throw new Error("Firebase ID token is required");
      }

      validateSessionExpiry(expiresIn);

      // Verify the token's signature, issuer, audience and revocation.
      const decodedToken = await adminAuth.verifyIdToken(
        idToken,
        true,
      );

      const uid = decodedToken.uid;

      // Retrieve the trusted Firebase user record.
      const firebaseUser = await adminAuth.getUser(uid);

      if (firebaseUser.disabled) {
        throw new Error("This account has been disabled");
      }

      // Ensure the expected authentication provider is linked.
      const hasExpectedProvider = firebaseUser.providerData.some(
        (provider) => provider.providerId === expectedProvider,
      );

      if (!hasExpectedProvider) {
        throw new Error(
          `Authentication with ${expectedProvider} is not allowed`,
        );
      }

      // Customer authentication does not query ADMIN_USERS.
      const sessionCookie = await this.createSession(
        idToken,
        expiresIn,
      );

      logger.info("Customer authentication successful", {
        uid,
        provider: expectedProvider,
      });

      return {
        uid,
        sessionCookie,
        provider: expectedProvider,
        ...(firebaseUser.phoneNumber
          ? { phoneNumber: firebaseUser.phoneNumber }
          : {}),
        ...(firebaseUser.email
          ? { email: firebaseUser.email }
          : {}),
        ...(firebaseUser.displayName
          ? { displayName: firebaseUser.displayName }
          : {}),
        ...(firebaseUser.photoURL
          ? { photoURL: firebaseUser.photoURL }
          : {}),
      };
    } catch (error) {
      logger.error("Customer authentication failed", {
        provider: expectedProvider,
        error:
          error instanceof Error
            ? {
                name: error.name,
                message: error.message,
              }
            : error,
      });

      throw error;
    }
  }

  // --------------------------------------------------
  // SESSION MANAGEMENT
  // --------------------------------------------------

  async createSession(
    idToken: string,
    expiresIn = DEFAULT_SESSION_EXPIRY,
  ): Promise<string> {
    try {
      validateSessionExpiry(expiresIn);

      await adminAuth.verifyIdToken(idToken, true);

      return await adminAuth.createSessionCookie(idToken, {
        expiresIn,
      });
    } catch (error) {
      logger.error("Session creation failed", { error });
      throw error;
    }
  }

  async verifySession(sessionCookie: string) {
    try {
      return await adminAuth.verifySessionCookie(
        sessionCookie,
        true,
      );
    } catch (error) {
      logger.error("Session verification failed", { error });
      throw error;
    }
  }

  async verifyIdToken(idToken: string) {
    try {
      return await adminAuth.verifyIdToken(idToken, true);
    } catch (error) {
      logger.error("ID token verification failed", { error });
      throw error;
    }
  }

  // --------------------------------------------------
  // ADMIN PROFILE
  // --------------------------------------------------

  async getUser(uid: string): Promise<IAdminUser> {
    try {
      const user = await firestoreService.getDocument<IAdminUser>(
        COLLECTIONS.ADMIN_USERS,
        uid,
      );

      if (!user) {
        throw new Error("Admin account not found");
      }

      if (!user.isActive) {
        throw new Error("Admin account is inactive");
      }

      return user;
    } catch (error) {
      logger.error("Admin profile lookup failed", {
        uid,
        error,
      });

      throw error;
    }
  }

  // --------------------------------------------------
  // LOGOUT
  // --------------------------------------------------

  async logout(uid: string): Promise<void> {
    try {
      await adminAuth.revokeRefreshTokens(uid);

      logger.info("Firebase refresh tokens revoked", { uid });
    } catch (error) {
      logger.error("Logout failed", { uid, error });
      throw error;
    }
  }
}

export const authRepository = new AuthRepository();
