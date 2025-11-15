// file path: ~/DEVFOLD/SCRIPT-PITCHER/SRC/CONTEXT/APPCONTEXT.JS

"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { createContext, useContext } from "react";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const activityTimeoutRef = useRef(null);
  const [appContext, setAppContext] = useState(false);

  const [isUserActive, setIsUserActive] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleUserActivity = useCallback(() => {
    setIsUserActive(true);

    if (activityTimeoutRef.current) {
      clearTimeout(activityTimeoutRef.current);
    }

    activityTimeoutRef.current = setTimeout(() => {
      setIsUserActive(false);
    }, 3000);
  }, []);
  useEffect(() => {
    handleUserActivity();

    document.addEventListener("mousemove", handleUserActivity);
    document.addEventListener("keydown", handleUserActivity);
    document.addEventListener("click", handleUserActivity);

    return () => {
      if (activityTimeoutRef.current) {
        clearTimeout(activityTimeoutRef.current);
      }
      document.removeEventListener("mousemove", handleUserActivity);
      document.removeEventListener("keydown", handleUserActivity);
      document.removeEventListener("click", handleUserActivity);
    };
  }, [handleUserActivity]);
  useEffect(() => {
    return () => {};
  }, [appContext]);

  const contextValue = {
    appContext,
    setAppContext,
    isUserActive,
    setIsUserActive,
    loading,
    setLoading,
  };
  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
};

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider.");
  }
  return context;
}
