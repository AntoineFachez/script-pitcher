// file path: ~/DEVFOLD/SCRIPT-PITCHER/SRC/CONTEXT/AUTHCONTEXT.JS

"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import {
  onIdTokenChanged,
  signOut as firebaseSignOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  Auth,
  signInWithCustomToken,
} from "firebase/auth";
import { useRouter } from "next/navigation";

import { signOut as nextAuthSignOut, useSession } from "next-auth/react";

import { getFirebaseAuth } from "@/lib/firebase/firebase-client";
import { createFirebaseCustomToken } from "@/lib/actions/authActions";

// Helper function to create user-friendly error messages
const getFirebaseAuthErrorMessage = (errorCode) => {
  switch (errorCode) {
    case "auth/user-not-found":
    case "auth/wrong-password":
    case "auth/invalid-credential":
      return "Invalid email or password.";
    case "auth/email-already-in-use":
      return "This email address is already in use.";
    case "auth/weak-password":
      return "Password should be at least 6 characters.";
    case "auth/too-many-requests":
      return "Access temporarily disabled due to too many requests. Please try again later.";
    default:
      return "An unknown error occurred. Please try again.";
  }
};

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const router = useRouter();

  // --- THIS IS THE FIX ---
  // 1. Initialize auth as null.
  // --- JSDoc FIX ---
  /** @type {[Auth | null, React.Dispatch<React.SetStateAction<Auth | null>>]} */
  const [auth, setAuth] = useState(null);

  // 2. Use useEffect to set the auth instance.
  // This hook ONLY runs on the client, after the component mounts.
  useEffect(() => {
    setAuth(getFirebaseAuth());
  }, []);
  // -----------------------
  // State for the user object and session loading
  // ✅ REFACTOR 1: Integrate NextAuth session for primary status
  const { data: session, status } = useSession();

  // State for the Firebase user object (used for SDK interaction and ID token refresh)
  const [firebaseUser, setFirebaseUser] = useState(null);

  // ❌ REFACTOR 2: Removed isUserLoading state. Use NextAuth 'status' instead.
  // const [isUserLoading, setIsUserLoading] = useState(true);

  // State for auth *actions* (login, signup, logout) (KEEP AS-IS)
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    // 1. Only run if we have the Firebase auth instance and NextAuth status is authenticated
    if (!auth || status !== "authenticated" || firebaseUser) return;

    // We only sign in with custom token if the user is authenticated via NextAuth
    // AND we don't already have a firebaseUser (to prevent infinite loops)

    const syncFirebaseUser = async () => {
      try {
        // Call the Server Action to get the token
        const { token, error } = await createFirebaseCustomToken();

        if (token) {
          // 2. Use the token to sign the user into the Firebase client SDK
          // This will trigger the 'onIdTokenChanged' listener below!
          await signInWithCustomToken(auth, token);
          console.log(
            "Successfully signed into Firebase Client SDK via custom token."
          );
          // Now, the onIdTokenChanged listener will fire with the actual 'user' object.
        } else {
          console.error("Token sync failed:", error);
        }
      } catch (err) {
        console.error("Firebase Custom Token Sign-In failed:", err);
      }
    };

    syncFirebaseUser();

    // NOTE: We don't need a cleanup function here for this effect.
  }, [auth, status, firebaseUser]); // Dependencies: auth instance, NextAuth status, existing firebaseUser

  // ✅ REFACTOR 3: Listener for Firebase onIdTokenChanged
  // We keep this listener because it is the only way to:
  // 1. Get the actual Firebase Auth user object needed for SDK calls (like signIn/signOut).
  // 2. Keep the Firebase ID Token fresh (needed for backend functions/APIs).
  useEffect(() => {
    if (!auth || status === "loading") return; // Wait for NextAuth session status

    // If NextAuth says the user is unauthenticated, ensure Firebase state is null
    if (status === "unauthenticated") {
      setFirebaseUser(null);
      // NOTE: We don't need to sign out of Firebase here, as the user is already logged out.
      return;
    }

    // Listen for changes to the Firebase Auth state
    const unsubscribe = onIdTokenChanged(auth, (user) => {
      console.log(user);

      // This listener handles both login and token refresh
      setFirebaseUser(user);
      // ❌ Removed setting loading state here, relying on NextAuth 'status'
    });

    return () => unsubscribe();
  }, [auth, status]);

  // --- Auth Functions ---
  const handleLogin = useCallback(
    async (email, password) => {
      setAuthLoading(true);
      setAuthError(null);
      try {
        // 1. Firebase Sign-In (Creates the necessary ID Token)
        const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );
        const firebaseUser = userCredential.user;

        // 2. Get the current Firebase ID Token
        const idToken = await firebaseUser.getIdToken();

        // 3. CRITICAL: Call the API Route to set the NextAuth session cookie
        // This MUST happen after a successful Firebase login to make NextAuth aware.
        const res = await fetch("/api/auth/session-sync", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ idToken }),
        });

        if (!res.ok) {
          throw new Error("Failed to sync session with NextAuth server.");
        }

        // 4. Explicitly set client state (as fixed earlier)
        setFirebaseUser(firebaseUser);

        // ⭐️ FIX: Force a server-side refresh to read the newly set cookie
        router.refresh();

        // NextAuth's useSession hook will now update its status from 'unauthenticated'
        // to 'authenticated' on the client side, and a session cookie is set for the server.
      } catch (error) {
        // ... (error handling)
        setFirebaseUser(null);
      } finally {
        setAuthLoading(false);
      }
    },
    [auth, setFirebaseUser]
  );

  const handleSignUp = useCallback(
    async (email, password) => {
      setAuthLoading(true);
      setAuthError(null);
      try {
        await createUserWithEmailAndPassword(auth, email, password);
        // Success! The onIdTokenChanged listener will handle the rest.
      } catch (error) {
        console.error("Sign up failed:", error.code);
        setAuthError(getFirebaseAuthErrorMessage(error.code));
      } finally {
        setAuthLoading(false);
      }
    },
    [auth]
  );

  const handleLogout = useCallback(async () => {
    setAuthLoading(true);
    setAuthError(null);
    try {
      // 1. Sign out of NextAuth (clears the secure session cookie/database entry)
      await nextAuthSignOut({ redirect: false });

      // 2. Sign out of Firebase Auth (clears the Firebase user state/token)
      await firebaseSignOut(auth);

      // ✅ CRITICAL FIX: Explicitly set the client state to null immediately
      setFirebaseUser(null);

      router.push("/");
    } catch (error) {
      console.error("Logout failed:", error);
      // Ensure we attempt to clear the client state even on error,
      // as one of the sign-outs might have succeeded.
      setFirebaseUser(null);
      setAuthError(getFirebaseAuthErrorMessage(error.code));
    } finally {
      setAuthLoading(false);
    }
  }, [auth, router, setFirebaseUser]); // Ensure setFirebaseUser is in dependencies

  // The value provided to consuming components
  const value = useMemo(
    () => ({
      firebaseUser,
      // ✅ ADDED: Expose a boolean status based on NextAuth loading state
      isUserLoading: status === "loading",
      // Expose the raw NextAuth status for more granular control if needed
      authStatus: status,
      authLoading,
      authError,
      handleLogin,
      handleSignUp,
      handleLogout,
    }),
    [
      firebaseUser,
      status, // 👈 New dependency
      authLoading,
      authError,
      handleLogin,
      handleSignUp,
      handleLogout,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook to consume the context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
