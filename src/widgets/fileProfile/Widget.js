// file path: ~/DEVFOLD/SCRIPT-PITCHER/SRC/APP/PROJECTS/[PROJECTID]/FILES/[FILEID]/DOCUMENTCLIENT.JS

"use client";

import React from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Button,
  Alert,
  IconButton,
} from "@mui/material";

import { useFile } from "@/context/FileContext";
import { useUi } from "@/context/UiContext";

import BasicDrawer from "@/components/drawer/Drawer";
import PdfViewer from "@/components/pdfviewer/PdfViewer";

import ElementList from "@/widgets/fileProfile/ElementsList";
import { Edit } from "@mui/icons-material";
import ProfileHeader from "@/components/profileHeader/ProfileHeader";
import ProfileMenu from "@/components/menus/ProfileMenu";
import { useApp } from "@/context/AppContext";
import { useInFocus } from "@/context/InFocusContext";
import DownloadFileButton from "@/components/downloadButton/DownloadButton";

/**
 * This component consumes the DocumentContext and renders the UI.
 * It shows loading, error, and success states.
 */
export default function Widget({ togglePublishProject }) {
  // 3. Get all data and actions from the context hook
  const { appContext, setAppContext } = useApp();
  const { fileInFocus } = useInFocus();
  const {
    modalContent,
    setModalContent,
    openModal,
    setOpenModal,
    orientationDrawer,
    handleToggleDrawer,
  } = useUi();
  const { fileData, loading, error, handleDeleteElement } = useFile();
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
        />
      </Box>
    </>
  );
  console.log(fileData);
  const buildDescription = <>{"filePurpose: " + fileData.filePurpose}</>;
  return (
    <Box>
      <ProfileHeader
        bannerImageUrl={"projectInFocus?.bannerUrl"}
        avatarImageUrl={"projectInFocus?.avatarUrl || projectInFocus?.imageUrl"}
        menu={menu}
        titleText={fileData.fileName || "Untitled Document"}
        descriptionText={buildDescription || "No description."}
      />
      <Box
        sx={{
          height: "100%",
          display: "flex",
          flexFlow: "row nowrap",
          overflow: "hidden",
        }}
      >
        <PdfViewer />
        <BasicDrawer
          handleToggleDrawer={handleToggleDrawer}
          orientationDrawer={orientationDrawer}
          // menu={menu}
          // goBack={goBack}
          // list={list}
          element={drawerContent}
        />
      </Box>
    </Box>
  );
}
