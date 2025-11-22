// file path: ~/DEVFOLD/SCRIPT-PITCHER/SRC/COMPONENTS/IMAGEGALLERY/IMAGEGALLERY.JS

"use client";

import React, { useState, useEffect, useMemo } from "react";
// Import both 'db' (Firestore) and 'storage'

import {
  getFirebaseApp,
  getFirebaseDb,
  getFirebaseStorage,
} from "@/lib/firebase/firebase-client";
import { getStorage, ref, listAll, getDownloadURL } from "firebase/storage";
import { collection, getDocs, query } from "firebase/firestore";

// MUI Components
import {
  ImageList,
  ImageListItem,
  CircularProgress,
  Typography,
  Box,
} from "@mui/material";
import Image from "next/image";
import { useInFocus } from "@/context/InFocusContext";
import { useAuth } from "@/context/AuthContext";

/**
 * A component that fetches all file IDs from a Firestore subcollection
 * and then lists all images from corresponding Storage folders.
 */

const AllProjectImages = ({ setFormData, imageType }) => {
  const app = useMemo(() => getFirebaseApp(), []);
  const db = useMemo(() => getFirebaseDb(), []);
  const storage = useMemo(() => getFirebaseStorage(), []);
  const { firebaseUser } = useAuth();
  const { projectInFocus } = useInFocus();
  const [imageUrls, setImageUrls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const specificStorage = getStorage(
    app,
    "gs://script-pitcher-extracted-images"
  );

  useEffect(() => {
    const fetchAllImages = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log("Current User UID:", firebaseUser.uid);
        // --- Step 1: Query Firestore for all file doc IDs ---

        // Path to the 'files' subcollection
        const filesSubcollectionPath = `projects/${projectInFocus?.id}/files`;
        const filesSubcollectionRef = collection(db, filesSubcollectionPath);

        // Get all documents in that subcollection
        const querySnapshot = await getDocs(filesSubcollectionRef);

        // Extract just the document IDs (which we assume are the folder names)
        const folderNames = querySnapshot.docs.map((doc) => doc.id);

        if (folderNames.length === 0) {
          console.log("No file documents found in Firestore.");
          setLoading(false);
          return;
        }

        // --- Step 2: Fetch images from Storage for each folder ---

        // Create an array to hold all the individual URL-getter promises
        let allUrlPromises = [];

        // Loop through each folder name and create list/get promises
        for (const folderName of folderNames) {
          // The storage path MUST match the new rule structure
          const storagePath = `${folderName}`;
          const listRef = ref(specificStorage, storagePath);

          const res = await listAll(listRef);
          const folderUrlPromises = res.items.map((itemRef) =>
            getDownloadURL(itemRef)
          );
          allUrlPromises.push(...folderUrlPromises);
        }

        // --- Step 3: Wait for all promises to resolve ---
        const urls = await Promise.all(allUrlPromises);
        setImageUrls(urls);
      } catch (err) {
        console.error("Error fetching images:", err);
        setError("Failed to load images. Check console and security rules.");
      } finally {
        setLoading(false);
      }
    };

    fetchAllImages();
  }, [
    projectInFocus?.id,
    firebaseUser,
    db,
    specificStorage,
    imageUrls?.length,
  ]);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="200px"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Typography color="error" align="center" variant="h6">
        {error}
      </Typography>
    );
  }

  if (!loading && imageUrls.length === 0) {
    return (
      <Typography align="center" variant="subtitle1">
        No images found for this project.
      </Typography>
    );
  }

  return (
    <>
      <Box sx={{ width: "100%", height: "100%", overflowY: "scroll" }}>
        <ImageList variant="masonry" cols={3} gap={0}>
          {imageUrls.map((url) => (
            <ImageListItem
              key={url}
              sx={{
                display: "block",
                // position: 'relative' is not needed here
              }}
              onClick={() =>
                setFormData((prev) => ({
                  ...prev,
                  [imageType]: url,
                }))
              }
            >
              <Image
                width={500}
                height={500}
                src={url}
                alt={url}
                // 3. Add responsive styles
                style={{
                  width: "100%", // This makes it fit the column
                  height: "auto", // This makes it scale with the correct aspect ratio
                  objectFit: "cover",
                }}
              />
            </ImageListItem>
          ))}
        </ImageList>
      </Box>
    </>
  );
};

export default AllProjectImages;
