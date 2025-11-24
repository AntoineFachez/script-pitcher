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
import { useInFocus } from "@/context/InFocusContext";

const Context = createContext(null);

export const WidgetContext = ({ children, userProfile }) => {
  const { firebaseUser } = useAuth();
  const { userInFocus, setUserInFocus } = useInFocus();
  const [data, setData] = useState(userProfile);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setUserInFocus(userProfile);
    return () => {};
  }, [userProfile]);

  const contextValue = useMemo(
    () => ({
      data,
      userInFocus,
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
