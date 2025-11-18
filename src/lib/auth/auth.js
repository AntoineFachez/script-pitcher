// file path: ~/DEVFOLD/SCRIPT-PITCHER/SRC/LIB/AUTH/AUTH.JS

import { getServerSession } from "next-auth";
import { cookies, headers } from "next/headers";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { getAdminServices } from "@/lib/firebase/firebase-admin";
import { authConfig } from "./auth.config";
import { getToken } from "next-auth/jwt";

// // 1. Extend the lite config with Node.js-specific providers/callbacks
// export const authOptions = {
//   ...authConfig,
//   // url: process.env.NEXTAUTH_URL, // e.g., "https://script-pitcher.web.app"

//   // trustHost: true,
//   providers: [
//     GoogleProvider({
//       clientId: process.env.GOOGLE_CLIENT_ID,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//     }),
//     CredentialsProvider({
//       name: "Firebase Credentials",
//       credentials: {
//         idToken: { label: "ID Token", type: "text" },
//       },
//       async authorize(credentials, req) {
//         // 👈 This uses Node.js APIs
//         if (!credentials.idToken) return null;
//         try {
//           const { auth } = getAdminServices(); // 👈 Node.js API
//           const decodedToken = await auth.verifyIdToken(credentials.idToken);
//           if (decodedToken) {
//             return {
//               id: decodedToken.uid,
//               email: decodedToken.email,
//               name: decodedToken.name || null,
//             };
//           }
//           return null;
//         } catch (error) {
//           console.error("CredentialsProvider Error:", error.message);
//           return null;
//         }
//       },
//     }),
//   ],
//   callbacks: {
//     // These callbacks also use the Admin SDK, so they belong here
//     async session({ session, token }) {
//       if (token?.id) session.user.id = token.id;
//       if (token?.profileData) session.user.profileData = token.profileData;
//       return session;
//     },
//     async jwt({ token, user, trigger }) {
//       // 👈 This uses Node.js APIs
//       if (user) {
//         token.id = user.id;
//         token.email = user.email;
//         token.name = user.name;
//       }
//       const userId = token?.id || token?.sub;
//       if (!userId) return null;
//       if (token.profileData) return token;
//       try {
//         const { db } = getAdminServices(); // 👈 Node.js API
//         const userDocSnap = await db.doc(`users/${userId}`).get();
//         if (userDocSnap.exists) {
//           const userData = userDocSnap.data();
//           token.id = userId;
//           token.name = userData.displayName || userData.name || null;
//           token.profileData = { ...userData, uid: userId };
//           console.log("[Auth Callback: JWT] SUCCESS: Token enriched.");
//         } else {
//           console.warn(`[Auth Callback: JWT] WARN: User ${userId} not found.`);
//         }
//       } catch (error) {
//         console.error("Error in JWT callback:", error.message);
//       }
//       return token;
//     },
//   },
//   // This cookie config is fine to keep here
//   cookies: {
//     sessionToken: {
//       name: `__Secure-next-auth.session-token`,
//       options: {
//         httpOnly: true,
//         sameSite: "lax",
//         path: "/",
//         secure: true,
//         // domain: ".script-pitcher.web.app",
//       },
//     },
//   },
// };

// // 2. Your getCurrentUser helper (This is correct)
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
// export async function getCurrentUser() {
//   const nextAuthUrl = process.env.NEXTAUTH_URL || "NOT SET";
//   let publicHost = "UNKNOWN";

//   if (nextAuthUrl !== "NOT SET") {
//     try {
//       publicHost = new URL(nextAuthUrl).host;
//     } catch (e) {
//       publicHost = "INVALID_URL";
//     }
//   }

//   // 1. Collect raw headers and cookies
//   const reqHeaders = Object.fromEntries(headers());
//   const reqCookies = Object.fromEntries(
//     cookies()
//       .getAll()
//       .map((c) => [c.name, c.value])
//   );

//   // 2. SPOOF HEADERS (REQUIRED for the session check to pass)
//   if (publicHost !== "UNKNOWN" && publicHost !== "INVALID_URL") {
//     reqHeaders["host"] = publicHost;
//     reqHeaders["x-forwarded-host"] = publicHost;
//     reqHeaders["x-forwarded-proto"] = "https"; // Critical for __Secure-next-auth cookie check
//   }

//   // 3. Construct the request object for getServerSession
//   const req = {
//     headers: reqHeaders,
//     cookies: reqCookies,
//   };
//   const res = { getHeader() {}, setHeader() {} };

//   // --- DIAGNOSTICS (Ensure these logs are visible) ---
//   console.log(
//     `[getCurrentUser] Secret (first 5): ${process.env.NEXTAUTH_SECRET?.substring(
//       0,
//       5
//     )}`
//   );
//   console.log(`[getCurrentUser: DIAG] NEXTAUTH_URL: ${nextAuthUrl}`);
//   console.log(`[getCurrentUser: DIAG] Parsed Public Host: ${publicHost}`);
//   console.log(`[getCurrentUser: DIAG] **SPOOFED HOST**: ${reqHeaders["host"]}`);
//   console.log(
//     `[getCurrentUser: DIAG] **SPOOFED PROTO**: ${reqHeaders["x-forwarded-proto"]}`
//   );
//   console.log(
//     `[getCurrentUser: DIAG] Cookie Length: ${
//       reqCookies["__Secure-next-auth.session-token"]?.length || 0
//     }`
//   );
//   // --- END DIAGNOSTICS ---

//   // 4. Pass (req, res, authOptions) to getServerSession
//   const session = await getServerSession(req, res, authOptions);

