// file path: ~/DEVFOLD/SCRIPT-PITCHER/SRC/LIB/AUTHOPTIONS.JS

import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { FirestoreAdapter } from "@auth/firebase-adapter";
import { db } from "@/lib/firebase/firebase-client"; // Client DB for Server/Action
import { doc, getDoc } from "firebase/firestore"; // Import Firestore functions

// This object is imported by NextAuth's catch-all route:
// /app/api/auth/[...nextauth]/route.js AND by getServerSession (your utility)
export const authOptions = {
  // ... (Your complete NextAuth configuration)
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: "Firebase Email/Password",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        try {
          // 1. Authenticate with Firebase using Admin SDK (by checking email/password)
          // NOTE: The Admin SDK does not directly support password login for security reasons.
          // The standard way is to use the CLIENT SDK in an API route to get the ID token,
          // then verify the ID token here.
          // For simplification, let's stick to using the Admin SDK to verify the existence
          // of a user, and rely on the client's Firebase login for the token.

          // 💡 SIMPLER ALTERNATIVE: Verify the ID Token from a client-sent action
          // We will use the client's login flow to get the token, similar to your original design,
          // but wrap it in the Credentials Provider structure.

          // This Credentials flow is complex to implement securely with Firebase Email/Password
          // due to the lack of a direct Admin SDK password check.

          // Let's stick to the simplest fix that resolves the 'null' issue:
          return null; // Don't use CredentialsProvider if you rely on Firebase password auth.
        } catch (e) {
          console.error("Credentials Authorization Error:", e);
          return null;
        }
      },
    }),
  ],
  adapter: FirestoreAdapter(db),
  session: {
    strategy: "database",
    maxAge: 30 * 24 * 60 * 60,
  },

  callbacks: {
    // 1. Session Callback (Unchanged)
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id; // Crucial for getting the UID

        // 🚨 CRITICAL: Transfer custom properties from the JWT/database user
        // The properties added in the 'jwt' callback must be available here
        // to pass them to the client session.
        session.user.profileData = user.profileData || {};
      }
      return session;
    },

    // 2. JWT Callback (NEW/MODIFIED)
    async jwt({ token, user, trigger }) {
      const userId = user?.id || token.id;

      // 🚨 Run this logic only on sign-in (user object exists) or session sync (trigger = update)
      // The FirestoreAdapter doesn't provide a 'user' object on subsequent requests,
      // but 'token' will contain the user data.
      if (user || trigger === "update") {
        if (userId) {
          try {
            const userDocRef = doc(db, "users", userId);
            const userDocSnap = await getDoc(userDocRef);

            if (userDocSnap.exists()) {
              const userData = userDocSnap.data();

              // ⭐️ Embed all necessary user data directly into the JWT
              token.id = userId; // Ensure the ID is always on the token root
              token.profileData = {
                // Use a specific key for profile data
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
