// file path: ~/DEVFOLD/SCRIPT-PITCHER/SRC/CONTEXT/CRUDITEMCONTEXT.JS

"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from "react";
// Assuming this path is correct
import defaultProjectSchema from "@/lib/definitions/project.json";
import { useInFocus } from "./InFocusContext"; // Assuming this path is correct

// We'll use this key to save and load from local storage
const DRAFT_PROJECT_KEY = "crudProjectDraft";

const CrudContext = createContext(null);

// NOTE: We don't need this export anymore if we move all logic into useEffect.
// However, if other files use it, it remains safe.
function getDraftFromLocalStorage(key) {
  if (typeof window !== "undefined" && window.localStorage) {
    try {
      // Return the raw string, or null
      return window.localStorage.getItem(key);
    } catch (error) {
      // This catch block is defensive, localStorage operations can fail
      console.error("Failed to read draft from localStorage", error);
      return null;
    }
  }
  return null; // Server-side execution returns null
}

export function CrudProvider({ children }) {
  const { projectInFocus } = useInFocus();

  // 1. Initialize state with the server-safe default schema.
  // This runs on both the server (SSR) and the client.
  const [crudProject, setCrudProject] = useState(defaultProjectSchema);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 2. Use useEffect to handle initialization from localStorage (Client-side only)
  useEffect(() => {
    const savedDraftString = getDraftFromLocalStorage(DRAFT_PROJECT_KEY);

    if (savedDraftString) {
      try {
        const parsedDraft = JSON.parse(savedDraftString);
        // Only update state if a valid draft was found
        setCrudProject(parsedDraft);
      } catch (error) {
        console.error("Failed to parse saved draft:", error);
        // Optionally clear the corrupt draft
        window.localStorage.removeItem(DRAFT_PROJECT_KEY);
        // State remains at defaultProjectSchema
      }
    }
    // Dependencies: empty array ensures this only runs ONCE after client mount.
  }, []);

  // 3. This effect runs when 'crudProject' changes (to save the draft)
  useEffect(() => {
    // CRITICAL: Ensure we are on the client before attempting to use window.
    if (typeof window === "undefined") {
      return;
    }

    // Save the current draft to local storage
    try {
      window.localStorage.setItem(
        DRAFT_PROJECT_KEY,
        JSON.stringify(crudProject)
      );
    } catch (error) {
      console.error("Failed to save draft to localStorage", error);
    }
  }, [crudProject]);

  // A helper function to clear the draft after successful submission
  const clearCrudProjectDraft = useCallback(() => {
    // CRITICAL: Ensure we are on the client before attempting to use window.
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(DRAFT_PROJECT_KEY);
    }
    setCrudProject({});
  }, []);

  const value = useMemo(
    () => ({
      projectInFocus,
      crudProject,
      setCrudProject,
      clearCrudProjectDraft,
      loading,
      error,
      setError,
    }),
    [crudProject, projectInFocus, clearCrudProjectDraft, loading, error]
  );

  return <CrudContext.Provider value={value}>{children}</CrudContext.Provider>;
}

export function useCrud() {
  const context = useContext(CrudContext);
  if (!context) {
    throw new Error("useCrud must be used within a CrudProvider");
  }
  return context;
}
