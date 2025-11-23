// file path: ~/DEVFOLD/SCRIPT-PITCHER/SRC/WIDGETS/DASHBOARD/CONTEXT.JS

"use client";
import { useInFocus } from "@/context/InFocusContext";
import React, {
  createContext,
  useContext,
  useMemo,
  useState,
  useEffect,
} from "react";

const Context = createContext(null);

export const WidgetContext = ({ children }) => {
  const {} = useInFocus();
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

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
