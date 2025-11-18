// file path: ~/DEVFOLD/SCRIPT-PITCHER/SRC/LIB/AUTH/AUTH.JS

import { getServerSession } from "next-auth";
import { cookies, headers } from "next/headers";
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
  console.log(
    `[getCurrentUser] Secret (first 5): ${process.env.NEXTAUTH_SECRET?.substring(
      0,
      5
    )}`
  );

  // Use the established secure cookie name
  const cookieName = "__Secure-next-auth.session-token";
  const sessionCookieValue = cookies().get(cookieName)?.value || "";

  // --- ENHANCED DIAGNOSTICS: Check environment setup ---
  const nextAuthUrl = process.env.NEXTAUTH_URL || "NOT SET";
  let publicHost = "UNKNOWN";

  if (nextAuthUrl !== "NOT SET") {
    try {
      publicHost = new URL(nextAuthUrl).host;
      console.log(`[getCurrentUser: DIAG] NEXTAUTH_URL: ${nextAuthUrl}`);
      console.log(`[getCurrentUser: DIAG] Parsed Public Host: ${publicHost}`);
    } catch (e) {
      console.error(
        `[getCurrentUser: DIAG] Error parsing NEXTAUTH_URL: ${e.message}`
      );
      publicHost = "INVALID_URL";
    }
  } else {
    console.warn(
      "[getCurrentUser: DIAG] WARNING: NEXTAUTH_URL environment variable is NOT SET."
    );
  }
  // --- END ENHANCED DIAGNOSTICS ---

  // --- START DEFINITIVE FIX ---
  // 1. Get current request headers
  const reqHeaders = Object.fromEntries(headers());

  // 2. CONSTRUCT THE `req` OBJECT
  const req = {
    headers: reqHeaders,
    cookies: {
      [cookieName]: sessionCookieValue,
    },
  };

  // 🔎 DIAGNOSTIC LOGS: Displaying the raw host from the environment
  console.log(
    `[getCurrentUser: DIAG] Raw Request Host Header: ${
      req.headers["host"] || "Missing"
    }`
  );

  // ✅ CRITICAL FIX: Overwrite the host and protocol headers ONLY IF the session cookie exists.
  if (
    sessionCookieValue &&
    publicHost !== "UNKNOWN" &&
    publicHost !== "INVALID_URL"
  ) {
    // 1. Overwrite Host header to pass NextAuth's host check
    req.headers["host"] = publicHost;
    req.headers["x-forwarded-host"] = publicHost;

    // 2. VITAL FIX: Force protocol to HTTPS for secure cookie validation
    req.headers["x-forwarded-proto"] = "https";

    console.log(
      `[getCurrentUser: DIAG] Host Overwritten to: ${req.headers["host"]}`
    );
    console.log(
      `[getCurrentUser: DIAG] Protocol set to: ${req.headers["x-forwarded-proto"]}`
    );
  } else if (!sessionCookieValue) {
    console.warn(
      "[getCurrentUser: DIAG] WARNING: Session Cookie is EMPTY. Skipping Host/Protocol Overwrite."
    );
  }

  // We pass a fake 'res' object. It's not used but is required by v4.
  const res = { getHeader() {}, setHeader() {} };

  // 🔎 DIAGNOSTIC LOGS:
  console.log(
    `[getCurrentUser: DIAG] Session Cookie Found (first 10 chars): ${sessionCookieValue.substring(
      0,
      10
    )}... (Length: ${sessionCookieValue.length})`
  );

  // Pass (req, res, authOptions) to getServerSession
  const session = await getServerSession(req, res, authOptions);
  // --- END DEFINITIVE FIX ---

  // 🔎 DIAGNOSTIC LOG:
  console.log(
    `[getCurrentUser: DIAG] getServerSession Result: ${
      session ? "FOUND" : "NULL"
    }`
  );

  if (!session || !session.user || !session.user.id) {
    console.log(
      "[getCurrentUser] Session missing or user.id not found. Cannot proceed to data fetch."
    );
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
