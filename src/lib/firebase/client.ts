import { getApp, getApps, initializeApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";

import { logger } from "../logger";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

/**
 * Checks whether a Firebase configuration value is actually configured.
 */
function isConfigured(value?: string): boolean {
  if (!value) {
    return false;
  }

  return value !== "xxxxx" && !value.includes("PLACEHOLDER");
}

logger.info("[Firebase] Config check:", {
  apiKeyPresent: isConfigured(firebaseConfig.apiKey),
  authDomain: firebaseConfig.authDomain,
  projectId: firebaseConfig.projectId,
  storageBucket: firebaseConfig.storageBucket,
  messagingSenderIdPresent: isConfigured(firebaseConfig.messagingSenderId),
  appIdPresent: isConfigured(firebaseConfig.appId),
});

export const isMockMode = !isConfigured(firebaseConfig.apiKey);

logger.info("[Firebase] Mode:", {
  isMockMode,
  existingApps: getApps().length,
});

let clientApp: FirebaseApp | null = null;
let clientAuth: Auth | null = null;

if (!isMockMode) {
  try {
    clientApp = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

    logger.info("[Firebase] App initialized:", {
      initialized: true,
      appName: clientApp.name,
      projectId: clientApp.options.projectId,
      storageBucket: clientApp.options.storageBucket,
    });

    try {
      clientAuth = getAuth(clientApp);

      logger.info("[Firebase] Auth initialized:", {
        initialized: true,
      });
    } catch (error) {
      logger.error("[Firebase] Auth initialization failed:", {
        error: error instanceof Error ? error.message : String(error),
      });

      clientAuth = null;
    }
  } catch (error) {
    logger.error("[Firebase] App initialization failed:", {
      error: error instanceof Error ? error.message : String(error),
      projectId: firebaseConfig.projectId,
    });

    clientApp = null;
    clientAuth = null;
  }
}

export { clientApp, clientAuth };
