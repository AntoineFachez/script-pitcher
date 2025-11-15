// file path: ~/DEVFOLD/SCRIPT-PITCHER/SRC/LIB/FIREBASE/FIREBASE-CLIENT.JS

"use client";

import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
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

export const getFirebaseAuth = () => {
  return getAuth(getFirebaseApp());
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
