// file path: ~/DEVFOLD/SCRIPT-PITCHER/SRC/CONTEXT/USERCONTEXT.JS

"use client";
import { createContext, useContext, useState, useEffect, useMemo } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { useAuth } from "./AuthContext";
import { getFirebaseDb } from "@/lib/firebase/firebase-client";
import { useData } from "./DataContext";
// import { useData } from "./DataContext";

// 1. Create the context
const UserContext = createContext(null);

// 2. Create the Provider component
export function UserProvider({ documentId, children }) {
  const { firebaseUser, isUserLoading } = useAuth(); // 🛑 CHANGE: Pull in isUserLoading
  const [db, setDb] = useState(null);

  const [myProjects, setMyProjects] = useState({});
  const [lastFile, setLastFile] = useState(null);

  const [userProfile, setUserProfile] = useState(null);

  const [meInFocus, setMeInFocus] = useState(null);
  const [receivedInvitations, setReceivedInvitations] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setDb(getFirebaseDb());
  }, []);

  useEffect(() => {
    // 1. Reset everything if the user logs out
    if (!firebaseUser && !isUserLoading) {
      setIsLoading(false);
      setUserProfile(null);
      setMyProjects({});
      setLastFile(null);
      return;
    }

    if (!firebaseUser) {
      // If we are here, we must be loading, so just return
      return;
    }
    if (!db || !firebaseUser) {
      // <-- NOW DEPENDS ON 'db'
      // If we are waiting for user AND db, keep loading true.
      if (!firebaseUser && !db) {
        setLoading(false); // Can stop loading if neither are present
      }
      return;
    }
    setIsLoading(true);
    setError(null);

    // --- 2. FETCH STATIC DATA (Approach 2) ---
    // This fetches the user's name, email, etc. one time.
    const fetchUserProfile = async (userId) => {
      try {
        const userResponse = await fetch(`/api/users/${userId}`);
        if (!userResponse.ok) {
          throw new Error(
            `Failed to fetch user profile: ${userResponse.status}`
          );
        }
        const userData = await userResponse.json();
        setUserProfile(userData);
      } catch (err) {
        console.error("Error fetching user profile:", err);
        setError(err.message);
      }
    };

    // --- 3. SET UP REAL-TIME LISTENER (Approach 1) ---
    // This listens for live updates to the user's project list.
    const summaryDocRef = doc(
      db,
      "users",
      firebaseUser.uid,
      "private",
      "summary"
    );

    const unsubscribe = onSnapshot(
      summaryDocRef,
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          setReceivedInvitations(data.invitations || {});
          setMyProjects(data.projects || {});
          setLastFile(data.lastTouchedFile || null);
        } else {
          console.log("No summary doc found for this user yet.");
          setMyProjects({}); // Ensure it's an empty object if no doc
        }
        setIsLoading(false); // Stop loading *after* first snapshot
      },
      (snapshotError) => {
        // Handle snapshot errors
        console.error("Snapshot listener error:", snapshotError);
        setError(snapshotError.message);
        setIsLoading(false);
      }
    );

    // --- 4. RUN THE STATIC FETCH ---
    fetchUserProfile(firebaseUser.uid);

    // 5. Clean up the listener when the user logs out or component unmounts
    return () => unsubscribe();
  }, [firebaseUser, db, isUserLoading]); // Rerun if user or db instance changes

  // Memoize the context value to prevent unnecessary re-renders of consumers
  const value = useMemo(
    () => ({
      userProfile,
      lastFile,
      setLastFile,
      myProjects,
      setMyProjects,
      receivedInvitations,
      isLoading,
      error,
    }),
    [
      userProfile,
      myProjects,
      lastFile,
      setLastFile,
      receivedInvitations,
      isLoading,
      error,
    ]
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
