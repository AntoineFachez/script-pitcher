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
  // --- START FIX ---
  signInWithEmailAndPassword, // 👈 ADD THIS BACK
  // --- END FIX ---
  createUserWithEmailAndPassword,
  Auth,
  signInWithCustomToken,
} from "firebase/auth";
import { useRouter } from "next/navigation";

import {
  signOut as nextAuthSignOut,
  useSession,
  // --- START FIX ---
  signIn, // 👈 We still need this
  // --- END FIX ---
} from "next-auth/react";

import { getFirebaseAuth } from "@/lib/firebase/firebase-client";
import { createFirebaseCustomToken } from "@/lib/actions/authActions";

// (getFirebaseAuthErrorMessage helper remains the same)
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

  /** @type {[Auth | null, React.Dispatch<React.SetStateAction<Auth | null>>]} */
  const [auth, setAuth] = useState(null);

  // (This useEffect to set auth is correct)
  useEffect(() => {
    const initializeAuth = async () => {
      setAuth(await getFirebaseAuth());
    };
    initializeAuth();
  }, []);

  const { data: session, status } = useSession();
  const [firebaseUser, setFirebaseUser] = useState(null);
  const [isFirebaseSyncing, setIsFirebaseSyncing] = useState(true);
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState(null);

  // (This useEffect for sync remains the same)
  useEffect(() => {
    if (!auth || status === "loading") return;

    const unsubscribe = onIdTokenChanged(auth, (user) => {
      setFirebaseUser(user);
      setIsFirebaseSyncing(false);
    });

    const syncFirebaseUser = async () => {
      if (!auth.currentUser && status === "authenticated") {
        try {
          const customToken = await createFirebaseCustomToken();
          if (customToken) {
            await signInWithCustomToken(auth, customToken);
          } else {
            setIsFirebaseSyncing(false);
          }
        } catch (err) {
          setIsFirebaseSyncing(false);
        }
      } else if (status === "unauthenticated") {
        setIsFirebaseSyncing(false);
      }
    };
    syncFirebaseUser();
    return () => unsubscribe();
  }, [auth, status, router]);

  // --- START REFACTOR ---
  // Revert handleLogin to use Firebase client sign-in
  // AND THEN sync with NextAuth
  const handleLogin = useCallback(
    async (email, password) => {
      if (!auth) {
        console.error("Auth service is not initialized yet.");
        setAuthError("Auth service is not ready. Please wait.");
        return;
      }

      setAuthLoading(true);
      setAuthError(null);

      try {
        // 1. Sign in to Firebase on the CLIENT first
        const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );

        const firebaseUser = userCredential.user;

        // 2. Get the ID token from the successful Firebase login
        const idToken = await firebaseUser.getIdToken();

        // 3. Pass that token to NextAuth's 'credentials' provider
        const result = await signIn("credentials", {
          idToken: idToken,
          redirect: false, // We handle the redirect
        });

        // This log is no longer needed:
        // console.log("AuthContext.js:134 result", result);

        if (result.error) {
          // This error comes from NextAuth (e.g., token verification failed)
          throw new Error(result.error);
        }

        // 4. Success! Push to home page.
        // The 'useSession' hook will update, and the 'onIdTokenChanged'
        // listener will set the 'firebaseUser' state.
        router.push("/");
      } catch (error) {
        // This catch block now handles errors from BOTH
        // signInWithEmailAndPassword AND the NextAuth signIn
        console.error("handleLogin Error:", error);
        setAuthError(getFirebaseAuthErrorMessage(error.code));
        setFirebaseUser(null);
      } finally {
        setAuthLoading(false);
      }
    },
    [auth, router] // 👈 'auth' is now a dependency again
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
