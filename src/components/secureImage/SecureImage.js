"use client";

import React, { useState, useEffect } from "react";
import { Box, CircularProgress, Alert } from "@mui/material";
import { useAuth } from "@/context/AuthContext";
import Image from "next/image";

/**
 * Renders an image from a GCS object path by fetching a
 * temporary Signed URL.
 * @param {string} gcsPath - The GCS object path (e.g., element.src)
 * @param {object} sx - MUI sx props to pass to the Box container
 */
export default function SecureImage({ gcsPath, sx }) {
  const { firebaseUser } = useAuth();
  const [signedUrl, setSignedUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!gcsPath || !firebaseUser) {
      setLoading(false);
      return;
    }

    let isMounted = true;
    setLoading(true);
    setError(null);

    const fetchSignedUrl = async () => {
      try {
        const idToken = await firebaseUser.getIdToken();
        const response = await fetch("/api/storage/getSignedUrl", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${idToken}`,
          },
          body: JSON.stringify({ gcsPath }),
        });

        if (!response.ok) {
          const err = await response.json();
          throw new Error(err.error || "Failed to get signed URL");
        }

        const { url } = await response.json();
        if (isMounted) {
          setSignedUrl(url);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchSignedUrl();

    return () => {
      isMounted = false; // Cleanup to prevent state updates on unmounted component
    };
  }, [gcsPath, firebaseUser]); // Re-fetch if path or user changes

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(0,0,0,0.1)",
        ...sx,
      }}
    >
      {loading && <CircularProgress size={20} />}
      {error && (
        <Alert severity="error" sx={{ fontSize: "0.75rem", padding: "0 4px" }}>
          !
        </Alert>
      )}
      {signedUrl && (
        <Image
          fill
          src={signedUrl}
          alt="Preview"
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      )}
    </Box>
  );
}