//   console.log(
//     `[getCurrentUser: DIAG] getServerSession Result: ${
//       session ? "FOUND" : "NULL"
//     }`
//   );
//   // ... (rest of logic)
//   if (!session || !session.user || !session.user.id) {
//     console.log("[getCurrentUser] Session missing or user.id not found.");
//     return null;
//   }

//   console.log("[getCurrentUser] Found session for user.id:", session.user.id);
//   const profileData = session.user.profileData || {};

//   return {
//     uid: session.user.id,
//     name: session.user.name,
//     email: session.user.email,
//     ...profileData,
//   };
// }

// Dynamic configuration based on environment
const useSecureCookies = process.env.NODE_ENV === "production";
const sessionCookieName = useSecureCookies
  ? `__Secure-next-auth.session-token` // Use secure prefix in prod
  : `next-auth.session-token`; // Use standard prefix locally

// 🟢 CRITICAL FIX: Stabilize NEXTAUTH_SECRET by explicitly decoding/re-encoding it
// This resolves potential issues where Cloud Run corrupts the base64 string format.
let stableSecret = process.env.NEXTAUTH_SECRET;
try {
  // Check if the secret exists and process it as a base64 string
  if (stableSecret && stableSecret.length > 32) {
    stableSecret = Buffer.from(stableSecret, "base64").toString("base64");
  }
} catch (e) {
  // Log error but use original secret as fallback
  console.error("Error processing NEXTAUTH_SECRET:", e.message);
}

// 1. Extend the lite config with Node.js-specific providers/callbacks
export const authOptions = {
  ...authConfig,

  // FIX 1 (STABILIZATION): Explicitly set secret, URL, and trustHost.
  secret: stableSecret, // ⬅️ USE THE PROCESSED SECRET HERE
  url: process.env.NEXTAUTH_URL,
  trustHost: true, // Required for proxy support

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
  cookies: {
    sessionToken: {
      name: sessionCookieName,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        // 🛑 FIX 2: REMOVE secure: true from prod config via dynamic check
        secure: useSecureCookies,
      },
    },
  },
};

// export async function getCurrentUser() {
//   // Use the dynamic configuration logic
//   const useSecureCookies = process.env.NODE_ENV === "production";
//   const cookieName = useSecureCookies
//     ? `__Secure-next-auth.session-token`
//     : `next-auth.session-token`;

//   const nextAuthUrl = process.env.NEXTAUTH_URL || "NOT SET";
//   let publicHost = "UNKNOWN";

//   if (nextAuthUrl !== "NOT SET") {
//     try {
//       publicHost = new URL(nextAuthUrl).host;
//     } catch (e) {
//       publicHost = "INVALID_URL";
//     }
//   }

//   // 1. Collect raw headers and cookies
//   const reqHeaders = Object.fromEntries(headers());
//   // Read the cookie using the dynamic name
//   const reqCookies = Object.fromEntries(
//     cookies()
//       .getAll()
//       .map((c) => [c.name, c.value])
//   );

//   // Determine protocol dynamically for header spoofing
//   const protocol = useSecureCookies ? "https" : "http";

//   // 2. SPOOF HEADERS (REQUIRED for production proxy)
//   if (publicHost !== "UNKNOWN" && publicHost !== "INVALID_URL") {
//     reqHeaders["host"] = publicHost;
//     reqHeaders["x-forwarded-host"] = publicHost;
//     reqHeaders["x-forwarded-proto"] = protocol; // Use dynamic protocol
//   }

//   // 3. Construct the request object for getServerSession
//   const req = { headers: reqHeaders, cookies: reqCookies };
//   const res = { getHeader() {}, setHeader() {} };

//   // 4. Pass (req, res, authOptions) to getServerSession
//   const session = await getServerSession(req, res, authOptions);

//   // ... (Diagnostics and return logic)

//   if (!session || !session.user || !session.user.id) {
//     console.log("[getCurrentUser] Session missing or user.id not found.");
//     return null;
//   }

//   console.log("[getCurrentUser] Found session for user.id:", session.user.id);
//   const profileData = session.user.profileData || {};

//   return {
//     uid: session.user.id,
//     name: session.user.name,
//     email: session.user.email,
//     ...profileData,
//   };
// }
// 2. Your getCurrentUser helper (With Secret Debug Log)
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

  // 1. Collect raw headers and cookies
  const reqHeaders = Object.fromEntries(headers());
  const reqCookies = Object.fromEntries(
    cookies()
      .getAll()
      .map((c) => [c.name, c.value])
  );

  // Determine protocol dynamically for header spoofing
  const protocol = useSecureCookies ? "https" : "http";

  // 2. SPOOF HEADERS (Required for production proxy)
  if (publicHost !== "UNKNOWN" && publicHost !== "INVALID_URL") {
    reqHeaders["host"] = publicHost;
    reqHeaders["x-forwarded-host"] = publicHost;
    reqHeaders["x-forwarded-proto"] = protocol;
  }

  // 3. Construct the request object for getServerSession
  const req = { headers: reqHeaders, cookies: reqCookies };
  const res = { getHeader() {}, setHeader() {} };

  // --- DIAGNOSTICS (NEW CRITICAL DEBUG LOGS) ---
  console.log(`[AUTH DEBUG] Secret (Full): ${process.env.NEXTAUTH_SECRET}`); // ⬅️ THIS MUST BE CHECKED IN GCLOUD LOGS
  console.log(`[AUTH DEBUG] Spoofed Host: ${reqHeaders["host"]}`);
  console.log(`[AUTH DEBUG] Protocol: ${reqHeaders["x-forwarded-proto"]}`);
  console.log(
    `[AUTH DEBUG] Cookie Length: ${reqCookies[sessionCookieName]?.length || 0}`
  );
  // --- END DIAGNOSTICS ---

  // 4. Pass (req, res, authOptions) to getServerSession
  const session = await getServerSession(req, res, authOptions);

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
