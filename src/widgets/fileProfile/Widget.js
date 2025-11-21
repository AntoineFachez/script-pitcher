// file path: ~/DEVFOLD/SCRIPT-PITCHER/SRC/APP/PROJECTS/[PROJECTID]/FILES/[FILEID]/DOCUMENTCLIENT.JS

"use client";

import React from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Button,
  Alert,
} from "@mui/material";

import { useFile } from "@/context/FileContext";
import { useUi } from "@/context/UiContext";

import BasicDrawer from "@/components/drawer/Drawer";
import PdfViewer from "@/components/pdfviewer/PdfViewer";

import ElementList from "@/widgets/fileProfile/ElementsList";

/**
 * This component consumes the DocumentContext and renders the UI.
 * It shows loading, error, and success states.
 */
export default function Widget() {
  // 3. Get all data and actions from the context hook
  const { fileData, loading, error, handleDeleteElement } = useFile();
  const { orientationDrawer, handleToggleDrawer } = useUi();
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
  if (!fileData) {
    return <Alert severity="info">No file data found.</Alert>;
  }

  const drawerContent = (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        maxHeight: "50vh",
        overflowY: "scroll",
      }}
    >
      <ElementList />
    </Box>
  );
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        {fileData.title || "Untitled Document"}
      </Typography>

      <Typography variant="body1" gutterBottom>
        {fileData.description || "No description."}
      </Typography>
      <Box
        sx={{
          height: "100%",
          display: "flex",
          flexFlow: "row nowrap",
          overflow: "hidden",
        }}
      >
        {" "}
        <BasicDrawer
          handleToggleDrawer={handleToggleDrawer}
          orientationDrawer={orientationDrawer}
          // menu={menu}
          // goBack={goBack}
          // list={list}
          element={drawerContent}
        />
        <PdfViewer />
      </Box>
    </Box>
  );
}
