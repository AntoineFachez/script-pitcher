// file path: ~/DEVFOLD/SCRIPT-PITCHER/SRC/LIB/AUTH.JS
// This is the server-side utility file.

import { getServerSession } from "next-auth";
import { authOptions } from "./authOptions"; // 👈 Import the config
import { jwtVerify } from "jose";
import { TextEncoder } from "util"; // Use 'util' for server environments if needed, or rely on global
import { headers } from "next/headers"; // Next.js utility for Server Components
/**
 * Retrieves the authenticated user's session data from NextAuth on the server.
 * @returns {Promise<{ uid: string, name: string, email: string, ... } | null>}
 */

const NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET; // Read secret here

export async function getCurrentUser() {
  // 1. Get the session using the imported config
  // ⚠️ TEMPORARY DEBUGGING ⚠️
  // Log request headers to ensure the cookie is present before getServerSession runs.
  const reqHeaders = headers();
  const cookieHeader = reqHeaders.get("cookie");
  // console.log("Request Cookie Header:", reqHeaders.get("cookie"));
  // ⚠️ END DEBUGGING ⚠️

  // ⚠️ DANGEROUS DEBUG: MANUALLY CHECK THE TOKEN ⚠️
  if (cookieHeader && NEXTAUTH_SECRET) {
    const tokenMatch = cookieHeader.match(/next-auth\.session-token=([^;]+)/);
    if (tokenMatch) {
      const sessionToken = tokenMatch[1];
      try {
        // Attempt to verify the token manually using the SECRET
        const { payload } = await jwtVerify(
          sessionToken,
          new TextEncoder().encode(NEXTAUTH_SECRET)
        );
        // console.log("DEBUG: Manually Verified Payload:", payload); // ⭐️ Check this log
      } catch (e) {
        console.error("DEBUG: Token Verification Failed (Manual):", e.message); // ⭐️ This is the error message you need!
      }
    }
  }
  // ⚠️ END DANGEROUS DEBUG ⚠️

  // 1. Get the session using the imported config
  const session = await getServerSession(authOptions);
  // console.log("NextAuth Session:", session);

  // Check for session and the necessary user ID
  if (!session || !session.user || !session.user.id) {
    return null;
  }

  // 2. Extract user data directly from the session (populated by the JWT callback)
  // The 'session' object on the server will contain the properties added in the 'session' callback.
  const profileData = session.user.profileData || {};

  // 3. Return a consolidated user object
  return {
    uid: session.user.id, // The user's Firestore document ID
    name: session.user.name,
    email: session.user.email,
    ...profileData, // Include all other profile data retrieved from Firestore
  };

  // ❌ REMOVED: All Firestore fetching logic
}
