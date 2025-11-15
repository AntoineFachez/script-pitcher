// file path: ~/DEVFOLD/SCRIPT-PITCHER/SRC/APP/PROJECTS/[PROJECTID]/PROJECT.JS
"use client";

import React, { useEffect, useState } from "react";
import { Box, Typography, IconButton, List, Alert } from "@mui/material";

import { useApp } from "@/context/AppContext";
import { useData } from "@/context/DataContext";
import { useInFocus } from "@/context/InFocusContext";
import { ProjectProvider, useProject } from "@/context/ProjectContext";
import { useUi } from "@/context/UiContext";

import BasicModal from "@/components/modal/Modal";

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
  const { setProjectInFocus } = useInFocus();
  const { characters, episodes, loading } = useProject();
  const { handleTogglePublishProject } = useData();

  // Use local state, initialized by the prop
  const [projectProfile, setProjectProfile] = useState(initialProject);
  const [files, setFiles] = useState(initialFiles);

  const togglePublishProject = async () => {
    // We use the local state for the "current" value
    const currentPublishedState = projectProfile.published;
    const newPublishedState = !currentPublishedState;

    try {
      // 3. Optimistically update the LOCAL UI first
      setProjectProfile((prev) => ({
        ...prev,
        published: newPublishedState,
      }));

      // 4. Call the GLOBAL handler
      // This updates the global list and calls the server action
      await handleTogglePublishProject(
        projectProfile.id,
        currentPublishedState
      );
    } catch (error) {
      // 5. Rollback LOCAL UI on error
      // The global handler already logged the error and rolled back global state
      console.error("Local rollback:", error.message);
      setProjectProfile((prev) => ({
        ...prev,
        published: currentPublishedState, // Revert
      }));
      // Show an error toast to the user
    }
  };

  useEffect(() => {
    setAppContext("projects");
    setProjectInFocus(initialProject);
    setModalContent(
      <CrudItem
        context={appContext}
        crud="inviteUser"
        profile={projectProfile}
      />
    );

    return () => {};
  }, []);

  if (!projectProfile) {
    return <Typography>Project not found.</Typography>;
  }

  return (
    <>
      <Box sx={{ height: "fit-content" }}>
        <Typography variant="h4">{projectProfile.title}</Typography>
        <Menu
          appContext={appContext}
          setOpenModal={setOpenModal}
          setModalContent={setModalContent}
          projectProfile={projectProfile}
          togglePublishProject={togglePublishProject}
        />
      </Box>
      <Box sx={{ height: "50%" }}>
        {projectProfile?.members?.length > 0 ? (
          <UsersList data={projectProfile.members} />
        ) : (
          <Typography color="text.secondary">No Team Members.</Typography>
        )}
        {characters?.length > 0 ? (
          <CharacterSection data={characters} />
        ) : (
          <Typography color="text.secondary">No Characters.</Typography>
        )}
        {episodes?.length > 0 ? (
          <EpisodesSection data={episodes} />
        ) : (
          <Typography color="text.secondary">No Episodes.</Typography>
        )}
        {files?.length > 0 ? (
          <FilesList data={files} />
        ) : (
          <Typography color="text.secondary">No Files.</Typography>
        )}
      </Box>
      {/**
        Crud Item Modal
       */}
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
