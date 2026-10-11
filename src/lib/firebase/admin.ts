import "server-only";

import {
  applicationDefault,
  cert,
  getApps,
  initializeApp,
  type App,
} from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { logger } from "../logger";

/**
 * Checks if a given environment variable value is configured and not placeholder.
 */
function isConfigured(value?: string): boolean {
  return Boolean(value) && !["xxxxx", "PLACEHOLDER"].includes(value || "");
}

/**
 * Retrieves the service account credentials from environment variables.
 * @returns An object containing necessary credentials, or null if incomplete.
 */
function getServiceAccount() {
  const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY;
  if (!isConfigured(projectId) || !isConfigured(clientEmail) || !privateKey) {
    return null;
  }

  // Note: The original code structure assumes the private key is available and correctly formatted.
  return {
    projectId,
    clientEmail,
    privateKey: privateKey.replace(/\\n/g, "\n"),
  };
}

const serviceAccount = getServiceAccount();
const projectId =
  process.env.FIREBASE_ADMIN_PROJECT_ID ||
  process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

let adminApp: App;
try {
  logger.info("Initializing Firebase Admin SDK...");
  adminApp =
    getApps()[0] ??
    initializeApp({
      credential: serviceAccount ? cert(serviceAccount) : applicationDefault(),
      projectId,
    });
  logger.info("Firebase Admin SDK initialized successfully.");
} catch (e) {
  logger.error("FATAL ERROR: Failed to initialize Firebase Admin SDK.", e);
  // Exit or handle failure gracefully if initialization is critical
  throw new Error("Firebase Admin Initialization Failure");
}

export const adminAuth = getAuth(adminApp);
export const adminDb = getFirestore(adminApp);
