// file path: ~/DEVFOLD/SCRIPT-PITCHER/SRC/LIB/FIREBASE/FIREBASE-CLIENT.JS

"use client";

import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getAuth,
  setPersistence,
  indexedDBLocalPersistence,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getFunctions } from "firebase/functions";
import { firebaseConfig } from "./firebaseConfig";

// --- LAZY INITIALIZATION ---

// Create a function to get the Firebase app, initializing it if necessary.
const getFirebaseApp = () => {
  if (getApps().length === 0) {
    return initializeApp(firebaseConfig);
  } else {
    return getApp();
  }
};

// Export functions that get the service on demand.
// This ensures getFirebaseApp() is only called when a service is needed.

export const getFirebaseAuth = async () => {
  const auth = getAuth(getFirebaseApp());
  // Explicitly set persistence before running any auth operations
  try {
    await setPersistence(auth, indexedDBLocalPersistence);
  } catch (error) {
    console.error("Failed to set Firebase Auth persistence:", error);
  }
  return auth;
};

export const getFirebaseDb = () => {
  return getFirestore(getFirebaseApp());
};

export const getFirebaseStorage = () => {
  return getStorage(getFirebaseApp());
};

export const getFirebaseFunctions = () => {
  return getFunctions(getFirebaseApp(), "europe-west1");
};

// You can also export the app getter if you need it directly
export { getFirebaseApp };
