// file path: ~/DEVFOLD/SCRIPT-PITCHER/SRC/COMPONENTS/SECUREIMAGE/SECUREIMAGE.JS

"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Box, CircularProgress, Alert } from "@mui/material";
import { useAuth } from "@/context/AuthContext";
import CircularIndeterminate from "../progress/CircularIndeterminate";

/**
 * Renders an image from a GCS object path by fetching a
 * temporary Signed URL.
 * @param {string} gcsPath - The GCS object path (e.g., element.src)
 * @param {object} sx - MUI sx props to pass to the Box container
 */
export default function SecureImage({ gcsPath, sx = {} }) {
  console.log("gcsPath", gcsPath);
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
        console.log("gcsPath", response);

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
          console.log("gcsPath", err);
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
  console.log("gcsPath", signedUrl);
  //TODO: Fix the url that is not readable from the route.js "https://storage.googleapis.com/script-pitcher.firebasestorage.app/gs%3A//script-pitcher-extracted-images/00af5fcd-48b3-4e62-9579-c35b6577e864/page1_img0.jpeg?GoogleAccessId=firebase-adminsdk-fbsvc%40script-pitcher.iam.gserviceaccount.com&Expires=1764052812&Signature=EiZs5L8nT2dxgVoQBixjXt4j7KzNiWPOjnY%2FCT93jmaGkfL3oAhiD4%2BUcA%2BtagA15Aa10lqdUJhSsCLulW0CHpJzNUKbylGSCs0KGMahtuW3WloRawDbaqJCMJaIhH3yPZVJAD2xun5naD5mUS8bYhaFM8jKIdl7zrJLs01bmG6E%2Fvdd5vyuxiOnM4lQsZyAtB4Os6lXFGDERu28jda774DbfWZdUvFsVHsKycs9vh4xYRUT915xwXiZ%2BDSJsoGlr0QoaJ1f2AZJD60weVDfNneKoarRre7qwiKJU4qgKqersUAp07zjLvhI5e1%2Bzs6D%2Bi2VdNyoZWce6Ed1qzNHAA%3D%3D"
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
      {loading && <CircularIndeterminate color="primary" />}
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
