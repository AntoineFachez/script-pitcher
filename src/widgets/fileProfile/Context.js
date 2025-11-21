// file path: ~/DEVFOLD/SCRIPT-PITCHER/SRC/WIDGETS/FILEPROFILE/CONTEXT.JS

"use client";
import React, {
  createContext,
  useContext,
  useMemo,
  useState,
  useEffect,
} from "react";

const Context = createContext(null);

export const WidgetContext = ({ children }) => {
  const [data, setData] = useState(null);
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
