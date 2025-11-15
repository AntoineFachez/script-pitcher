// file path: ~/DEVFOLD/SCRIPT-PITCHER/SRC/CONTEXT/INFOCUSCONTEXT.JS

"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import { useData } from "./DataContext";

// 1. Create the context
const InFocusContext = createContext(null);

// 2. Create the Provider component
export function InFocusProvider({ children }) {
  const { projects, users, rolesInProjects } = useData();
  const [data, setData] = useState(null);

  const [projectInFocus, setProjectInFocus] = useState(null);
  const [fileInFocus, setFileInFocus] = useState(null);

  const [genreInFocus, setGenreInFocus] = useState("");

  const [userInFocus, setUserInFocus] = useState(null);
  const [userInFocusWithProjects, setUserInFocusWithProjects] = useState(null);
  const [roleInFocus, setRoleInFocus] = useState("");

  const [characterInFocus, setCharacterInFocus] = useState(null);
  const [episodeInFocus, setEpisodeInFocus] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleSetUserInFocusById = useCallback(
    (userId) => {
      const foundUser = users.find((user) => user.userId === userId);
      setUserInFocus(foundUser);
    },
    [users, setUserInFocus]
  );

  // useEffect(() => {
  //   const knitData = getProjectsForUser(userInFocus, rolesInProjects, projects);

  //   setUserInFocusWithProjects(knitData);

  //   return () => {};
  // }, [userInFocus, projects, rolesInProjects]);

  useEffect(() => {
    return () => {};
  }, [projectInFocus]);

  useEffect(() => {
    return () => {};
  }, [projectInFocus]);

  const value = useMemo(
    () => ({
      data,
      projectInFocus,
      setProjectInFocus,
      fileInFocus,
      setFileInFocus,
      genreInFocus,
      setGenreInFocus,
      characterInFocus,
      setCharacterInFocus,
      episodeInFocus,
      setEpisodeInFocus,
      userInFocus,
      setUserInFocus,
      roleInFocus,
      setRoleInFocus,
      userInFocusWithProjects,
      setUserInFocusWithProjects,
      handleSetUserInFocusById,
      loading,
      error,
    }),
    [
      data,
      projectInFocus,
      setProjectInFocus,
      fileInFocus,
      setFileInFocus,
      genreInFocus,
      setGenreInFocus,
      characterInFocus,
      setCharacterInFocus,
      episodeInFocus,
      setEpisodeInFocus,
      userInFocus,
      setUserInFocus,
      roleInFocus,
      setRoleInFocus,
      userInFocusWithProjects,
      setUserInFocusWithProjects,
      handleSetUserInFocusById,
      loading,
      error,
    ]
  );

  return (
    <InFocusContext.Provider value={value}>{children}</InFocusContext.Provider>
  );
}

export function useInFocus() {
  const context = useContext(InFocusContext);
  if (!context) {
    throw new Error("useUi must be used within a UiProvider");
  }
  return context;
}
