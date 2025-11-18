// file path: ~/DEVFOLD/SCRIPT-PITCHER/SRC/LIB/AUTH/AUTH.JS

import { getServerSession } from "next-auth";
import { headers } from "next/headers";
import GoogleProvider from "next-auth/providers/google";

// import { getAdminServices } from "@/lib/firebase/firebase-admin";
// import { getDoc } from "firebase-admin/firestore"; // Admin SDK

// 1. Define the single, complete auth config object
export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,

  callbacks: {
    async session({ session, token }) {
      console.log("[Auth Callback: SESSION] Received token:", token);
      if (token?.id) session.user.id = token.id;
      if (token?.profileData) session.user.profileData = token.profileData;
      session.user.name = token.name;
      session.user.email = token.email;
      console.log("[Auth Callback: SESSION] Returning session:", session);
      return session;
    },

    async jwt({ token, user, trigger }) {
      // ✅ This log will NOW run
      console.log("[Auth Callback: JWT] Received token:", token);
      console.log("[Auth Callback: JWT] Received user:", user);

      if (token && token.profileData) {
        console.log("[Auth Callback: JWT] Token already enriched.");
        return token;
      }

      const userId = token?.id || token?.sub;

      if (!userId) {
        console.error(
          "[Auth Callback: JWT] FAILED: No userId (id or sub) in token."
        );
        return null;
      }

      console.log(`[Auth Callback: JWT] Enriching token for userId: ${userId}`);

      if (user || trigger === "update" || !token.id) {
        if (userId) {
          try {
            // 2. ✅ IMPORT ADMIN SDK *inside* the try block
            const { getAdminServices } = await import(
              "@/lib/firebase/firebase-admin"
            );

            // 3. ✅ Use V8 syntax
            const { db } = getAdminServices();
            const userDocRef = db.doc(`users/${userId}`); // V8 doc()
            const userDocSnap = await userDocRef.get(); // V8 .get()

            if (userDocSnap.exists) {
              // ... (your enrichment logic is correct)
              console.log("[Auth Callback: JWT] SUCCESS: Token enriched.");
            } else {
              console.warn(`[Auth Callback: JWT] WARN: ...`);
            }
          } catch (error) {
            console.error(
              "[Auth Callback: JWT] FAILED to fetch user profile:",
              error.message
            );
          }
        }
      }
      return token;
    },
  },
  // Add the pages config here
  pages: {
    signIn: "/",
    signOut: "/",
    error: "/",
    verifyRequest: "/",
    newUser: "/me",
  },
};

// 2. Your getCurrentUser helper, now in the same file
export async function getCurrentUser() {
  headers(); // Force dynamic rendering

  // ⭐️ DEBUG: See what secret this function is reading
  console.log(
    `[getCurrentUser] Secret (first 5): ${process.env.NEXTAUTH_SECRET?.substring(
      0,
      5
    )}`
  );

  const session = await getServerSession(authOptions);

  if (!session || !session.user || !session.user.id) {
    return null;
  }

  const profileData = session.user.profileData || {};

  return {
    uid: session.user.id,
    name: session.user.name,
    email: session.user.email,
    ...profileData,
  };
}
