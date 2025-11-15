// file path: ~/DEVFOLD/SCRIPT-PITCHER/SRC/APP/PROJECTS/[PROJECTID]/FILES/[FILEID]/DOCUMENTCLIENT.JS

"use client";

import React from "react";
import { useDocument } from "@/context/DocumentContext";
import {
  Box,
  Typography,
  CircularProgress,
  Button,
  Alert,
} from "@mui/material";
import PdfViewer from "@/components/pdfviewer/PdfViewer";
import ElementList from "@/app/projects/[projectId]/files/[fileId]/ElementsList";

/**
 * This component consumes the DocumentContext and renders the UI.
 * It shows loading, error, and success states.
 */
export default function DocumentClient() {
  // 3. Get all data and actions from the context hook
  const { documentData, loading, error, handleDeleteElement } = useDocument();

  // 4. Handle the loading state
  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "80vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // 5. Handle the error state
  if (error) {
    return <Alert severity="error">Error: {error}</Alert>;
  }

  // 6. Handle the success state (data is loaded)
  if (!documentData) {
    return <Alert severity="info">No document data found.</Alert>;
  }

  // 7. Render the actual document UI
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        {documentData.title || "Untitled Document"}
      </Typography>

      <Typography variant="body1" gutterBottom>
        {documentData.description || "No description."}
      </Typography>
      <Box
        sx={{
          height: "100%",
          display: "flex",
          flexFlow: "row nowrap",
          overflow: "hidden",
        }}
      >
        <ElementList />
        <PdfViewer />
      </Box>
    </Box>
  );
}
