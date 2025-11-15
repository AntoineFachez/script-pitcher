// file path: ~/DEVFOLD/SCRIPT-PITCHER/SRC/CONTEXT/PROJECTCONTEXT.JS

"use client";

import { createContext, useContext, useState, useEffect, useMemo } from "react";
import { collection, query, onSnapshot, orderBy } from "firebase/firestore";

import { getFirebaseDb } from "@/lib/firebase/firebase-client";
import { useAuth } from "./AuthContext";

const ProjectContext = createContext(null);

export function ProjectProvider({ projectId, children }) {
  const { firebaseUser } = useAuth();
  const [db, setDb] = useState(null);
  const [characters, setCharacters] = useState([]);
  const [episodes, setEpisodes] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const value = useMemo(
    () => ({
      characters,
      episodes,
      loading,
    }),
    [characters, episodes, loading]
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
