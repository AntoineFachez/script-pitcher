// file path: ~/DEVFOLD/SCRIPT-PITCHER/SRC/APP/PROJECTS/[PROJECTID]/PROJECT.JS
"use client";

import React, { useEffect, useState } from "react";
import { doc, onSnapshot, collection } from "firebase/firestore";
import {
  Box,
  Typography,
  IconButton,
  List,
  Alert,
  Avatar,
} from "@mui/material";

import { getFirebaseDb } from "@/lib/firebase/firebase-client";

import { useApp } from "@/context/AppContext";
import { useData } from "@/context/DataContext";
import { useInFocus } from "@/context/InFocusContext";
import { ProjectProvider, useProject } from "@/context/ProjectContext";
import { useUi } from "@/context/UiContext";

import BasicModal from "@/components/modal/Modal";
import BasicTabs from "@/components/tabs/BasicTabs";

import InvitationsList from "@/widgets/invitations";
import UsersList from "@/widgets/users";
import CrudItem from "@/widgets/crudItem";
import FilesList from "@/widgets/files";
import CharacterSection from "@/widgets/characters";
import EpisodesSection from "@/widgets/episodes";

import Menu from "./Menu";

// Receive the data fetched by the Server Component
function ProjectContent({ initialProject, initialFiles }) {
  const { appContext, setAppContext } = useApp();
  const { modalContent, setModalContent, openModal, setOpenModal } = useUi();
  const { projectInFocus, setProjectInFocus } = useInFocus(initialProject);
  const { invitations, characters, episodes, loading } = useProject();
  const { handleTogglePublishProject } = useData();

  // Use local state, initialized by the prop
  // const [projectInFocus, setProjectInFocus] = useState(initialProject);
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
  const db = getFirebaseDb(); // Get the Firestore instance

  useEffect(() => {
    if (!projectInFocus?.id || !db) return;

    // 🛑 FIX: Use the imported modular functions
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

  if (!projectInFocus) {
    return <Typography>Project not found.</Typography>;
  }
  const tabsArray = [
    {
      label: "Team",
      content:
        initialProject?.members?.length > 0 ? (
          <>
            <UsersList data={initialProject?.members} />
            <InvitationsList data={invitations} />
          </>
        ) : (
          <Typography color="text.secondary">No Team Members.</Typography>
        ),
    },
    {
      label: "Characters",
      content:
        characters?.length > 0 ? (
          <CharacterSection data={characters} />
        ) : (
          <Typography color="text.secondary">No Characters.</Typography>
        ),
    },
    {
      label: "Episodes",
      content:
        episodes?.length > 0 ? (
          <EpisodesSection data={episodes} />
        ) : (
          <Typography color="text.secondary">No Episodes.</Typography>
        ),
    },
    {
      label: "Files",
      content:
        files?.length > 0 ? (
          <FilesList data={files} />
        ) : (
          <Typography color="text.secondary">No Files.</Typography>
        ),
    },
  ];
  const styles = { leftMargin: "2rem" };

  return (
    <>
      <Box sx={{ position: "relative", height: "fit-content" }}>
        <Box
          sx={{
            // 1. Set the fixed dimensions of the banner
            width: "100%",
            height: 200, // Adjust the height as needed (e.g., 200px)

            // 2. Add the background image
            backgroundImage: `url(${projectInFocus?.imageUrl})`,

            // 3. Control how the image fills the space
            backgroundSize: "cover", // Scales the image to cover the box
            backgroundPosition: "center", // Centers the image in the box
            backgroundRepeat: "no-repeat", // Prevents tiling

            // Optional: Add a rounded top edge for a modern look
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
          }}
        />{" "}
        <Avatar
          src={projectInFocus?.avatarUrl || projectInFocus?.imageUrl}
          sx={{
            position: "absolute",
            left: styles.leftMargin,
            width: 72,
            height: 72,
            alignSelf: "center",
          }}
        />
        <Menu
          appContext={appContext}
          setAppContext={setAppContext}
          setOpenModal={setOpenModal}
          setModalContent={setModalContent}
          projectInFocus={projectInFocus}
          togglePublishProject={togglePublishProject}
        />
        <Typography
          variant="h4"
          sx={{ width: "100%", pl: styles.leftMargin, textAlign: "left" }}
        >
          {projectInFocus?.title}
        </Typography>
      </Box>
      <Typography
        variant="subtitle1"
        color="text.main"
        sx={{
          width: "100%",
          pl: styles.leftMargin,
          pr: styles.leftMargin,
          textAlign: "left",
        }}
      >
        {projectInFocus?.logline}
      </Typography>
      <BasicTabs tabsArray={tabsArray} />
      <BasicModal
        content={modalContent}
        open={openModal}
        setOpen={setOpenModal}
      />{" "}
    </>
  );
}
export default function Project({ initialProject, initialFiles }) {
  // The projectId is part of the initialProject data, or if you still need it separately:
  const projectId = initialProject?.id;

  if (!projectId) {
    // Handle case where project data is null/undefined after fetch failure
    return <Typography>Project data error.</Typography>;
  }

  return (
    <ProjectProvider projectId={projectId}>
      <ProjectContent
        initialProject={initialProject}
        initialFiles={initialFiles}
      />
    </ProjectProvider>
  );
}
