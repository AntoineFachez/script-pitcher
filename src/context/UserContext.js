// file path: ~/DEVFOLD/SCRIPT-PITCHER/SRC/CONTEXT/USERCONTEXT.JS

"use client";
import { createContext, useContext, useState, useEffect, useMemo } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { useAuth } from "./AuthContext";
import { getFirebaseDb } from "@/lib/firebase/firebase-client";

// 1. Create the context
const UserContext = createContext(null);

// 2. Create the Provider component
// The 'meData' prop is the key to hydrating this client component with SSR data.
export function UserProvider({ children, meData }) {
  const { firebaseUser } = useAuth(); // Authentication state is managed by AuthContext
  const [db, setDb] = useState(null);

  // --- 1. STATE INITIALIZATION (Hydrated from SSR) ---

  // User Profile: Initialized by the SC, listened to in real-time below.
  const [userProfile, setUserProfile] = useState(meData?.userProfile || null);

  // Dynamic Data (from private/summary): Initialized by SC array, updated via listener map->array conversion.
  const [receivedInvitations, setReceivedInvitations] = useState(
    meData?.receivedInvitations || []
  );

  // Project data and last file touched are real-time, but SC didn't provide initial values here.
  const [myProjects, setMyProjects] = useState({});
  const [lastFile, setLastFile] = useState(null);

  // Loading/Error state for the CONTEXT ITSELF (i.e., listeners establishing connection)
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  // --- END STATE INITIALIZATION ---

  // Initialize Client-side Firestore DB instance once
  useEffect(() => {
    setDb(getFirebaseDb());
  }, []);

  // --- 2. REAL-TIME SYNCHRONIZATION (Core Logic) ---
  useEffect(() => {
    // 🛑 STOP LISTENING: If user logs out, clear state and return.
    if (!firebaseUser) {
      setIsLoading(false);
      setUserProfile(null);
      setReceivedInvitations([]);
      setMyProjects({});
      return;
    }

    // Stop if the Client DB instance hasn't initialized yet
    if (!db) return;

    // We set loading true to show that the real-time connection is being established.
    setIsLoading(true);
    setError(null);

    // --- A. Real-time Listener for Dynamic User Summary Data ---
    // This watches the 'private/summary' doc where dynamic data (like projects and invites) reside.
    const summaryDocRef = doc(
      db,
      "users",
      firebaseUser.uid,
      "private",
      "summary"
    );

    const unsubscribeSummary = onSnapshot(
      summaryDocRef,
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          const rawInvitationsMap = data.invitations || {};

          // ⭐ CENTRALIZED ARRAY CONVERSION: Transform the raw Firestore Map (object)
          // into the consistent Array format expected by rendering components.
          const invitationsArray = Object.keys(rawInvitationsMap).map(
            (token) => ({
              id: token,
              ...rawInvitationsMap[token],
            })
          );

          setReceivedInvitations(invitationsArray);
          setMyProjects(data.projects || {});
          setLastFile(data.lastTouchedFile || null);
        } else {
          console.log("No summary doc found for this user yet.");
          setMyProjects({});
          setReceivedInvitations([]);
        }
        setIsLoading(false); // Connection established, stop loading
      },
      (snapshotError) => {
        console.error("User Summary Snapshot listener error:", snapshotError);
        setError(snapshotError.message);
        setIsLoading(false);
      }
    );

    // --- B. Real-time Listener for Static User Profile Data ---
    // This keeps the userProfile state updated if they change name, avatar, etc.,
    // even though the initial value came from the SC fetch.
    const profileDocRef = doc(db, "users", firebaseUser.uid);
    const unsubscribeProfile = onSnapshot(profileDocRef, (docSnap) => {
      if (docSnap.exists()) {
        setUserProfile(docSnap.data());
      }
    });

    // 4. Clean up both listeners when the component unmounts or dependencies change
    return () => {
      unsubscribeSummary();
      unsubscribeProfile();
    };
  }, [firebaseUser, db]);
  // --- END REAL-TIME SYNCHRONIZATION ---

  // --- 3. EXPORT VALUE MEMOIZATION ---
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
