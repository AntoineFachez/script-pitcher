// file path: ~/DEVFOLD/SCRIPT-PITCHER/SRC/WIDGETS/FILEPROFILE/WIDGET.JS

"use client";

import React, { useRef } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Button,
  Alert,
  IconButton,
} from "@mui/material";
import { Edit } from "@mui/icons-material";

import { useFile } from "@/context/FileContext";
import { useUi } from "@/context/UiContext";

import BasicDrawer from "@/components/drawer/Drawer";
import PdfViewer from "@/components/pdfviewer/PdfViewer";
import ProfileHeader from "@/components/profileHeader/ProfileHeader";
import DownloadFileButton from "@/components/downloadButton/DownloadButton";

import ElementList from "@/widgets/fileProfile/ElementsList";
import BackButton from "@/components/backButton/BackButton";
import { backButtonStyles } from "@/theme/muiProps";

/**
 * This component consumes the DocumentContext and renders the UI.
 * It shows loading, error, and success states.
 */
export default function Widget({ togglePublishProject }) {
  const { orientationDrawer, handleToggleDrawer } = useUi();
  const { projectId, fileData, loading, error, handleDeleteElement } =
    useFile();
  const containerRef = useRef();
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
  const menu = (
    <>
      <Box
        sx={{
          width: "100%",
          display: "flex",
          flexFlow: "row nowrap",
          justifyContent: "flex-end",
          alignItems: "center",
          pr: "2rem",
        }}
      >
        <IconButton
          onClick={(e) => {
            // setSelectedImageUrlContext("bannerUrl");
            handleToggleDrawer("bottom", true)(e);
          }}
          sx={{}}
        >
          <Edit />
        </IconButton>{" "}
        <DownloadFileButton
          storagePath={fileData.storagePath}
          fileName={fileData.fileName} // Assuming fileData holds the original name
          projectId={projectId}
          fileId={fileData.fileId}
        />
      </Box>
    </>
  );
  const buildDescription = <>{"filePurpose: " + fileData.filePurpose}</>;

  return (
    <>
      <BackButton sx={backButtonStyles} />
      <Box
        ref={containerRef}
        className="pdfviewer"
        sx={{
          position: "relative",
          width: "100%",
          // 🔑 FIX: Set height to 100% of the viewport or container.
          // Using '100vh' or 'calc' is safer than just '100%'.
          // height: "100vh", // Change to 100% of the viewport for testing, or use a calculated height
          height: "100%", // Change to 100% of the viewport for testing, or use a calculated height
          // display: "flex",
          // flexFlow: "column nowrap",
          overflowY: "scroll", // Use overflowY for vertical scroll
          overflowX: "hidden",
          // overflow: "hidden",
          // gap: 2,
        }}
      >
        <ProfileHeader
          containerRef={containerRef}
          bannerImageUrl={"projectInFocus?.bannerUrl"}
          avatarImageUrl={
            "projectInFocus?.avatarUrl || projectInFocus?.imageUrl"
          }
          menu={menu}
          titleText={fileData.fileName || "Untitled Document"}
          descriptionText={buildDescription || "No description."}
        />
        <PdfViewer containerRef={containerRef} />
      </Box>{" "}
      <BasicDrawer
        handleToggleDrawer={handleToggleDrawer}
        orientationDrawer={orientationDrawer}
        // menu={menu}
        // goBack={goBack}
        // list={list}
        element={drawerContent}
      />
    </>
  );
}
