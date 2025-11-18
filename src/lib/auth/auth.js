// file path: ~/DEVFOLD/SCRIPT-PITCHE
import { getServerSession } from "next-auth";
import { headers } from "next/headers";
import GoogleProvider from "next-auth/providers/google";

// --- START FIX ---
import CredentialsProvider from "next-auth/providers/credentials";
import { getAdminServices } from "@/lib/firebase/firebase-admin"; // We need the ADMIN SDK
// REMOVE client-side imports, they don't work here
// import { getFirebaseAuth } from "@/lib/firebase/firebase-client";
// import { signInWithEmailAndPassword } from "firebase/auth";
// --- END FIX ---

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),

    // --- START REFACTOR ---
    CredentialsProvider({
      name: "Firebase Credentials",
      // We only expect an idToken from the client
      credentials: {
        idToken: { label: "ID Token", type: "text" },
      },

      async authorize(credentials, req) {
        if (!credentials.idToken) {
          console.error("CredentialsProvider: No idToken provided.");
          return null; // No token, authorization fails
        }

        try {
          // Use the ADMIN SDK's auth service to verify the token
          const { auth } = getAdminServices();
          const decodedToken = await auth.verifyIdToken(credentials.idToken);

          if (decodedToken) {
            // Token is valid. Return a user object.
            // This object will be passed to the 'jwt' callback.
            return {
              id: decodedToken.uid,
              email: decodedToken.email,
              name: decodedToken.name || null,
            };
          }
          return null; // Token was invalid
        } catch (error) {
          console.error(
            "CredentialsProvider Error (verifyIdToken):",
            error.message
          );
          return null; // Token verification failed
        }
      },
    }),
    // --- END REFACTOR ---
  ],
  session: {
    // ... (same as before)
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  jwt: {
    // ... (same as before)
    maxAge: 30 * 24 * 60 * 60,
  },
  secret: process.env.NEXTAUTH_SECRET,

  callbacks: {
    // This session callback is correct and will now get a full token
    async session({ session, token }) {
      // console.log("[Auth Callback: SESSION] Received token:", token);
      if (token?.id) session.user.id = token.id;
      if (token?.profileData) session.user.profileData = token.profileData;
      session.user.name = token.name;
      session.user.email = token.email;
      // console.log("[Auth Callback: SESSION] Returning session:", session);
      return session;
    },

    // This jwt callback will now run after 'authorize' succeeds
    async jwt({ token, user, trigger }) {
      // console.log("[Auth Callback: JWT] Received token:", token);
      // console.log("[Auth Callback: JWT] Received user:", user);

      // 'user' object comes from the 'authorize' function on first login
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

      // Check if it's already enriched
      if (token.profileData) {
        // console.log("[Auth Callback: JWT] Token already enriched.");
        return token;
      }

      // Enrich the token from Firestore (this code is correct)
      // console.log(`[Auth Callback: JWT] Enriching token for userId: ${userId}`);
      try {
        const { db } = getAdminServices();
        const userDocRef = db.doc(`users/${userId}`);
        const userDocSnap = await userDocRef.get();

        if (userDocSnap.exists) {
          const userData = userDocSnap.data();
          token.id = userId;
          token.name = userData.displayName || userData.name || null;
          token.profileData = { ...userData, uid: userId };
          // console.log("[Auth Callback: JWT] SUCCESS: Token enriched.");
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
    // ... (same as before)
    signIn: "/",
    signOut: "/",
    error: "/",
    verifyRequest: "/",
    newUser: "/me",
  },
};

// This helper is correct and will now work
export async function getCurrentUser() {
  headers();
  // console.log(
  //   `[getCurrentUser] Secret (first 5): ${process.env.NEXTAUTH_SECRET?.substring(
  //     0,
  //     5
  //   )}`
  // );

  const session = await getServerSession(authOptions);

  if (!session || !session.user || !session.user.id) {
    console.log("[getCurrentUser] Session missing or user.id not found.");
    return null;
  }

  // console.log("[getCurrentUser] Found session for user.id:", session.user.id);
  const profileData = session.user.profileData || {};

  return {
    uid: session.user.id,
    name: session.user.name,
    email: session.user.email,
    ...profileData,
  };
}
