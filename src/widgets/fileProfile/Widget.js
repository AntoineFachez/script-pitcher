// file path: ~/DEVFOLD/SCRIPT-PITCHER/SRC/WIDGETS/FILEPROFILE/WIDGET.JS

"use client";

import React, { useEffect, useRef } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Button,
  Alert,
  IconButton,
} from "@mui/material";
import { Edit } from "@mui/icons-material";

import { useFile, FileProvider } from "@/context/FileContext";
import { useUi } from "@/context/UiContext";

import BasicDrawer from "@/components/drawer/Drawer";

import ProfileHeader from "@/components/profileHeader/ProfileHeader";
import DownloadFileButton from "@/components/downloadButton/DownloadButton";

import ElementList from "@/widgets/fileProfile/ElementsList";
import BackButton from "@/components/backButton/BackButton";
import { useApp } from "@/context/AppContext";
import PdfViewer from "@/components/pdfviewer/PDFViewer";

import { SoundtrackProvider, useSoundtrack } from "@/context/SoundtrackContext";
// import SoundtrackPanel from "@/widgets/soundtrack/SoundtrackPanel";
// import TrackSelector from "@/widgets/soundtrack/TrackSelector";

/**
 * This component consumes the DocumentContext and renders the UI.
 * It shows loading, error, and success states.
 */
function WidgetContent({ togglePublishProject }) {
  const { setAppContext } = useApp();
  const { orientationDrawer, handleToggleDrawer } = useUi();
  const { projectId, fileData, loading, error, handleDeleteElement } =
    useFile();

  // Soundtrack Context
  const { addAnchor } = useSoundtrack();
  const [selectorOpen, setSelectorOpen] = React.useState(false);
  const [selectedElementId, setSelectedElementId] = React.useState(null);

  const containerRef = useRef();
  useEffect(() => {
    setAppContext("files");

    return () => {};
  }, []);

  const handleElementClick = (elementId) => {
    // We can add a check for isEditing here if needed, or rely on the caller
    setSelectedElementId(elementId);
    setSelectorOpen(true);
  };

  const handleTrackSelect = (track) => {
    addAnchor({
      elementId: selectedElementId,
      trackUri: track.uri,
      trackName: track.name,
      offsetMs: 0,
    });
    setSelectorOpen(false);
    setSelectedElementId(null);
  };

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
      <BackButton />
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
        {/* 
        //TODO: move Spotify connection to a dedicated component "FileEditor"
        <SoundtrackPanel />
        <TrackSelector
          open={selectorOpen}
          onClose={() => setSelectorOpen(false)}
          onSelect={handleTrackSelect}
        />
      */}

        <PdfViewer
          containerRef={containerRef}
          onElementClick={handleElementClick}
        />
        {/* TODO: Create a second layer that renders the pages_to_png.py as a background layer of the PDFViewer
        
         */}
      </Box>{" "}
      <BasicDrawer
        handleToggleDrawer={handleToggleDrawer}
        orientationDrawer={orientationDrawer}
        // menu={menu}
        // goBack={goBack}
        // list={list}
        element={drawerContent}
        anchor="bottom"
      />
    </>
  );
}

export default function Widget(props) {
  // We need to access fileData here to pass it to SoundtrackProvider.
  // However, useFile is used inside WidgetContent.
  // We should probably move the Provider inside WidgetContent or lift useFile up.
  // Actually, WidgetContent uses useFile which is provided by FileProvider (which is likely higher up in the tree, in page.js).
  // So we can use useFile here if we are inside FileProvider.

  // Wait, Widget is the default export. Let's check where FileProvider is.
  // Usually it's in the page.js.

  return <WidgetContentWrapper {...props} />;
}

function WidgetContentWrapper(props) {
  const { fileData } = useFile();
  return (
    <>
      <SoundtrackProvider initialData={fileData}>
        <WidgetContent {...props} />
      </SoundtrackProvider>
    </>
  );
}
