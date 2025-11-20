// file path: ~/DEVFOLD/SCRIPT-PITCHER/SRC/CONTEXT/PROJECTCONTEXT.JS

"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import { collection, query, onSnapshot, orderBy } from "firebase/firestore";

import { getFirebaseDb } from "@/lib/firebase/firebase-client";
import { useAuth } from "./AuthContext";
import { useData } from "./DataContext";

import { toggleProjectPublishState } from "@/lib/actions/projectActions";
import { useInFocus } from "./InFocusContext";

const ProjectContext = createContext(null);

export function ProjectProvider({ projectId, children }) {
  const { firebaseUser } = useAuth();
  const { projects, setProjects } = useData();
  const { setProjectInFocus } = useInFocus();

  const [db, setDb] = useState(null);
  const [invitations, setInvitations] = useState([]);
  const [characters, setCharacters] = useState([]);
  const [episodes, setEpisodes] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleTogglePublishProject = useCallback(
    // CRITICAL: Accept setProjectInFocus as an argument
    async (projectId, currentPublishedState, setProjectInFocus) => {
      const newPublishedState = !currentPublishedState;

      // 1. Optimistic UI update (GLOBAL projects list)
      setProjects((prevProjects) =>
        (prevProjects || []).map((p) =>
          p.id === projectId ? { ...p, published: newPublishedState } : p
        )
      );

      // 2. Optimistic UI update for the CURRENT project view
      // This immediately updates the project detail page for a better UX.
      if (setProjectInFocus) {
        setProjectInFocus((prev) =>
          // FIX: Correct syntax for updating a property in the object
          prev ? { ...prev, published: newPublishedState } : null
        );
      }

      try {
        // 3. Call the Server Action (toggleProjectPublishState)
        const result = await toggleProjectPublishState(
          projectId,
          newPublishedState
        );

        if (result?.error) {
          throw new Error(result.error);
        }

        // 4. Success: No rollback needed, optimistic updates stay.
      } catch (error) {
        // 5. Rollback GLOBAL state on error
        console.error("Failed to update publish state:", error);
        setProjects((prevProjects) =>
          (prevProjects || []).map((p) =>
            p.id === projectId ? { ...p, published: currentPublishedState } : p
          )
        );

        // 6. Rollback LOCAL state on error
        if (setProjectInFocus) {
          setProjectInFocus((prev) =>
            prev ? { ...prev, published: currentPublishedState } : null
          );
        }

        // Re-throw error so the calling component can display an error notification
        throw error;
      }
    },
    // Dependency array must include setProjects and any other external references
    // If toggleProjectPublishState is a dependency, include it here too.
    [setProjects /*, toggleProjectPublishState */]
  );

  useEffect(() => {
    setDb(getFirebaseDb());
  }, []);

  // Listener for Characters
  useEffect(() => {
    if (!projectId) return;

    if (!db || !firebaseUser) {
      // <-- NOW DEPENDS ON 'db'
      // If we are waiting for user AND db, keep loading true.
      if (!firebaseUser && !db) {
        setLoading(false); // Can stop loading if neither are present
      }
      return;
    }
    setLoading(true);
    const charColRef = collection(db, "projects", projectId, "characters");
    const q = query(charColRef, orderBy("orderIndex", "asc"));

    // onSnapshot is the real-time listener
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const charsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCharacters(charsData);
        setLoading(false);
      },
      (error) => {
        console.error("Error listening to characters:", error);
        setLoading(false);
      }
    );

    // Cleanup function to detach the listener
    return () => unsubscribe();
  }, [db, projectId, firebaseUser]);

  // Listener for Episodes
  useEffect(() => {
    if (!firebaseUser || !projectId) return;
    if (!db || !firebaseUser) {
      // This check correctly ensures db is available
      if (!firebaseUser && !db) {
        setLoading(false);
      }
      return;
    }
    setLoading(true);
    const epColRef = collection(db, "projects", projectId, "episodes");
    const q = query(epColRef, orderBy("orderIndex", "asc"));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const epsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setEpisodes(epsData);
        setLoading(false);
      },
      (error) => {
        console.error("Error listening to episodes:", error);
        setLoading(false);
      }
    );

    // Cleanup function
    return () => unsubscribe();
  }, [db, projectId, firebaseUser]);

  // Listener for Invitations
  useEffect(() => {
    if (!firebaseUser || !projectId) return;
    if (!db || !firebaseUser) {
      // This check correctly ensures db is available
      if (!firebaseUser && !db) {
        setLoading(false);
      }
      return;
    }
    setLoading(true);
    const invitColRef = collection(db, "projects", projectId, "invitations");

    // ⭐ CHANGE THIS LINE: Use 'createdAt' instead of 'orderIndex'
    const q = query(invitColRef, orderBy("createdAt", "asc"));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const invitData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setInvitations(invitData);
        setLoading(false);
      },
      (error) => {
        console.error("Error listening to invitations:", error);
        setLoading(false);
      }
    );

    // Cleanup function
    return () => unsubscribe();
  }, [db, projectId, firebaseUser]);

  const value = useMemo(
    () => ({
      invitations,
      characters,
      episodes,
      handleTogglePublishProject,
      loading,
    }),
    [invitations, characters, episodes, handleTogglePublishProject, loading]
  );

  return (
    <ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>
  );
}

export function useProject() {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error("useProject must be used within a ProjectProvider");
  }
  return context;
}
