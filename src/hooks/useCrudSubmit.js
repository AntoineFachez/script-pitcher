// src/hooks/useCrudSubmit.js
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

export function useCrudSubmit(endpointBase, crudMode, entityId, projectId) {
  const { firebaseUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState("");

  const submit = async (data) => {
    setLoading(true);
    setError(null);
    setSuccess("");

    if (!firebaseUser) {
      setError("You must be logged in.");
      setLoading(false);
      return false;
    }

    // Construct URL and Method
    const isUpdate = crudMode === "update";
    const url = isUpdate ? `${endpointBase}/${entityId}` : endpointBase;
    const method = isUpdate ? "PUT" : "POST";

    // Ensure Project ID exists for creation
    if (!isUpdate && !projectId) {
      setError("Project ID is missing.");
      setLoading(false);
      return false;
    }

    try {
      const payload = { ...data, projectId }; // Ensure projectId is attached

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${await firebaseUser.getIdToken()}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Operation failed");
      }

      setSuccess("Saved successfully!");
      return true; // Return success boolean
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { submit, loading, error, success, setSuccess, setError };
}
