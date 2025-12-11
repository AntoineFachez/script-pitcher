// file path: ~/DEVFOLD/SCRIPT-PITCHER/SRC/LIB/AUTH/AUTH.JS

import { cookies } from "next/headers";
import { getAdminServices } from "@/lib/firebase/firebase-admin";

// 🟢 FINAL CLEANUP: REMOVE all NextAuth imports (NextAuth, getServerSession, etc.)

// The intended cookie name for Firebase Admin Sessions
const SESSION_COOKIE_NAME = "__session";

// 🟢 getCurrentUser: Reads and verifies a simple Firebase session cookie
export async function getCurrentUser() {
  // 1. Read the correct session cookie name
  const sessionCookie = (await cookies()).get(SESSION_COOKIE_NAME)?.value;

  if (!sessionCookie) {
    // console.log("[getCurrentUser] Session cookie not found. User is logged out.");
    return null;
  }

  try {
    const { auth, db } = getAdminServices();

    // 2. Verify the session cookie with Firebase Admin SDK
    const decodedToken = await auth.verifySessionCookie(sessionCookie, true);
    const userId = decodedToken.uid;

    // 3. Fetch User Data
    const userDocSnap = await db.doc(`users/${userId}`).get();

    if (userDocSnap.exists) {
      const userData = userDocSnap.data();
      // console.log(
      //   "[getCurrentUser] ✅ Firebase Session verified for user.id:",
      //   userId
      // );

      return {
        uid: userId,
        name:
          userData.displayName || userData.name || decodedToken.name || null,
        email: userData.email || decodedToken.email,
        ...userData,
      };
    } else {
      console.warn(`[getCurrentUser] WARN: User ${userId} not found in DB.`);
      return null;
    }
  } catch (error) {
    console.error(
      "[getCurrentUser] Firebase Session verification failed:",
      error.message
    );

    // Clear the invalid cookie
    cookies().set(SESSION_COOKIE_NAME, "", { maxAge: 0, path: "/" });

    return null;
  }
}
