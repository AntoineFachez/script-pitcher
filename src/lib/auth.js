// file path: ~/DEVFOLD/SCRIPT-PITCHER/SRC/LIB/AUTH.JS
// This is the server-side utility file.

import { getServerSession } from "next-auth";
import { headers } from "next/headers"; // Next.js utility for Server Components
import { authOptions } from "./authOptions"; // 👈 Import the NextAuth config

/**
 * Retrieves the authenticated user's session data from NextAuth on the server.
 * Returns null if the user is unauthenticated or the session is invalid.
 *
 * @returns {Promise<{ uid: string, name: string, email: string, ... } | null>}
 */
export async function getCurrentUser() {
  // 1. Next.js utility to ensure headers() is called before getServerSession runs
  //    (This is often needed to correctly trigger Server Component behavior).
  headers();

  // 2. Get the session using the imported config.
  //    NextAuth reads the 'next-auth.session-token' cookie, verifies the JWT,
  //    and runs the 'jwt' and 'session' callbacks defined in authOptions.
  const session = await getServerSession(authOptions);

  // Check for session and the necessary user ID
  if (!session || !session.user || !session.user.id) {
    return null;
  }

  // 3. Extract user data directly from the session (populated by the JWT/session callbacks)
  const profileData = session.user.profileData || {};

  // 4. Return a consolidated user object
  return {
    uid: session.user.id, // The user's Firebase UID / Firestore document ID
    name: session.user.name,
    email: session.user.email,
    ...profileData, // Include all other profile data retrieved from Firestore via callbacks
  };
}
