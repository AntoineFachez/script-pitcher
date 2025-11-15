// file path: ~/DEVFOLD/SCRIPT-PITCHER/SRC/APP/USERS/CONTEXT.JS

"use client";
import React, {
  createContext,
  useContext,
  useMemo,
  useState,
  useEffect,
  useCallback,
} from "react";

import { useData } from "@/context/DataContext";
import { useInFocus } from "@/context/InFocusContext";
import { useUi } from "@/context/UiContext";
import { useUser } from "@/context/UserContext";

const Context = createContext(null);

export const WidgetContext = ({ children }) => {
  const { projects, users, rolesInProjects } = useData();

  const { showActiveUsers, toggleDetails } = useUi();
  const { setRoleInFocus } = useInFocus();
  const [data, setData] = useState(null);

  const [filteredData, setFilteredData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    // Ensure we have a collection and docId before trying to fetch.
    if (!collection || !docId) {
      setError("Collection name and document ID are required.");
      setIsLoading(false);
      return;
    }

    // Reset state for a new fetch operation.
    setIsLoading(true);
    setError(null);
    setData(null);

    try {
      // Construct the URL to your Next.js API route.
      // This is much cleaner and more secure than hitting the backend directly from the client.
      const response = await fetch(`/api/${collection}/${docId}`);

      // If the response is not OK (e.g., 404, 500), parse the error message.
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Error: ${response.status}`);
      }

      // If successful, parse the JSON data.
      const result = await response.json();

      setData(result);
    } catch (err) {
      // Catch any errors from the fetch operation or from parsing.
      setError(err.message);
      console.error("Failed to fetch widget data:", err);
    } finally {
      // This block runs regardless of success or failure.
      // Set loading to false once the operation is complete.
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!showActiveUsers) {
      setData(users);
    } else {
      const filterByActive = users.filter((user) => user.userActive === true);
      setData(filterByActive);
    }

    return () => {};
  }, [showActiveUsers, users]);

  const clearFilter = useCallback(() => {
    setRoleInFocus("");
    setFilteredData(data);
  }, [data]);

  useEffect(() => {
    setData(users);
    return () => {};
  }, [users]);
  useEffect(() => {
    setFilteredData(data);
    return () => {};
  }, [data]);

  const contextValue = useMemo(
    () => ({
      users,
      data,
      setData,
      filteredData,
      setFilteredData,
      // handleTogglePublishProject,
      clearFilter,
      toggleDetails,
    }),
    [
      users,
      data,
      setData,
      filteredData,
      setFilteredData,
      // handleTogglePublishProject,
      clearFilter,
      toggleDetails,
    ]
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
