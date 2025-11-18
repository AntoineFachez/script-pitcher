// file path: ~/DEVFOLD/SCRIPT-PITCHER/SRC/LIB/AUTH/AUTH.JS

import { getServerSession } from "next-auth";
import { headers } from "next/headers";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { getAdminServices } from "@/lib/firebase/firebase-admin"; // 👈 Node.js API
import { authConfig } from "./auth.config"; // 👈 Import the lite config

// 1. Extend the lite config with Node.js-specific providers/callbacks
export const authOptions = {
  ...authConfig, // 👈 Spread the lite config (secret, pages, session, jwt)
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
        // 👈 This uses Node.js APIs
        if (!credentials.idToken) return null;
        try {
          const { auth } = getAdminServices(); // 👈 Node.js API
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
          console.error("CredentialsProvider Error:", error.message);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    // These callbacks also use the Admin SDK, so they belong here
    async session({ session, token }) {
      if (token?.id) session.user.id = token.id;
      if (token?.profileData) session.user.profileData = token.profileData;
      return session;
    },
    async jwt({ token, user, trigger }) {
      // 👈 This uses Node.js APIs
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
      }
      const userId = token?.id || token?.sub;
      if (!userId) return null;
      if (token.profileData) return token;
      try {
        const { db } = getAdminServices(); // 👈 Node.js API
        const userDocSnap = await db.doc(`users/${userId}`).get();
        if (userDocSnap.exists) {
          const userData = userDocSnap.data();
          token.id = userId;
          token.name = userData.displayName || userData.name || null;
          token.profileData = { ...userData, uid: userId };
          console.log("[Auth Callback: JWT] SUCCESS: Token enriched.");
        } else {
          console.warn(`[Auth Callback: JWT] WARN: User ${userId} not found.`);
        }
      } catch (error) {
        console.error("Error in JWT callback:", error.message);
      }
      return token;
    },
  },
  // This cookie config is fine to keep here
  cookies: {
    sessionToken: {
      name: `__Secure-next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: true,
        domain: ".script-pitcher.web.app",
      },
    },
  },
};

// 2. Your getCurrentUser helper (This is correct)
export async function getCurrentUser() {
  console.log(
    `[getCurrentUser] Secret (first 5): ${process.env.NEXTAUTH_SECRET?.substring(
      0,
      5
    )}`
  );

  // --- START FIX ---
  // getServerSession (v4) in App Router needs a manual 'req' and 'res' object.
  const req = {
    headers: Object.fromEntries(headers()), // Get headers
    cookies: Object.fromEntries(
      cookies()
        .getAll()
        .map((c) => [c.name, c.value])
    ), // Get cookies
  };
  // We pass a fake 'res' object. It's not used but is required by v4.
  const res = { getHeader() {}, setHeader() {} };

  // Pass (req, res, authOptions) to getServerSession
  const session = await getServerSession(req, res, authOptions);
  // --- END FIX ---

  if (!session || !session.user || !session.user.id) {
    console.log("[getCurrentUser] Session missing or user.id not found.");
    return null;
  }

  // This will finally work in production
  console.log("[getCurrentUser] Found session for user.id:", session.user.id);
  const profileData = session.user.profileData || {};

  return {
    uid: session.user.id,
    name: session.user.name,
    email: session.user.email,
    ...profileData,
  };
}
