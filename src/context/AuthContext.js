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

// import {
//   signOut as nextAuthSignOut,
//   useSession,
//   // --- START FIX ---
//   signIn, // 👈 We still need this
//   // --- END FIX ---
// } from "next-auth/react";

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

  // const { data: session, status } = useSession();
  const [firebaseUser, setFirebaseUser] = useState(null);
  const [isFirebaseSyncing, setIsFirebaseSyncing] = useState(true);
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState(null);

  // 🛑 RE-ACTIVATE AND SIMPLIFY THIS USE EFFECT
  useEffect(() => {
    if (!auth) return;

    // This listener is purely for Firebase client state, not NextAuth sync
    const unsubscribe = onIdTokenChanged(auth, (user) => {
      setFirebaseUser(user);
      setIsFirebaseSyncing(false);
    });

    // The entire syncFirebaseUser logic (creating custom token/signInWithCustomToken)
    // must be REMOVED as it relies on the flawed NextAuth synchronization.

    // Immediately set syncing to false if user is null/ready
    if (!auth.currentUser) setIsFirebaseSyncing(false);

    return () => unsubscribe();
  }, [auth]); // Status is removed from dependency array

  // (This useEffect for sync remains the same)
  // useEffect(() => {
  //   if (!auth || status === "loading") return;

  //   const unsubscribe = onIdTokenChanged(auth, (user) => {
  //     setFirebaseUser(user);
  //     setIsFirebaseSyncing(false);
  //   });

  //   const syncFirebaseUser = async () => {
  //     if (!auth.currentUser && status === "authenticated") {
  //       try {
  //         const customToken = await createFirebaseCustomToken();
  //         if (customToken) {
  //           await signInWithCustomToken(auth, customToken);
  //         } else {
  //           setIsFirebaseSyncing(false);
  //         }
  //       } catch (err) {
  //         setIsFirebaseSyncing(false);
  //       }
  //     } else if (status === "unauthenticated") {
  //       setIsFirebaseSyncing(false);
  //     }
  //   };
  //   syncFirebaseUser();
  //   return () => unsubscribe();
  // }, [auth, status, router]);

  // --- START REFACTOR ---
  // Revert handleLogin to use Firebase client sign-in
  // AND THEN sync with NextAuth
  // const handleLogin = useCallback(
  //   async (email, password) => {
  //     if (!auth) {
  //       console.error("Auth service is not initialized yet.");
  //       setAuthError("Auth service is not ready. Please wait.");
  //       return;
  //     }

  //     setAuthLoading(true);
  //     setAuthError(null);

  //     try {
  //       // 1. Sign in to Firebase on the CLIENT first
  //       const userCredential = await signInWithEmailAndPassword(
  //         auth,
  //         email,
  //         password
  //       );

  //       const firebaseUser = userCredential.user;

  //       // 2. Get the ID token from the successful Firebase login
  //       const idToken = await firebaseUser.getIdToken();

  //       // 3. Pass that token to NextAuth's 'credentials' provider
  //       const result = await signIn("credentials", {
  //         idToken: idToken,
  //         redirect: false, // We handle the redirect
  //       });

  //       // This log is no longer needed:
  //       // console.log("AuthContext.js:134 result", result);

  //       if (result.error) {
  //         // This error comes from NextAuth (e.g., token verification failed)
  //         throw new Error(result.error);
  //       }

  //       // 4. Success! Push to home page.
  //       // The 'useSession' hook will update, and the 'onIdTokenChanged'
  //       // listener will set the 'firebaseUser' state.
  //       router.push("/");
  //     } catch (error) {
  //       // This catch block now handles errors from BOTH
  //       // signInWithEmailAndPassword AND the NextAuth signIn
  //       console.error("handleLogin Error:", error);
  //       setAuthError(getFirebaseAuthErrorMessage(error.code));
  //       setFirebaseUser(null);
  //     } finally {
  //       setAuthLoading(false);
  //     }
  //   },
  //   [auth, router] // 👈 'auth' is now a dependency again
  // );
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

        // 3. 🟢 NEW: Exchange the ID token for the secure session cookie
        const response = await fetch("/api/session/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ idToken }),
        });

        if (!response.ok) {
          // If the server failed to set the cookie, throw an error
          const errorData = await response
            .json()
            .catch(() => ({ error: "Server session error" }));
          throw new Error(
            `Session establishment failed: ${
              errorData.error || "Unknown error"
            }`
          );
        }

        // 4. Success! Secure session cookie is set. Redirect home.
        // The subsequent server-side request for '/' will now successfully read the __session cookie.
        router.push("/");
      } catch (error) {
        // This catch block handles errors from Firebase, token fetching, or the API call.
        console.error("handleLogin Error:", error);

        // Safely extract the Firebase error message if available
        const errorCode = error.code || null;
        setAuthError(getFirebaseAuthErrorMessage(errorCode) || error.message);
        setFirebaseUser(null);
      } finally {
        setAuthLoading(false);
      }
    },
    [auth, router]
  );

  const handleSignUp = useCallback(
    async (email, password) => {
      setAuthLoading(true);
      setAuthError(null);
      try {
        // 1. Create user on the client side
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );

        const firebaseUser = userCredential.user;

        // 2. Get the ID token for the new user
        const idToken = await firebaseUser.getIdToken();

        // 3. 🟢 NEW: Exchange the ID token for the secure session cookie
        const response = await fetch("/api/session/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ idToken }),
        });

        if (!response.ok) {
          // If the server failed to set the cookie, throw an error
          const errorData = await response
            .json()
            .catch(() => ({ error: "Server session error" }));
          throw new Error(
            `Sign-up complete, but session failed: ${
              errorData.error || "Unknown error"
            }`
          );
        }

        // 4. Success! Session cookie is set. Redirect home.
        router.push("/");
      } catch (error) {
        console.error("handleSignUp Error:", error.code, error.message);

        // Handle client-side error (e.g., email already in use)
        setAuthError(getFirebaseAuthErrorMessage(error.code) || error.message);
      } finally {
        setAuthLoading(false);
      }
    },
    [auth, router] // Added router to dependencies
  );

  const handleLogout = useCallback(async () => {
    setAuthLoading(true);
    setAuthError(null);
    try {
      // 1. Sign out of Firebase Auth (clears the client state/token)
      await firebaseSignOut(auth);

      // 2. 🟢 NEW: Call server endpoint to clear the secure session cookie (__session)
      // This is now a simple POST request, eliminating the complex NextAuth utility calls.
      await fetch("/api/session/logout", {
        method: "POST",
      });

      // 3. Explicitly set the client state to null immediately
      setFirebaseUser(null);

      router.push("/");
    } catch (error) {
      console.error("handleLogout Error:", error);

      // Ensure we attempt to clear the client state even on error, and clear the cookie client-side
      setFirebaseUser(null);
      document.cookie = "__session=; Max-Age=0; path=/;";
      setAuthError(getFirebaseAuthErrorMessage(error.code) || error.message);
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
