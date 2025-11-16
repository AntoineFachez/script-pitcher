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
    // 🛑 CRITICAL FIX: Define an inner async function
    const initializeAuth = async () => {
      setAuth(await getFirebaseAuth());
    };
    initializeAuth();
  }, []);

  // -----------------------
  // State for the user object and session loading
  // ✅ REFACTOR 1: Integrate NextAuth session for primary status
  const { data: session, status } = useSession();

  // State for the Firebase user object (used for SDK interaction and ID token refresh)
  const [firebaseUser, setFirebaseUser] = useState(null);

  const [isFirebaseSyncing, setIsFirebaseSyncing] = useState(true);

  // State for auth *actions* (login, signup, logout) (KEEP AS-IS)
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState(null);
  console.log("firebaseUser", firebaseUser);

  useEffect(() => {
    // This runs on mount and cleans up on unmount.
    if (!auth || status === "loading") return;

    // This listener fires on successful login, logout, and token refresh.
    const unsubscribe = onIdTokenChanged(auth, (user) => {
      console.log("Listener Fired. User:", !!user);
      setFirebaseUser(user);
      // 🛑 CRITICAL: This is the ONLY place that confirms the session is established.
      setIsFirebaseSyncing(false);
    });

    // Cleanup the listener
    return () => unsubscribe();
  }, [auth, status]); // Depends only on auth instance and NextAuth status

  // 2. --- SYNC INITIATOR EFFECT (Triggers the Custom Token Exchange) ---
  useEffect(() => {
    // Only proceed if NextAuth has confirmed a session AND Firebase user hasn't been set yet.
    if (!auth || status !== "authenticated" || firebaseUser) return;

    const syncFirebaseUser = async () => {
      try {
        const customToken = await createFirebaseCustomToken();
        if (customToken) {
          // This sign-in will trigger the onIdTokenChanged listener (Effect 1)
          await signInWithCustomToken(auth, customToken);
        } else {
          console.warn(
            "Sync failed: No custom token returned. Releasing lock."
          );
          setIsFirebaseSyncing(false); // Immediate failure release
        }
      } catch (err) {
        console.error(
          "Firebase Custom Token Sign-In failed, releasing lock:",
          err.message
        );
        setIsFirebaseSyncing(false); // Explicit failure release
        setAuthError(err.message);
      }
    };

    console.log(
      "SYNC KICKOFF: NextAuth Authenticated. Starting Firebase sync..."
    );
    syncFirebaseUser();

    // No cleanup function needed here, as the listener is handled by Effect 1.
  }, [auth, status, firebaseUser]); // Reruns if these change

  // 3. --- LOGOUT CLEANUP (Simplified) ---
  useEffect(() => {
    if (status === "unauthenticated" && !isFirebaseSyncing && firebaseUser) {
      // If NextAuth transitions to logged out, force Firebase state cleanup.
      setFirebaseUser(null);
    }
  }, [status, isFirebaseSyncing, firebaseUser]);

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
        const res = await fetch("/api/auth/session-sync", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ idToken }),
        });

        if (!res.ok) {
          throw new Error("Failed to sync session with NextAuth server.");
        }

        // ❌ REMOVE: setFirebaseUser(firebaseUser);
        // This causes the unstable state flicker.

        // ⭐️ FIX: Force a server-side refresh to read the newly set cookie.
        // This refresh will trigger the entire component lifecycle,
        // allowing the stable onIdTokenChanged listener to set the state.
        router.refresh();
      } catch (error) {
        // ... (error handling)
        setFirebaseUser(null); // Keep this on failure path
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
      isUserLoading: status === "loading" || isFirebaseSyncing,
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
      isFirebaseSyncing,
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
