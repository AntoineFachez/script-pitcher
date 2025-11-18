// file path: ~/DEVFOLD/SCRIPT-PITCHER/SRC/LIB/AUTH/AUTH.JS

import { getServerSession } from "next-auth";
import { cookies, headers } from "next/headers";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { getAdminServices } from "@/lib/firebase/firebase-admin";
import { authConfig } from "./auth.config";
import { getToken } from "next-auth/jwt";

// 1. Extend the lite config with Node.js-specific providers/callbacks
export const authOptions = {
  ...authConfig,
  url: process.env.NEXTAUTH_URL, // e.g., "https://script-pitcher.web.app"

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
        // domain: ".script-pitcher.web.app",
      },
    },
  },
};

// 2. Your getCurrentUser helper (This is correct)
// export async function getCurrentUser() {
//   console.log(
//     `[getCurrentUser] Secret (first 5): ${process.env.NEXTAUTH_SECRET?.substring(
//       0,
//       5
//     )}`
//   );

//   // --- START FIX ---
//   // getServerSession (v4) in App Router needs a manual 'req' and 'res' object.
//   const req = {
//     headers: Object.fromEntries(headers()), // Get headers
//     cookies: Object.fromEntries(
//       cookies()
//         .getAll()
//         .map((c) => [c.name, c.value])
//     ), // Get cookies
//   };
//   // We pass a fake 'res' object. It's not used but is required by v4.
//   const res = { getHeader() {}, setHeader() {} };

//   // Pass (req, res, authOptions) to getServerSession
//   const session = await getServerSession(req, res, authOptions);
//   // --- END FIX ---

//   if (!session || !session.user || !session.user.id) {
//     console.log("[getCurrentUser] Session missing or user.id not found.");
//     return null;
//   }

//   // This will finally work in production
//   console.log("[getCurrentUser] Found session for user.id:", session.user.id);
//   const profileData = session.user.profileData || {};

//   return {
//     uid: session.user.id,
//     name: session.user.name,
//     email: session.user.email,
//     ...profileData,
//   };
// }
// 2. Your getCurrentUser helper (Combined fix using getServerSession + Header Spoofing)
export async function getCurrentUser() {
  const nextAuthUrl = process.env.NEXTAUTH_URL || "NOT SET";
  let publicHost = "UNKNOWN";

  if (nextAuthUrl !== "NOT SET") {
    try {
      publicHost = new URL(nextAuthUrl).host;
    } catch (e) {
      publicHost = "INVALID_URL";
    }
  }

  // --- START DEFINITIVE FIX: Use getServerSession with Spoofed Headers ---

  // 1. Collect raw headers and cookies
  const reqHeaders = Object.fromEntries(headers());
  const reqCookies = Object.fromEntries(
    cookies()
      .getAll()
      .map((c) => [c.name, c.value])
  );

  // 2. SPOOF HEADERS (Required for production proxy)
  if (publicHost !== "UNKNOWN" && publicHost !== "INVALID_URL") {
    reqHeaders["host"] = publicHost;
    reqHeaders["x-forwarded-host"] = publicHost;
    reqHeaders["x-forwarded-proto"] = "https"; // Vital for __Secure-next-auth cookie check
  }

  // 3. Construct the request object for getServerSession
  const req = {
    headers: reqHeaders,
    cookies: reqCookies,
  };
  // 4. Pass a fake 'res' object (required for NextAuth v4 API)
  const res = { getHeader() {}, setHeader() {} };

  // 5. Pass (req, res, authOptions) to getServerSession
  const session = await getServerSession(req, res, authOptions);
  // --- END DEFINITIVE FIX ---

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
    `[getCurrentUser: DIAG] Final Request Host: ${reqHeaders["host"]}`
  );
  console.log(
    `[getCurrentUser: DIAG] Final Protocol: ${reqHeaders["x-forwarded-proto"]}`
  );
  console.log(
    `[getCurrentUser: DIAG] Session Cookie Found (Length): ${
      reqCookies["__Secure-next-auth.session-token"]?.length || 0
    }`
  );
  console.log(
    `[getCurrentUser: DIAG] getServerSession Result: ${
      session ? "FOUND" : "NULL"
    }`
  );
  // --- END DIAGNOSTICS ---

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
