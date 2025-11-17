// file path: ~/DEVFOLD/SCRIPT-PITCHER/SRC/LIB/FIREBASE/FIREBASE-ADMIN.JS

import admin from "firebase-admin";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";

const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
const serviceAccount = serviceAccountKey ? JSON.parse(serviceAccountKey) : null;

const getAdminApp = () => {
  // Use a name for the app to avoid conflicts
  const appName = "script-pitcher-admin";
  const existingApp = admin.apps.find((app) => app.name === appName);

  if (existingApp) {
    return existingApp;
  }

  // If service account is available, use it. Otherwise, rely on Application Default Credentials.
  const credential = serviceAccount
    ? admin.credential.cert(serviceAccount)
    : admin.credential.applicationDefault();

  return admin.initializeApp(
    {
      credential,
    },
    appName
  );
};

const adminApp = getAdminApp();

export const auth = getAuth(adminApp);
export const db = getFirestore(adminApp);
export const storage = getStorage(adminApp);

export const getAdminServices = () => ({
  auth,
  db,
  storage,
});
