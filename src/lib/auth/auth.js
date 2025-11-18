import { cookies } from "next/headers";
import { getAdminServices } from "@/lib/firebase/firebase-admin";

// 🟢 NEW getCurrentUser: Reads and verifies a simple Firebase session cookie
export async function getCurrentUser() {
  // We expect the session to be stored in a cookie named '__session'
  const sessionCookie = cookies().get(
    "__Secure-next-auth.session-token"
  )?.value;

  if (!sessionCookie) {
    return null;
  }

  try {
    const { auth, db } = getAdminServices();

    // 1. Verify the session cookie with Firebase Admin SDK
    // The checkRevoked: true flag ensures security
    const decodedToken = await auth.verifySessionCookie(sessionCookie, true);
    const userId = decodedToken.uid;

    // 2. Fetch User Data (Re-using existing logic)
    const userDocSnap = await db.doc(`users/${userId}`).get();

    if (userDocSnap.exists) {
      const userData = userDocSnap.data();
      console.log(
        "[getCurrentUser] ✅ Firebase Session verified for user.id:",
        userId
      );

      return {
        uid: userId,
        name:
          userData.displayName || userData.name || decodedToken.name || null,
        email: userData.email || decodedToken.email,
        ...userData,
      };
    } else {
      console.warn(`[getCurrentUser] WARN: User ${userId} not found in DB.`);
      return null;
    }
  } catch (error) {
    // This catches expired or invalid cookies
    console.error(
      "[getCurrentUser] Firebase Session verification failed:",
      error.message
    );

    // Clear the invalid cookie so the client attempts sign-in again
    cookies().set("__session", "", { maxAge: 0, path: "/" });

    return null;
  }
}

// // file path: ~/DEVFOLD/SCRIPT-PITCHER/SRC/LIB/AUTH/AUTH.JS

// import { getServerSession } from "next-auth";
// import { cookies, headers } from "next/headers";
// import GoogleProvider from "next-auth/providers/google";
// import CredentialsProvider from "next-auth/providers/credentials";
// import { getAdminServices } from "@/lib/firebase/firebase-admin";
// import { authConfig } from "./auth.config";

// // --- DYNAMIC CONFIGURATION HELPERS ---
// const useSecureCookies = process.env.NODE_ENV === "production";
// const sessionCookieName = useSecureCookies
//   ? `__Secure-next-auth.session-token` // Use secure prefix in prod (Cloud Run)
//   : `next-auth.session-token`; // Use standard prefix locally (localhost)

// // 🟢 FIX 1 (BUILD CRASH): Safe function to derive cookie domain.
// const getCookieDomain = () => {
//   const url = process.env.NEXTAUTH_URL;
//   if (!url) return undefined; // Prevents TypeError: Invalid URL during build
//   try {
//     const hostname = new URL(url).hostname;
//     // Return .domain.com format for production only
//     return useSecureCookies && !hostname.includes("localhost")
//       ? `.${hostname}`
//       : undefined;
//   } catch (e) {
//     console.error(
//       "Failed to parse NEXTAUTH_URL during config initialization:",
//       e.message
//     );
//     return undefined;
//   }
// };

// const dynamicCookieDomain = getCookieDomain();

// // --- AUTH OPTIONS (Must be stable) ---
// export const authOptions = {
//   ...authConfig,

//   // 🟢 FIX 1 (STABILITY): Explicitly set secret, URL, and trustHost.
//   secret: process.env.NEXTAUTH_SECRET,
//   url: process.env.NEXTAUTH_URL, // e.g., https://script-pitcher.web.app
//   trustHost: true, // Vital for proxy support

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
//         if (!credentials.idToken) return null;
//         try {
//           const { auth } = getAdminServices();
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
//     async session({ session, token }) {
//       if (token?.id) session.user.id = token.id;
//       if (token?.profileData) session.user.profileData = token.profileData;
//       return session;
//     },
//     async jwt({ token, user, trigger }) {
//       if (user) {
//         token.id = user.id;
//         token.email = user.email;
//         token.name = user.name;
//       }
//       const userId = token?.id || token?.sub;
//       if (!userId) return null;
//       if (token.profileData) return token;
//       try {
//         const { db } = getAdminServices();
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
//   cookies: {
//     sessionToken: {
//       name: sessionCookieName,
//       options: {
//         httpOnly: true,
//         sameSite: "lax",
//         path: "/",
//         secure: useSecureCookies,
//         domain: dynamicCookieDomain,
//       },
//     },
//   },
// };

// // --- GET CURRENT USER (with Proxy Spoofing) ---
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

//   // Use the standard Next.js cookie read method for robustness
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
