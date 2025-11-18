// file path: ~/DEVFOLD/SCRIPT-PITCHER/SRC/LIB/AUTHOPTIONS.JS

import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
// Removed: import { FirestoreAdapter } from "@auth/firebase-adapter";
import { db } from "@/lib/firebase/firebase-client"; // Client DB for Server/Action
// import { doc, getDoc } from "firebase/firestore"; // Import Firestore functions

import { getAdminServices } from "@/lib/firebase/firebase-admin";
import { getDoc } from "firebase-admin/firestore";
import { authConfig } from "./auth.config"; // ✅ Import config
// 1. ✅ The variable is defined first from the environment
const NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET;

// ⭐️ ADD THIS LOG
console.log(
  `[AuthOptions] Secret loaded (first 5 chars): ${NEXTAUTH_SECRET?.substring(
    0,
    5
  )}`
);

export const authOptions = {
  ...authConfig,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    // 🧹 Cleaned: Remove the unused/confusing CredentialsProvider
  ],

  // 🧹 Cleaned: Adapter is intentionally removed for JWT strategy
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  // ✅ ADD THIS BLOCK
  // This tells NextAuth how long the JWT itself is valid
  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 days (must match session)
  },
  callbacks: {
    // 1. Session Callback (CRITICALLY REFACTORED)
    // The 'token' contains all user data embedded by the JWT callback.
    async session({ session, token }) {
      // ⭐️ DEBUG: See what token is coming from the JWT callback
      console.log("[Auth Callback: SESSION] Received token:", token);

      if (token?.id) {
        session.user.id = token.id;
      } else {
        // ⭐️ DEBUG: If this logs, session.user.id will be missing
        console.warn(
          "[Auth Callback: SESSION] WARN: No 'id' on token for session."
        );
      }

      if (token?.profileData) {
        session.user.profileData = token.profileData;
      }

      session.user.name = token.name;
      session.user.email = token.email;

      // ⭐️ DEBUG: See the final session object
      console.log("[Auth Callback: SESSION] Returning session:", session);
      return session;
    },

    // 2. JWT Callback (Corrected Logic)
    async jwt({ token, user, trigger }) {
      // 'user' is present only on first sign-in (social or credentials)
      // The NextAuth session cookie is manually created in session-sync/route.js
      console.log("[Auth Callback: JWT] Received token:", token);
      console.log("[Auth Callback: JWT] Received user:", user);

      if (token && token.profileData) {
        console.log("[Auth Callback: JWT] Token already enriched.");
        return token;
      }

      const userId = token?.id || token?.sub;

      if (!userId) {
        // ⭐️ DEBUG: This is a critical failure point
        console.error(
          "[Auth Callback: JWT] FAILED: No userId (id or sub) in token."
        );
        return null; // This will cause getServerSession to return null
      }

      console.log(`[Auth Callback: JWT] Enriching token for userId: ${userId}`);

      // Logic runs on sign-in (user is present) OR on session refresh/update (no user, only token)
      if (user || trigger === "update" || !token.id) {
        if (userId) {
          try {
            // 3. ✅ Use the ADMIN services
            const { db } = getAdminServices();
            const userDocRef = db.doc(`users/${userId}`); // Admin 'doc'
            const userDocSnap = await getDoc(userDocRef); // Admin 'getDoc'

            if (userDocSnap.exists()) {
              const userData = userDocSnap.data();
              token.id = userId;
              token.name = userData.displayName || userData.name || null; // Ensure null
              token.email = userData.email;
              token.profileData = { ...userData, uid: userId };
              console.log("[Auth Callback: JWT] SUCCESS: Token enriched.");
            } else {
              console.warn(
                `[Auth Callback: JWT] WARN: User ${userId} not found in Firestore.`
              );
            }
          } catch (error) {
            console.error(
              "Error fetching user profile in JWT callback:",
              error.message // Log the error message
            );
            // This could be a permissions or FIREBASE_SERVICE_ACCOUNT_KEY error
          }
        }
      }
      return token;
    },
  },
  // jwt: {
  //   // Tell NextAuth to use HS256 (the algorithm used in your route.js SignJWT)
  //   // and explicitly disable encryption (which is where the 'JWEInvalid' error comes from).
  //   encode: ({ secret, token, maxAge }) => {
  //     const { SignJWT } = require("jose"); // Import jose dynamically here if needed

  //     return new SignJWT(token)
  //       .setProtectedHeader({ alg: "HS256" })
  //       .setIssuedAt()
  //       .setExpirationTime(maxAge)
  //       .sign(new TextEncoder().encode(secret));
  //   },
  //   // Tell NextAuth to decode using the same signing algorithm (HS256)
  //   decode: async ({ secret, token }) => {
  //     const { jwtVerify } = require("jose"); // Import jose dynamically here if needed

  //     // By default, jwtVerify assumes JWS (signed token).
  //     // This MUST match your route.js implementation.
  //     const { payload } = await jwtVerify(
  //       token,
  //       new TextEncoder().encode(secret)
  //     );
  //     return payload;
  //   },
  // },
  secret: process.env.NEXTAUTH_SECRET,
};
