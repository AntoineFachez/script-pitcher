// file path: ~/DEVFOLD/SCRIPT-PITCHER/SRC/LIB/AUTH/AUTH.JS

import { getServerSession } from "next-auth/next";
import { authConfig } from "./auth.config";
import { getAdminServices } from "../firebase/firebase-admin";

/**
 * These are your full NextAuth options.
 * We are extending the basic authConfig with callbacks to handle the
 * integration with Firebase.
 */
export const authOptions = {
  ...authConfig, // Spread in your providers (Google, etc.)
  callbacks: {
    /**
     * This callback is called whenever a JSON Web Token is created (i.e., at sign-in)
     * or updated (i.e., whenever a session is accessed in the client).
     * We use this to persist the Firebase UID in the token.
     */
    async jwt({ token, user, account }) {
      // On initial sign-in, `user` and `account` are available.
      if (user && account) {
        const { db, auth } = getAdminServices();
        const { uid, email, name, picture } = user;

        // Update or create the user in Firebase Admin
        // This is an "upsert" operation.
        await auth.updateUser(uid, {
          email,
          displayName: name,
          photoURL: picture,
        });

        // Store the Firebase UID in the JWT token.
        token.uid = uid;
      }
      return token;
    },

    /**
     * The session callback is called whenever a session is checked.
     * We use this to add the Firebase UID to the `session.user` object.
     */
    async session({ session, token }) {
      if (session.user && token.uid) {
        session.user.uid = token.uid;
      }
      return session;
    },
  },
};

/**
 * A server-side utility to get the currently authenticated user.
 * This is the function you should use in Server Components and API Routes.
 * It securely reads the session from the request cookies.
 */
export const getCurrentUser = async () => {
  const session = await getServerSession(authOptions);
  return session?.user ?? null;
};
