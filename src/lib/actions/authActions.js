// file path: ~/DEVFOLD/SCRIPT-PITCHER/SRC/LIB/ACTIONS/AUTHACTIONS.JS
// This file requires the Firebase Admin SDK to be initialized on your server/environment.

"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/authOptions";
// Assume you have initialized the Firebase Admin SDK globally or here
import { auth } from "@/lib/firebase/firebase-admin"; // Custom utility

/**
 * Generates a Firebase Custom Token for the logged-in NextAuth user.
 * @returns {Promise<{token: string | null}>}
 */
export async function createFirebaseCustomToken() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || !session.user.id) {
    return { token: null, error: "Not authenticated" };
  }

  try {
    const customToken = await auth.createCustomToken(session.user.id);
    return { token: customToken };
  } catch (error) {
    console.error("Error minting custom token:", error);
    return { token: null, error: "Failed to create Firebase token." };
  }
}
