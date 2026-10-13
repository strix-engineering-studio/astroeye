import { adminAuth } from "@/lib/firebase/admin";
import { firestoreService } from "@/lib/firebase/admin-firestore";
import { COLLECTIONS } from "@/lib/constants/COLLECTIONS";
import type { IAdminUser } from "@/features/admins/types/admins.types";
import { logger } from "@/lib/logger";

const FIREBASE_AUTH_ENDPOINT =
  "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword";

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
    errors?: Array<{
      message?: string;
      domain?: string;
      reason?: string;
    }>;
  };
}

function isFirebaseAuthErrorResponse(
  value: unknown,
): value is FirebaseAuthErrorResponse {
  return typeof value === "object" && value !== null && "error" in value;
}

function isFirebaseLoginResponse(
  value: unknown,
): value is FirebaseLoginResponse {
  return (
    typeof value === "object" &&
    value !== null &&
    "idToken" in value &&
    typeof value.idToken === "string" &&
    value.idToken.length > 0 &&
    "refreshToken" in value &&
    typeof value.refreshToken === "string" &&
    "expiresIn" in value &&
    typeof value.expiresIn === "string" &&
    "localId" in value &&
    typeof value.localId === "string"
  );
}

class AuthRepository {
  /**
   * Authenticate email/password using Firebase Auth REST API.
   *
   * Returns a Firebase ID token and refresh token.
   */
  async login(email: string, password: string): Promise<FirebaseLoginResponse> {
    try {
      logger.info("Attempting Firebase email/password login", {
        email,
      });

      const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
      if (!apiKey) {
        throw new Error("NEXT_PUBLIC_FIREBASE_API_KEY is not configured");
      }

      const response = await fetch(`${FIREBASE_AUTH_ENDPOINT}?key=${apiKey}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
          password,
          returnSecureToken: true,
        }),
      });

      const data: unknown = await response.json();

      if (!response.ok) {
        const firebaseError = isFirebaseAuthErrorResponse(data)
          ? data.error
          : undefined;

        const firebaseMessage =
          firebaseError?.message ?? "UNKNOWN_FIREBASE_AUTH_ERROR";

        logger.warn("Firebase email/password login failed", {
          email,
          status: response.status,
          firebaseMessage,
        });

        switch (firebaseMessage) {
          case "INVALID_LOGIN_CREDENTIALS":
          case "INVALID_PASSWORD":
          case "EMAIL_NOT_FOUND":
            throw new Error("Invalid email or password");

          case "USER_DISABLED":
            throw new Error("This account has been disabled");

          case "OPERATION_NOT_ALLOWED":
            throw new Error(
              "Email/password authentication is disabled for this Firebase project",
            );

          case "TOO_MANY_ATTEMPTS_TRY_LATER":
            throw new Error("Too many login attempts. Please try again later");

          case "INVALID_EMAIL":
            throw new Error("Invalid email address");

          default:
            throw new Error(
              `Firebase authentication failed: ${firebaseMessage}`,
            );
        }
      }

      if (!isFirebaseLoginResponse(data)) {
        throw new Error(
          "Firebase login succeeded but no ID token was returned",
        );
      }

      logger.info("Firebase email/password login successful", {
        email,
        uid: data.localId,
      });

      return data;
    } catch (error) {
      logger.error("Error logging in with email", {
        email,
        error,
      });

      throw error;
    }
  }

  /**
   * Create Firebase session cookie from a Firebase ID token.
   *
   * expiresIn must be milliseconds.
   * Firebase allows session cookies between 5 minutes
   * and 2 weeks.
   */
  async createSession(idToken: string, expiresIn: number): Promise<string> {
    try {
      logger.info("Creating Firebase session cookie");

      logger.info("Firebase Admin configuration", {
        projectId: adminAuth.app.options.projectId,
        appName: adminAuth.app.name,
      });

      const decodedToken = await adminAuth.verifyIdToken(idToken);

      logger.info("Firebase ID token verified successfully", {
        uid: decodedToken.uid,
        issuer: decodedToken.iss,
        audience: decodedToken.aud,
      });

      const sessionCookie = await adminAuth.createSessionCookie(idToken, {
        expiresIn,
      });

      logger.info("Firebase session cookie created successfully", {
        uid: decodedToken.uid,
      });

      return sessionCookie;
    } catch (error) {
      logger.error("Error creating Firebase session cookie", {
        error:
          error instanceof Error
            ? {
                name: error.name,
                message: error.message,
                stack: error.stack,
              }
            : error,
      });

      throw error;
    }
  }

  /**
   * Verify Firebase session cookie.
   */
  async verifySession(sessionCookie: string) {
    try {
      logger.info("Verifying Firebase session cookie");

      const decodedClaims = await adminAuth.verifySessionCookie(
        sessionCookie,
        true,
      );

      logger.debug("Firebase session cookie verified", {
        uid: decodedClaims.uid,
      });

      return decodedClaims;
    } catch (error) {
      logger.error("Error verifying Firebase session cookie", {
        error,
      });

      throw error;
    }
  }

  /**
   * Verify Firebase ID token.
   */
  async verifyIdToken(idToken: string) {
    try {
      logger.info("Verifying Firebase ID token");

      const decodedToken = await adminAuth.verifyIdToken(idToken, true);

      logger.debug("Firebase ID token verified", {
        uid: decodedToken.uid,
      });

      return decodedToken;
    } catch (error) {
      logger.error("Error verifying Firebase ID token", {
        error,
      });

      throw error;
    }
  }

  /**
   * Get active admin profile associated with Firebase UID.
   */
  async getUser(uid: string): Promise<IAdminUser> {
    try {
      logger.info("Fetching admin user", {
        uid,
      });

      const user = await firestoreService.getDocument<IAdminUser>(
        COLLECTIONS.ADMIN_USERS,
        uid,
      );

      if (!user) {
        logger.warn("Admin user not found", {
          uid,
        });

        throw new Error("Admin account not found");
      }

      if (!user.isActive) {
        logger.warn("Admin account is inactive", {
          uid,
        });

        throw new Error("Admin account is inactive");
      }

      return user;
    } catch (error) {
      logger.error("Error fetching admin user", {
        uid,
        error,
      });

      throw error;
    }
  }

  /**
   * Logout user by revoking Firebase refresh tokens.
   */
  async logout(uid: string): Promise<void> {
    try {
      logger.info("Logging out Firebase user", {
        uid,
      });

      await adminAuth.revokeRefreshTokens(uid);

      logger.info("Firebase refresh tokens revoked", {
        uid,
      });
    } catch (error) {
      logger.error("Error logging out Firebase user", {
        uid,
        error,
      });

      throw error;
    }
  }
}

export const authRepository = new AuthRepository();
