// file path: ~/DEVFOLD/SCRIPT-PITCHER/SRC/APP/PROJECTS/[PROJECTID]/PROJECT.JS

"use client";

import React from "react";
import { Box, Typography, Avatar } from "@mui/material";

import { useApp } from "@/context/AppContext";
import { useProject } from "@/context/ProjectContext";
import { useUi } from "@/context/UiContext";

import BasicModal from "@/components/modal/Modal";
import BasicTabs from "@/components/tabs/BasicTabs";

import CharacterSection from "@/widgets/characters";
import EpisodesSection from "@/widgets/episodes";
import FilesList from "@/widgets/files";
import InvitationsList from "@/widgets/invitations";
import UsersList from "@/widgets/users";

// import ProfileMenu from "@/components/menus/ProfileMenu";
import ProfileMenu from "./Menu";
import ProfileHeader from "@/components/profileHeader/ProfileHeader";
import { useWidgetContext } from "./Context";

export default function Widget({ initialProject, projectInFocus, files }) {
  const { appContext, setAppContext } = useApp();
  const { modalContent, setModalContent, openModal, setOpenModal } = useUi();
  const { invitations, characters, episodes, loading } = useProject();
  const { togglePublishProject } = useWidgetContext();

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
          <>
            {" "}
            <CharacterSection data={characters} />
          </>
        ) : (
          <Typography color="text.secondary">No Characters.</Typography>
        ),
    },
    {
      label: "Episodes",
      content:
        episodes?.length > 0 ? (
          <>
            <EpisodesSection data={episodes} />{" "}
          </>
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
      <ProfileHeader
        bannerImageUrl={projectInFocus?.imageUrl}
        avatarImageUrl={projectInFocus?.avatarUrl || projectInFocus?.imageUrl}
        menu={
          <ProfileMenu
            appContext={appContext}
            setAppContext={setAppContext}
            setOpenModal={setOpenModal}
            setModalContent={setModalContent}
            itemInFocus={initialProject}
            togglePublishProject={togglePublishProject}
          />
        }
        titleText={projectInFocus?.title}
        descriptionText={projectInFocus?.logline}
        avatarStyles={styles}
        headerStyles={styles}
      />
      <BasicTabs tabsArray={tabsArray} />
      <BasicModal
        content={modalContent}
        open={openModal}
        setOpen={setOpenModal}
      />{" "}
    </>
  );
}
