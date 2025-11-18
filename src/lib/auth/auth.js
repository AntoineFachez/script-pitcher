// file path: ~/DEVFOLD/SCRIPT-PITCHER/SRC/LIB/AUTH/AUTH.JS

import { getServerSession } from "next-auth";
import { cookies, headers } from "next/headers";
import { getToken } from "next-auth/jwt"; // <--- ADD THIS IMPORT
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { getAdminServices } from "@/lib/firebase/firebase-admin";
import { authConfig } from "./auth.config";

// 1. Extend the lite config with Node.js-specific providers/callbacks
export const authOptions = {
  ...authConfig,
  trustHost: true,
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
        domain:
          process.env.NEXT_PUBLIC_BASE_COOKIE_DOMAIN ||
          ".script-pitcher.web.app",
      },
    },
  },
};

// 2. Your getCurrentUser helper (This is correct)
export async function getCurrentUser() {
  // Use the standard environment variable to determine the public host
  const nextAuthUrl = process.env.NEXTAUTH_URL || "NOT SET";
  let publicHost = "UNKNOWN";

  if (nextAuthUrl !== "NOT SET") {
    try {
      publicHost = new URL(nextAuthUrl).host;
    } catch (e) {
      publicHost = "INVALID_URL";
    }
  }

  // 1. Get current request headers
  const reqHeaders = Object.fromEntries(headers());

  // 2. SPOOF HEADERS (Required for NextAuth token validation in a proxied environment)
  if (publicHost !== "UNKNOWN" && publicHost !== "INVALID_URL") {
    reqHeaders["host"] = publicHost;
    reqHeaders["x-forwarded-host"] = publicHost;
    reqHeaders["x-forwarded-proto"] = "https"; // Crucial for __Secure-next-auth cookie
  }

  // 3. Construct the minimal mock request object for getToken
  const req = { headers: reqHeaders };

  // 4. Use getToken to read the JWT directly (bypasses getServerSession complexity)
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
    // We pass the NEXTAUTH_OPTIONS here, which allows getToken to read the JWT options
    cookieName: "__Secure-next-auth.session-token",
  });

  // --- DIAGNOSTICS ---
  console.log(
    `[getCurrentUser] Secret (first 5): ${process.env.NEXTAUTH_SECRET?.substring(
      0,
      5
    )}`
  );
  console.log(`[getCurrentUser: DIAG] NEXTAUTH_URL: ${nextAuthUrl}`);
  console.log(`[getCurrentUser: DIAG] Parsed Public Host: ${publicHost}`);
  console.log(
    `[getCurrentUser: DIAG] Injected Request Host: ${reqHeaders["host"]}`
  );
  console.log(
    `[getCurrentUser: DIAG] Injected Protocol: ${reqHeaders["x-forwarded-proto"]}`
  );
  console.log(
    `[getCurrentUser: DIAG] getToken Result: ${token ? "FOUND" : "NULL"}`
  );
  // --- END DIAGNOSTICS ---

  if (!token || !token.id) {
    console.log(
      "[getCurrentUser] Token missing or token.id not found. Cannot proceed to data fetch."
    );
    return null;
  }

  // This will finally work in production
  console.log("[getCurrentUser] Found session for user.id:", token.id);
  const profileData = token.profileData || {};

  return {
    uid: token.id,
    name: token.name,
    email: token.email,
    ...profileData,
  };
}
