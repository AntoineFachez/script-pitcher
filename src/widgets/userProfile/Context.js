// file path: ~/DEVFOLD/SCRIPT-PITCHER/SRC/WIDGETS/USERPROFILE/CONTEXT.JS

"use client";
import React, {
  createContext,
  useContext,
  useMemo,
  useState,
  useEffect,
} from "react";
import { useAuth } from "@/context/AuthContext";

const Context = createContext(null);

export const WidgetContext = ({ children }) => {
  const { firebaseUser } = useAuth();
  const [data, setData] = useState(userProfile);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    return () => {};
  }, []);

  const contextValue = useMemo(
    () => ({
      data,
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
