// file path: ~/DEVFOLD/SCRIPT-PITCHER/SRC/APP/VIEW/NEWSCRIPTFORM.JS

"use client";

import { useState } from "react"; // Removed unused 'useMemo'
import {
  Box,
  TextField,
  Button,
  Paper,
  Typography,
  LinearProgress,
  Alert,
} from "@mui/material";
import { Save } from "@mui/icons-material";
// Removed unused 'Timestamp', 'ref', 'uploadBytesResumable', 'getFirebaseAuth'

import { useAuth } from "@/context/AuthContext";
import { useCrud } from "@/context/CrudItemContext";
import { formProps, formTitleProps } from "./formStyles";

export default function AddFileForm({ widgetConfig }) {
  const { firebaseUser } = useAuth();
  const { projectInFocus, error, setError } = useCrud();
  const [filePurpose, setFilePurpose] = useState("");
  const [file, setFile] = useState(null);

  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [success, setSuccess] = useState("");

  // Removed unused getClientTimestamp()

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!firebaseUser) {
      setError("You must be logged in.");
      return;
    }

    // --- FIX 2: Check for .id, not .projectId ---
    const currentProjectId = projectInFocus?.id;

    if (!file || !currentProjectId || !filePurpose) {
      setError("A project, file, and file purpose are required.");
      return;
    }
    if (file.type !== "application/pdf") {
      setError("Only PDF files are allowed.");
      return;
    }

    setIsUploading(true);
    setError("");
    setSuccess("");

    const fileMetadata = {
      filePurpose: filePurpose,
      fileName: file.name,
      fileType: file.type,
      fileSize: file.size,
    };

    try {
      // 1. Call the API
      const metaResponse = await fetch("/api/uploads/initiate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${await firebaseUser.getIdToken()}`,
        },
        body: JSON.stringify({
          projectId: currentProjectId, // <-- FIX 2: Send the correct ID
          fileMetadata: fileMetadata,
        }),
      });

      if (!metaResponse.ok) {
        const errorData = await metaResponse.json();
        throw new Error(errorData.error || "Failed to prepare file metadata.");
      }

      const { signedUrl } = await metaResponse.json();

      // --- FIX 1: USE XMLHTTPREQUEST FOR PROGRESS TRACKING ---
      const xhr = new XMLHttpRequest();
      xhr.open("PUT", signedUrl, true);
      xhr.setRequestHeader("Content-Type", file.type);

      // This logic now updates your progress bar
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const progress = (event.loaded / event.total) * 100;
          setUploadProgress(progress);
        }
      };

      // This handles success
      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          setSuccess(
            `Successfully added "${file.name}". It is now being processed.`
          );
          setIsUploading(false);
          setFilePurpose("");
          setFile(null);
          setUploadProgress(0);
        } else {
          setError("File upload failed. Server responded with: " + xhr.status);
          setIsUploading(false);
        }
      };

      // This handles network errors
      xhr.onerror = () => {
        setError("Upload failed. Network error.");
        setIsUploading(false);
      };

      xhr.send(file);
      // --- END OF FIX 1 ---
    } catch (err) {
      setError(err.message);
      setIsUploading(false);
    }
  };

  return (
    <Paper
      className={`${formProps.className}__${widgetConfig?.context}`}
      component="form"
      onSubmit={handleSubmit}
      {...formProps}
    >
      <Box sx={{ width: "100%", display: "flex", flexFlow: "row wrap" }}>
        <Typography gutterBottom {...formTitleProps}>
          Add File to Project: {projectInFocus?.title}
        </Typography>
      </Box>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <TextField
          label="File Purpose"
          variant="outlined"
          value={filePurpose}
          onChange={(e) => setFilePurpose(e.target.value)}
          required
        />
        <Button variant="contained" component="label">
          Select PDF
          <input
            type="file"
            accept="application/pdf"
            hidden
            onChange={handleFileChange}
          />
        </Button>
        {file && (
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            Selected: {file.name}
          </Typography>
        )}
        {isUploading && (
          <Box sx={{ width: "100%", mt: 1 }}>
            <LinearProgress variant="determinate" value={uploadProgress} />
            <Typography variant="caption" display="block" textAlign="center">
              {Math.round(uploadProgress)}%
            </Typography>
          </Box>
        )}
        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity="success" sx={{ mt: 2 }}>
            {success}
          </Alert>
        )}
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={isUploading || !file}
          sx={{ mt: 2 }}
          startIcon={<Save />}
        >
          {/* --- FIX 2: Use projectInFocus.id for the label --- */}
          {isUploading ? "Uploading..." : !file ? "Add PDF" : `Submit`}
        </Button>{" "}
      </Box>
    </Paper>
  );
}
