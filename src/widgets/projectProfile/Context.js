// file path: ~/DEVFOLD/SCRIPT-PITCHER/SRC/APP/ME/CONTEXT.JS

"use client";
import { useInFocus } from "@/context/InFocusContext";
import { useProject } from "@/context/ProjectContext";
import React, {
  createContext,
  useContext,
  useMemo,
  useState,
  useEffect,
} from "react";

const Context = createContext(null);

export const WidgetContext = ({ children }) => {
  const { handleTogglePublishProject } = useProject();
  const { projectInFocus, setProjectInFocus } = useInFocus();
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const togglePublishProject = async () => {
    // 1. Get the current state (before the change)
    const currentPublishedState = projectInFocus?.published;

    try {
      // 2. Call the GLOBAL handler (now passing setProjectInFocus)
      await handleTogglePublishProject(
        projectInFocus?.id,
        currentPublishedState,
        // CRITICAL CHANGE: Pass the local state setter
        setProjectInFocus
      );
    } catch (error) {
      console.error("Failed to toggle project state:", error.message);
      // Show an error toast/snackbar here if needed.
    }
  };

  useEffect(() => {
    return () => {};
  }, []);

  const contextValue = useMemo(
    () => ({
      data,
      togglePublishProject,
      isLoading,
      error,
    }),
    [data, isLoading, error]
  );

  return <Context.Provider value={contextValue}>{children}</Context.Provider>;
};

export const useWidgetContext = () => {
  const context = useContext(Context);
  if (context === null) {
    throw new Error("useWidgetContext must be used within a WidgetContext.");
  }
  return context;
};
