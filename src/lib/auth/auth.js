// file path: ~/DEVFOLD/SCRIPT-PITCHER/SRC/LIB/AUTH/AUTH.JS

import { getServerSession } from "next-auth";
// --- START FIX ---
// REMOVE the import for 'headers'
// import { headers } from "next/headers";
// --- END FIX ---
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { getAdminServices } from "@/lib/firebase/firebase-admin";

// ... (your entire authOptions object remains here, it is correct) ...
export const authOptions = {
  // ... (providers, callbacks, etc.)
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
    async session({ session, token }) {
      if (token?.id) session.user.id = token.id;
      if (token?.profileData) session.user.profileData = token.profileData;
      return session;
    },
    async jwt({ token, user, trigger }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
      }
      const userId = token?.id || token?.sub;
      if (!userId) {
        return null;
      }
      if (token.profileData) {
        return token;
      }
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
  // This is the standard for production sites.
  cookies: {
    sessionToken: {
      name: `__Secure-next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: true,
        // This is the critical line
        domain: ".script-pitcher.web.app",
      },
    },
  },
};
// --- END of authOptions ---

// 2. Your getCurrentUser helper
export async function getCurrentUser() {
  // --- START FIX ---
  // REMOVE this line. The page will handle dynamic rendering.
  // headers();
  // --- END FIX ---

  console.log(
    `[getCurrentUser] Secret (first 5): ${process.env.NEXTAUTH_SECRET?.substring(
      0,
      5
    )}`
  );

  const session = await getServerSession(authOptions);

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
