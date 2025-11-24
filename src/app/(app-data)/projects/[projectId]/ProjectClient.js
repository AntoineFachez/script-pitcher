// file path: ~/DEVFOLD/SCRIPT-PITCHER/SRC/APP/PROJECTS/[PROJECTID]/PROJECTCLIENT.JS

"use client";
import React, { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import { doc, onSnapshot, collection } from "firebase/firestore";

import { getFirebaseDb } from "@/lib/firebase/firebase-client";

import { useApp } from "@/context/AppContext";
import { useData } from "@/context/DataContext";
import { useInFocus } from "@/context/InFocusContext";
import { useUi } from "@/context/UiContext";

import WidgetIndex from "@/widgets/projectProfile";
import CrudItem from "@/widgets/crudItem";
import { pageMainStyles } from "@/theme/muiProps";

export default function ProjectClient({ initialProject, initialFiles }) {
  const projectId = initialProject?.id;
  const db = getFirebaseDb();

  const { appContext, setAppContext } = useApp();
  const { projectInFocus, setProjectInFocus } = useInFocus(initialProject);
  const { setModalContent } = useUi();
  const { handleTogglePublishProject } = useData();

  const [files, setFiles] = useState(initialFiles);
  // SIMPLIFIED LOCAL HANDLER:
  const togglePublishProject = async () => {
    // 1. Get the current state (before the change)
    const currentPublishedState = projectInFocus?.published;

    try {
      // 2. Call the GLOBAL handler (which handles server action and global state rollback)
      await handleTogglePublishProject(
        projectInFocus?.id,
        currentPublishedState
      );

      // 3. NO LOCAL ROLLBACK OR OPTIMISTIC UPDATE NEEDED HERE.
      // The useEffect/onSnapshot listener will automatically update
      // setProjectInFocus() when the database commit succeeds.
    } catch (error) {
      console.error("Failed to toggle project state:", error.message);
      // Show an error toast/snackbar here if needed.
    }
  };
  useEffect(() => {
    if (!projectInFocus?.id || !db) return;

    const projectRef = doc(db, "projects", projectInFocus?.id);

    const unsubscribe = onSnapshot(projectRef, (docSnap) => {
      if (docSnap.exists()) {
        setProjectInFocus({ id: docSnap.id, ...docSnap.data() });
      } else {
        setProjectInFocus(null);
      }
    });

    // Cleanup
    return () => unsubscribe();
  }, [db, projectInFocus?.id, setProjectInFocus]);

  useEffect(() => {
    if (initialProject && !projectInFocus) {
      setProjectInFocus(initialProject);
    }
  }, [initialProject, setProjectInFocus, projectInFocus]);

  useEffect(() => {
    setAppContext("projects");
    setProjectInFocus(initialProject);
    setModalContent(
      <CrudItem
        context={appContext}
        crud="inviteUser"
        profile={projectInFocus}
      />
    );

    return () => {};
  }, []);

  if (!projectId) {
    return <Typography>Project data error.</Typography>;
  }
  if (!projectInFocus) {
    return <Typography>Project not found.</Typography>;
  }
  return (
    <>
      {" "}
      {/* <Box className="pageMain" sx={{ ...pageMainStyles.sx }}> */}
      <WidgetIndex
        initialProject={initialProject}
        initialFiles={initialFiles}
        projectInFocus={projectInFocus}
        files={files}
        togglePublishProject={togglePublishProject}
      />{" "}
      {/* </Box> */}
    </>
  );
}
