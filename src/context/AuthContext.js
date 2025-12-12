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
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";

// 🛑 IMPORTANT: ALL NEXTAUTH IMPORTS ARE REMOVED HERE
// (signOut, useSession, signIn, etc.)

import { getFirebaseAuth, getFirebaseDb } from "@/lib/firebase/firebase-client";
// import { createFirebaseCustomToken } from "@/lib/actions/authActions"; // Removed, as this was for NextAuth sync

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

  // Initialization is correct
  useEffect(() => {
    const initializeAuth = async () => {
      setAuth(await getFirebaseAuth());
    };
    initializeAuth();
  }, []);

  // 🛑 NextAuth state variables are removed (session, status)
  const [firebaseUser, setFirebaseUser] = useState(null);
  const [isUserLoading, setIsUserLoading] = useState(true); // Renamed from isFirebaseSyncing for clarity
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState(null);

  // 🟢 CLEANED UP USE EFFECT: Only listens to Firebase state changes
  useEffect(() => {
    if (!auth) return;

    // This listener is purely for Firebase client state
    const unsubscribe = onIdTokenChanged(auth, (user) => {
      setFirebaseUser(user);
      setIsUserLoading(false); // Authentication state is now resolved
    });

    return () => unsubscribe();
  }, [auth]);

  // --- Login Handler (Uses Firebase session API) ---
  const handleLogin = useCallback(
    async (email, password) => {
      if (!auth) {
        setAuthError("Auth service is not ready. Please wait.");
        return;
      }

      setAuthLoading(true);
      setAuthError(null);

      try {
        const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );

        const firebaseUser = userCredential.user;
        const idToken = await firebaseUser.getIdToken();

        // 1. Exchange the ID token for the secure session cookie (__session)
        const response = await fetch("/api/session/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ idToken }),
        });

        if (!response.ok) {
          const errorData = await response
            .json()
            .catch(() => ({ error: "Server session error" }));
          throw new Error(
            `Session establishment failed: ${
              errorData.error || "Unknown error"
            }`
          );
        }

        // 2. Success! Check for invitations and redirect.
        const db = getFirebaseDb();
        try {
          const summaryRef = doc(
            db,
            "users",
            firebaseUser.uid,
            "private",
            "summary"
          );
          const summarySnap = await getDoc(summaryRef);

          if (summarySnap.exists()) {
            const data = summarySnap.data();
            if (data.invitations && Object.keys(data.invitations).length > 0) {
              router.push("/me");
              return;
            }
          }
        } catch (redirErr) {
          console.warn("Redirect check failed", redirErr);
        }

        router.push("/");
      } catch (error) {
        console.error("handleLogin Error:", error);
        const errorCode = error.code || null;
        setAuthError(getFirebaseAuthErrorMessage(errorCode) || error.message);
        setFirebaseUser(null);
      } finally {
        setAuthLoading(false);
      }
    },
    [auth, router]
  );

  // --- Sign Up Handler (Uses Firebase session API) ---
  const handleSignUp = useCallback(
    async (email, password) => {
      setAuthLoading(true);
      setAuthError(null);
      try {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );

        const firebaseUser = userCredential.user;
        const idToken = await firebaseUser.getIdToken();

        // 1. Exchange the ID token for the secure session cookie
        const response = await fetch("/api/session/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ idToken }),
        });

        if (!response.ok) {
          const errorData = await response
            .json()
            .catch(() => ({ error: "Server session error" }));
          throw new Error(
            `Sign-up complete, but session failed: ${
              errorData.error || "Unknown error"
            }`
          );
        }
        // 2. Create user record in your database (e.g., Firestore 'users' collection)
        const userCreationResponse = await fetch("/api/me/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
          }),
        });

        if (!userCreationResponse.ok) {
          const errorData = await userCreationResponse
            .json()
            .catch(() => ({ error: "Server user creation error" }));
          throw new Error(
            `Sign-up complete, session established, but user record creation failed: ${
              errorData.error || "Unknown error"
            }`
          );
        }

        // 2. Success! Redirect home.
        router.push("/");
      } catch (error) {
        console.error("handleSignUp Error:", error.code, error.message);
        setAuthError(getFirebaseAuthErrorMessage(error.code) || error.message);
      } finally {
        setAuthLoading(false);
      }
    },
    [auth, router]
  );

  // --- Logout Handler (Clears Firebase cookie and client state) ---
  const handleLogout = useCallback(async () => {
    setAuthLoading(true);
    setAuthError(null);
    try {
      // 1. Sign out of Firebase Auth (clears the client state/token)
      await firebaseSignOut(auth);

      // 2. Call server endpoint to clear the secure session cookie (__session)
      await fetch("/api/session/logout", {
        method: "POST",
      });

      // 3. Explicitly set the client state to null immediately
      setFirebaseUser(null);

      router.push("/");
    } catch (error) {
      console.error("handleLogout Error:", error);

      // Attempt clean up, and clear the cookie client-side as a fallback
      setFirebaseUser(null);
      document.cookie = "__session=; Max-Age=0; path=/;";
      setAuthError(getFirebaseAuthErrorMessage(error.code) || error.message);
    } finally {
      setAuthLoading(false);
    }
  }, [auth, router, setFirebaseUser]);

  // The value provided to consuming components
  const value = useMemo(
    () => ({
      firebaseUser,
      isUserLoading,
      authLoading,
      authError,
      handleLogin,
      handleSignUp,
      handleLogout,
    }),
    [
      firebaseUser,
      isUserLoading,
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
