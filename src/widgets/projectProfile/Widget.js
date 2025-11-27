// file path: ~/DEVFOLD/SCRIPT-PITCHER/SRC/WIDGETS/PROJECTPROFILE/WIDGET.JS

"use client";

import React, { useRef } from "react";
import { Box, Button, Typography } from "@mui/material";

import { useApp } from "@/context/AppContext";
import { useAuth } from "@/context/AuthContext";
import { useInFocus } from "@/context/InFocusContext";
import { useProject } from "@/context/ProjectContext";
import { useUi } from "@/context/UiContext";

import BasicModal from "@/components/modal/Modal";
import BasicTabs from "@/components/tabs/BasicTabs";
import ProfileHeader from "@/components/profileHeader/ProfileHeader";
import ProfileMenu from "@/components/menus/ProfileMenu";

import CharacterSection from "@/widgets/characters/CharactersList";
import EpisodesList from "@/widgets/episodes/EpisodesList";
import FilesList from "@/widgets/files/FilesList";
import InvitationsList from "@/widgets/invitations/InvitationsList";
import UsersList from "@/widgets/users/UsersList";

export default function Widget({
  initialProject,
  files,
  togglePublishProject,
}) {
  const { appContext, setAppContext } = useApp();
  const {
    modalContent,
    setModalContent,
    openModal,
    setOpenModal,
    orientationDrawer,
    handleToggleDrawer,
  } = useUi();
  const { invitations, characters, episodes, loading } = useProject();
  const { projectInFocus } = useInFocus();
  const containerRef = useRef();
  console.log("projectInFocus", projectInFocus?.members);

  const tabStyles = {
    width: "100%",
    height: "100%", // Change to 100% of the viewport for testing, or use a calculated height
    display: "flex",
    // justifyContent: "center",
    // alignItems: "center",
    flexFlow: "column nowrap",
    // padding: "0 2rem",
    overflow: "hidden",
  };
  const { firebaseUser } = useAuth();

  // Determine current user's role
  const currentUserMember = projectInFocus?.members?.[firebaseUser?.uid];
  const userRole = currentUserMember?.role?.role || currentUserMember?.role;
  const isViewer = userRole === "viewer";

  const tabsArray = [
    // Hide Team tab for viewers
    !isViewer && {
      label: "Team",
      content:
        initialProject?.members?.length > 0 ? (
          <Box className="tab--item" sx={tabStyles}>
            <UsersList data={initialProject?.members} />
            <InvitationsList data={invitations} />
          </Box>
        ) : (
          <Typography color="text.secondary">No Team Members.</Typography>
        ),
    },
    {
      label: "Characters",
      content:
        characters?.length > 0 ? (
          <Box className="tab--item" sx={tabStyles}>
            <CharacterSection data={characters} />
          </Box>
        ) : (
          <Typography color="text.secondary">No Characters.</Typography>
        ),
    },
    {
      label: "Episodes",
      content:
        episodes?.length > 0 ? (
          <Box className="tab--item" sx={tabStyles}>
            <EpisodesList data={episodes} />{" "}
          </Box>
        ) : (
          <Typography color="text.secondary">No Episodes.</Typography>
        ),
    },
    {
      label: "Files",
      content:
        files?.length > 0 ? (
          <Box className="tab--item" sx={tabStyles}>
            <FilesList data={files} />
          </Box>
        ) : (
          <Typography color="text.secondary">No Files.</Typography>
        ),
    },
  ].filter(Boolean);

  return (
    <>
      <Box
        ref={containerRef}
        className="projectProfile"
        sx={{
          position: "relative",
          width: "100%",
          // 🔑 FIX: Set height to 100% of the viewport or container.
          // Using '100vh' or 'calc' is safer than just '100%'.
          // height: "100vh", // Change to 100% of the viewport for testing, or use a calculated height
          // height: "fit-content", // Change to 100% of the viewport for testing, or use a calculated height
          height: "100%", // Change to 100% of the viewport for testing, or use a calculated height
          // display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          flexFlow: "column nowrap",
          overflowY: "scroll", // Use overflowY for vertical scroll
          overflowX: "hidden",
          // overflow: "hidden",
          // gap: 2,
        }}
      >
        {" "}
        <ProfileHeader
          containerRef={containerRef}
          bannerImageUrl={projectInFocus?.bannerUrl}
          avatarImageUrl={projectInFocus?.avatarUrl || projectInFocus?.imageUrl}
          menu={
            <ProfileMenu
              itemInFocus={projectInFocus}
              togglePublishProject={togglePublishProject}
            />
          }
          titleText={projectInFocus?.title}
          descriptionText={projectInFocus?.logline}
        />
        <BasicTabs tabsArray={tabsArray} containerRef={containerRef} />
      </Box>
      <BasicModal
        content={modalContent}
        open={openModal}
        setOpen={setOpenModal}
        handleToggleDrawer={handleToggleDrawer}
        orientationDrawer={orientationDrawer}
      />{" "}
    </>
  );
}
