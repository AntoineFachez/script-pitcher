// file path: ~/DEVFOLD/SCRIPT-PITCHER/SRC/LIB/FIREBASE/FIREBASE-ADMIN.JS

import {
  initializeApp,
  getApps,
  getApp,
  cert,
  applicationDefault, // <-- IMPORTANT: Added to support Cloud Run/ADC
} from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";

let app;
// 1. Define a unique, non-default name for the Admin app
const ADMIN_APP_NAME = "scriptPitcherAdmin";

// 2. Check for the NAMED app instance instead of the default [DEFAULT] instance
if (getApps().some((a) => a.name === ADMIN_APP_NAME)) {
  // App already exists (on the current serverless instance), retrieve it
  app = getApp(ADMIN_APP_NAME);
} else {
  let appConfig = {};
  const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

  if (serviceAccountKey) {
    try {
      const serviceAccount = JSON.parse(serviceAccountKey);
      appConfig.credential = cert(serviceAccount);
    } catch (e) {
      console.warn(
        "Failed to parse FIREBASE_SERVICE_ACCOUNT_KEY JSON. Falling back to Application Default Credentials.",
        e
      );
      // If parsing fails, use Application Default Credentials (ADC)
      appConfig.credential = applicationDefault();
    }
  } else {
    // If no key is set, explicitly use the secure Application Default Credentials (ADC)
    appConfig.credential = applicationDefault();
  }

  // 3. Initialize the app with the specific name
  app = initializeApp(appConfig, ADMIN_APP_NAME);
}

// Export the initialized services using the 'app' instance
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

export function getAdminServices() {
  return { db, auth, storage };
}
