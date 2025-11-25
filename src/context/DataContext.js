// file path: ~/DEVFOLD/SCRIPT-PITCHER/SRC/CONTEXT/DATACONTEXT.JS

"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from "react";

import { toggleProjectPublishState } from "@/lib/actions/projectActions";
import { useUser } from "./UserContext";
const DataContext = createContext(null);

export function DataProvider({ children, serverProjects, serverUsers }) {
  const { lastFile } = useUser();
  const [projects, setProjects] = useState(serverProjects);
  const [users, setUsers] = useState(serverUsers);

  const [rolesInProjects, setRolesInProjects] = useState(null);
  const [integratedProjects, setIntegratedProjects] = useState(null);
  const [uniqueGenres, setUniqueGenres] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleTogglePublishProject = useCallback(
    async (projectId, currentPublishedState) => {
      const newPublishedState = !currentPublishedState;

      // 1. Optimistic UI update (GLOBAL projects list)
      setProjects((prevProjects) =>
        (prevProjects || []).map((p) =>
          p.id === projectId ? { ...p, published: newPublishedState } : p
        )
      );
      try {
        // 2. Call the Server Action
        const result = await toggleProjectPublishState(
          projectId,
          newPublishedState
        );
        if (result?.error) {
          throw new Error(result.error);
        }
        // 3. Success: No action needed, database is updated.
      } catch (error) {
        // 4. Rollback GLOBAL state on error
        console.error("Failed to update publish state:", error);
        setProjects((prevProjects) =>
          (prevProjects || []).map((p) =>
            p.id === projectId ? { ...p, published: currentPublishedState } : p
          )
        );
        // Re-throw error so the calling component (Project.js) can show a notification
        throw error;
      }
    },
    [setProjects]
  );
  const handleToggleUserAccessProject = useCallback(
    async (userId, currentActiveInProjectState) => {},
    []
  );
  const handleTogglePublishFile = useCallback(
    async (fileId, currentActiveInProjectState) => {},
    []
  );

  const value = useMemo(
    () => ({
      projects,
      setProjects,
      lastFile,
      rolesInProjects,
      users,
      setUsers,
      integratedProjects,
      uniqueGenres,
      setUniqueGenres,
      handleTogglePublishProject,
      handleToggleUserAccessProject,
      handleTogglePublishFile,
      loading,
      error,
    }),
    [
      projects,
      setProjects,
      lastFile,
      rolesInProjects,
      users,
      setUsers,
      integratedProjects,
      uniqueGenres,
      setUniqueGenres,
      handleTogglePublishProject,
      handleToggleUserAccessProject,
      handleTogglePublishFile,
      loading,
      error,
    ]
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
}
