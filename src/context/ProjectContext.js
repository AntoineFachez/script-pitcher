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
import {
  collection,
  query,
  onSnapshot,
  orderBy,
  doc,
} from "firebase/firestore";

import { fetchProjectMembersAction } from "@/lib/actions/projectActions";

import { getFirebaseDb } from "@/lib/firebase/firebase-client";
import { DB_PATHS } from "@/lib/firebase/paths";
import { useAuth } from "./AuthContext";
import { useData } from "./DataContext";

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

  useEffect(() => {
    setDb(getFirebaseDb());
  }, []);

  useEffect(() => {
    if (!db || !projectId || !firebaseUser) return;

    // Use onSnapshot to listen for changes to the single project document
    const projectDocRef = doc(db, DB_PATHS.project(projectId));

    const unsubscribe = onSnapshot(
      projectDocRef,
      async (docSnap) => {
        if (docSnap.exists()) {
          const projectData = { id: docSnap.id, ...docSnap.data() };

          // Hydrate members from user profiles
          // Hydrate members from user profiles
          let membersArray = [];
          if (projectData.members) {
            const memberIds = Object.keys(projectData.members);
            if (memberIds.length > 0) {
              try {
                // Call Server Action to fetch profiles (bypasses client rules)
                const res = await fetchProjectMembersAction(memberIds);
                const userProfiles = res.success ? res.members : [];

                membersArray = userProfiles.map((userData) => {
                  return {
                    // uid is already in userData from the action
                    ...userData,
                    role: projectData.members[userData.uid], // The role object from project doc
                  };
                });

                // Serialize role timestamp if necessary
                membersArray = membersArray.map((m) => ({
                  ...m,
                  role: {
                    ...m.role,
                    joinedAt: m.role?.joinedAt?.toDate
                      ? m.role.joinedAt.toDate().toISOString()
                      : m.role?.joinedAt,
                  },
                }));
              } catch (err) {
                console.error("Error fetching member profiles:", err);
              }
            }
          }

          // 1. Update project in focus immediately
          setProjectInFocus((prev) =>
            // Ensures the project is updated and timestamps are serialized
            projectData
              ? {
                  ...projectData,
                  createdAt:
                    projectData?.createdAt?.toDate().toISOString() || null,
                  updatedAt:
                    projectData?.updatedAt?.toDate().toISOString() || null,
                  members: membersArray, // Use the hydrated array
                }
              : null
          );

          // 2. Update the global projects list (less critical, but good practice)
          setProjects((prevProjects) =>
            (prevProjects || []).map((p) =>
              p.id === projectId
                ? { ...p, published: projectData.published }
                : p
            )
          );
        } else {
          setProjectInFocus(null);
        }
      },
      (error) => {
        console.error("Error listening to project document:", error);
      }
    );

    return () => unsubscribe();
  }, [db, projectId, firebaseUser, setProjectInFocus, setProjects]); // Add setProjects as dependency

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
    const charColRef = collection(
      db,
      DB_PATHS.project(projectId),
      "characters"
    );
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
    const epColRef = collection(db, DB_PATHS.project(projectId), "episodes");
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
    const invitColRef = collection(
      db,
      DB_PATHS.project(projectId),
      "invitations"
    );

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
      loading,
    }),
    [invitations, characters, episodes, loading]
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
