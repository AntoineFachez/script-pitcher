// file path: ~/DEVFOLD/SCRIPT-PITCHER/SRC/LIB/AUTH/AUTH.JS

import NextAuth from "next-auth";
// --- START FIX ---
// REMOVE getServerSession, it's not used in v5 this way
// import { getServerSession } from "next-auth";
// --- END FIX ---
import { headers } from "next/headers";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { getAdminServices } from "@/lib/firebase/firebase-admin";

// 1. This object is your single source of truth
export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: "Firebase Credentials",
      credentials: {
        idToken: { label: "ID Token", type: "text" },
      },
      async authorize(credentials, req) {
        if (!credentials.idToken) {
          console.error("CredentialsProvider: No idToken provided.");
          return null;
        }
        try {
          const { auth } = getAdminServices();
          const decodedToken = await auth.verifyIdToken(credentials.idToken);
          if (decodedToken) {
            return {
              id: decodedToken.uid,
              email: decodedToken.email,
              name: decodedToken.name || null,
            };
          }
          return null;
        } catch (error) {
          console.error(
            "CredentialsProvider Error (verifyIdToken):",
            error.message
          );
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  jwt: {
    maxAge: 30 * 24 * 60 * 60,
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    // This authorized callback is for middleware
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isProtectedRoute =
        nextUrl.pathname.startsWith("/dashboard") ||
        nextUrl.pathname.startsWith("/me") ||
        nextUrl.pathname.startsWith("/projects") ||
        nextUrl.pathname.startsWith("/users");

      if (isProtectedRoute) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page
      }
      return true;
    },
    // This session callback adds the ID to the session object
    async session({ session, token }) {
      console.log("[Auth Callback: SESSION] Received token:", token);
      if (token?.id) session.user.id = token.id;
      if (token?.profileData) session.user.profileData = token.profileData;
      session.user.name = token.name;
      session.user.email = token.email;
      console.log("[Auth Callback: SESSION] Returning session:", session);
      return session;
    },
    // This jwt callback enriches the token
    async jwt({ token, user, trigger }) {
      console.log("[Auth Callback: JWT] Received token:", token);
      console.log("[Auth Callback: JWT] Received user:", user);
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
      }
      const userId = token?.id || token?.sub;
      if (!userId) {
        console.error("[Auth Callback: JWT] FAILED: No userId in token.");
        return null;
      }
      if (token.profileData) {
        console.log("[Auth Callback: JWT] Token already enriched.");
        return token;
      }
      console.log(`[Auth Callback: JWT] Enriching token for userId: ${userId}`);
      try {
        const { db } = getAdminServices();
        const userDocRef = db.doc(`users/${userId}`);
        const userDocSnap = await userDocRef.get();
        if (userDocSnap.exists) {
          const userData = userDocSnap.data();
          token.id = userId;
          token.name = userData.displayName || userData.name || null;
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
          error.message
        );
      }
      return token;
    },
  },
  pages: {
    signIn: "/",
    signOut: "/",
    error: "/",
  },
};

// 2. ⭐️ EXPORT THE HANDLERS AND AUTH FUNCTION
// This is the correct v5 syntax
export const {
  handlers: { GET, POST },
  auth,
} = NextAuth(authOptions);

// 3. ⭐️ REFACTOR getCurrentUser
export async function getCurrentUser() {
  headers(); // Force dynamic rendering
  console.log(
    `[getCurrentUser] Secret (first 5): ${process.env.NEXTAUTH_SECRET?.substring(
      0,
      5
    )}`
  );

  // --- START FIX ---
  // Use the 'auth' function we exported above, NOT getServerSession
  const session = await auth();
  // --- END FIX ---

  if (!session || !session.user || !session.user.id) {
    console.log("[getCurrentUser] Session missing or user.id not found.");
    return null;
  }

  console.log("[getCurrentUser] Found session for user.id:", session.user.id);
  const profileData = session.user.profileData || {};

  return {
    uid: session.user.id,
    name: session.user.name,
    email: session.user.email,
    ...profileData,
  };
}
