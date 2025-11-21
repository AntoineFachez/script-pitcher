// file path: ~/DEVFOLD/SCRIPT-PITCHER/SRC/COMPONENTS/DOWNLOADBUTTON/DOWNLOADBUTTON.JS

"use client";
import React from "react";
import { Button, Typography } from "@mui/material";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { useAuth } from "@/context/AuthContext"; // Assuming useAuth is accessible

/**
 * Button component that generates a signed URL for file download.
 * @param {string} storagePath - The GCS object path (fileData.storagePath).
 * @param {string} fileName - The original file name for the download header.
 */
export default function DownloadFileButton({ storagePath, fileName }) {
  const { firebaseUser } = useAuth();

  const handleDownload = async () => {
    if (!storagePath || !firebaseUser) {
      alert("Missing file path or user authentication.");
      return;
    }

    try {
      // 1. Request signed URL from the new server endpoint
      const idToken = await firebaseUser.getIdToken();
      const response = await fetch("/api/storage/download", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        // Send the storage path and the desired filename
        body: JSON.stringify({ gcsPath: storagePath, fileName }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate download URL.");
      }

      const { downloadUrl } = await response.json();

      // 2. Trigger download: The browser handles the download since the
      //    URL is signed and includes the Content-Disposition header.
      window.location.href = downloadUrl;
    } catch (error) {
      console.error("Download failed:", error);
      alert(`Download Error: ${error.message}`);
    }
  };

  return (
    <>
      <Typography variant="subtitle1" color="text.secondary">
        <Button
          aria-label="publish"
          onClick={handleDownload}
          variant="outlined"
          startIcon={<FileDownloadIcon />}
          sx={{
            color: "action.main",
          }}
          disabled={!storagePath}
        >
          Download File
        </Button>
      </Typography>
      {/* <Button
        variant="contained"
        onClick={handleDownload}
        startIcon={<FileDownloadIcon />}
        disabled={!storagePath}
        sx={{ mt: 2 }} // Add margin for spacing
      >
        Download File
      </Button> */}
    </>
  );
}
