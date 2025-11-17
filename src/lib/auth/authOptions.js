// file path: ~/DEVFOLD/SCRIPT-PITCHER/SRC/LIB/AUTHOPTIONS.JS

import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { getFirebaseDb } from "@/lib/firebase/firebase-client"; // Client DB for Server/Action
import { doc, getDoc } from "firebase/firestore"; // Import Firestore functions

export const authOptions = {
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

  callbacks: {
    // 1. Session Callback (CRITICALLY REFACTORED)
    // The 'token' contains all user data embedded by the JWT callback.
    async session({ session, token }) {
      // 🛑 CRITICAL DEBUGGING LOG 🛑
      console.log("SERVER DEBUG: Session Callback Fired");
      console.log("Token received:", !!token);
      console.log("Token ID:", token?.id);

      if (token) {
        // Map required fields from the JWT payload (token) to the session.user object
        session.user.id = token.id;
        session.user.name = token.name || session.user.name; // Keep existing name if present
        session.user.email = token.email || session.user.email; // Keep existing email if present

        // 🛑 CRITICAL FIX: Transfer custom properties
        session.user.profileData = token.profileData || {}; // Get profile data from token
      }
      return session;
    },

    // 2. JWT Callback (Corrected Logic)
    async jwt({ token, user, trigger }) {
      // 'user' is present only on first sign-in (social or credentials)
      // The NextAuth session cookie is manually created in session-sync/route.js

      const userId = user?.id || token.id;

      // Logic runs on sign-in (user is present) OR on session refresh/update (no user, only token)
      if (user || trigger === "update" || !token.id) {
        // Force update if ID is missing from token
        if (userId) {
          try {
            // ⚠️ WARNING: Client DB import (db) used on server is unstable.
            // This is kept but should ideally use Firestore Admin SDK.
            const userDocRef = doc(getFirebaseDb(), "users", userId);
            const userDocSnap = await getDoc(userDocRef);

            if (userDocSnap.exists()) {
              const userData = userDocSnap.data();

              // ⭐️ Embed required standard fields (name/email) + custom data into the JWT
              token.id = userId;
              token.name = userData.displayName || userData.name; // Add display name to token
              token.email = userData.email; // Add email to token
              token.profileData = {
                ...userData,
                uid: userId,
              };
            }
          } catch (error) {
            console.error(
              "Error fetching user profile in JWT callback:",
              error
            );
          }
        }
      }
      return token;
    },
  },
  jwt: {
    // Tell NextAuth to use HS256 (the algorithm used in your route.js SignJWT)
    // and explicitly disable encryption (which is where the 'JWEInvalid' error comes from).
    encode: ({ secret, token, maxAge }) => {
      const { SignJWT } = require("jose"); // Import jose dynamically here if needed

      return new SignJWT(token)
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime(maxAge)
        .sign(new TextEncoder().encode(secret));
    },
    // Tell NextAuth to decode using the same signing algorithm (HS256)
    decode: async ({ secret, token }) => {
      const { jwtVerify } = require("jose"); // Import jose dynamically here if needed

      // By default, jwtVerify assumes JWS (signed token).
      // This MUST match your route.js implementation.
      const { payload } = await jwtVerify(
        token,
        new TextEncoder().encode(secret)
      );
      return payload;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
