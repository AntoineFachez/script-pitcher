// file path: ~/DEVFOLD/SCRIPT-PITCHER/SRC/CONTEXT/DOCUMENTCONTEXT.JS

"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import { useAuth } from "./AuthContext";

// 1. Create the context
const DocumentContext = createContext(null);

// 2. Create the Provider component
// --- FIX 1: Pass `projectId` and `fileId` from page params ---
export function DocumentProvider({ projectId, fileId, children }) {
  const { firebaseUser } = useAuth(); // Renamed to firebaseUser for clarity
  const [documentData, setDocumentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch the main document data
  useEffect(() => {
    // --- FIX 2: Check for all required props AND the user ---
    if (!projectId || !fileId) {
      setLoading(false);
      setError("No document ID provided.");
      return;
    }
    if (!firebaseUser) {
      setLoading(true); // Waiting for user
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // --- FIX 3: Build query correctly ---
        const query = new URLSearchParams({
          projectId,
          fileId,
        }).toString();

        // --- FIX 4: Send Authorization header ---
        const idToken = await firebaseUser.getIdToken();
        const response = await fetch(`/api/document?${query}`, {
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || `Failed to fetch document`);
        }
        setDocumentData(await response.json());
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    // --- FIX 5: Add all dependencies ---
  }, [projectId, fileId, firebaseUser]);

  // The function to handle deleting an element
  const handleDeleteElement = useCallback(
    async (elementSrc) => {
      // --- FIX 6: Use `projectId` prop for the API call ---
      let fileName;
      try {
        const bucketName = "script-pitcher-extracted-images/";
        // Split the URL by the bucket name and take the second part
        fileName = elementSrc.split(bucketName)[1];

        if (!fileName) {
          throw new Error("Could not parse file name from URL.");
        }
      } catch (err) {
        console.error("Error parsing URL:", elementSrc, err);
        alert("Error: Could not identify file to delete.");
        return;
      }

      // Note: window.confirm is bad UX. Consider a modal.
      if (
        !window.confirm(
          `Are you sure you want to delete "${fileName}"? This cannot be undone.`
        )
      ) {
        return;
      }

      const oldDocumentData = documentData;

      try {
        // --- CORRECTED OPTIMISTIC UI UPDATE ---
        setDocumentData((currentData) => {
          // 1. Go inside 'processedData'
          const updatedPages = currentData?.processedData?.pages?.map(
            (page) => {
              return {
                ...page,
                elements: page.elements.filter((el) => el.src !== elementSrc),
              };
            }
          );

          // 2. Return the new state with the correct structure
          return {
            ...currentData,
            processedData: {
              ...currentData.processedData,
              pages: updatedPages,
            },
          };
        });
        // --- RE-RENDER IS TRIGGERED ---

        const idToken = await firebaseUser.getIdToken();
        const response = await fetch("/api/storage/delete", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${idToken}`,
          },
          body: JSON.stringify({ fileName, projectId, fileId }),
        });

        if (!response.ok) {
          throw new Error("Failed to delete the element on the server.");
        }

        // If successful, do nothing. The optimistic state is correct.
      } catch (err) {
        // --- ROLLBACK ON FAILURE ---
        // If the API call fails, revert to the old state
        alert(`Error: ${err.message}. Reverting changes.`);
        setDocumentData(oldDocumentData); // <-- This triggers another re-render
      }
    },
    [firebaseUser, projectId, fileId, documentData]
  );

  const value = useMemo(
    () => ({
      documentData,
      loading,
      error,
      handleDeleteElement,
    }),
    [documentData, loading, error, handleDeleteElement] // FIX 8: Add handler
  );

  return (
    <DocumentContext.Provider value={value}>
      {children}
    </DocumentContext.Provider>
  );
}

export function useDocument() {
  const context = useContext(DocumentContext);
  if (!context) {
    throw new Error("useDocument must be used within a DocumentProvider");
  }
  return context;
}
