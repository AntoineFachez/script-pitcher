// file path: ~/DEVFOLD/SCRIPT-PITCHER/SRC/APP/PROJECTS/[PROJECTID]/PROJECT.JS

"use client";

import React from "react";
import { Button, Typography } from "@mui/material";

import { useApp } from "@/context/AppContext";
import { useInFocus } from "@/context/InFocusContext";
import { useProject } from "@/context/ProjectContext";
import { useUi } from "@/context/UiContext";

import BasicModal from "@/components/modal/Modal";
import BasicTabs from "@/components/tabs/BasicTabs";
import ProfileHeader from "@/components/profileHeader/ProfileHeader";
import ProfileMenu from "@/components/menus/ProfileMenu";

import CharacterSection from "@/widgets/characters";
import EpisodesSection from "@/widgets/episodes";
import FilesList from "@/widgets/files/FilesList";
import InvitationsList from "@/widgets/invitations";
import UsersList from "@/widgets/users";

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
  // const { togglePublishProject } = useWidgetContext();

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
  const styles = { position: "absolute", leftMargin: "2rem" };

  return (
    <>
      <ProfileHeader
        bannerImageUrl={projectInFocus?.bannerUrl}
        avatarImageUrl={projectInFocus?.avatarUrl || projectInFocus?.imageUrl}
        menu={
          <ProfileMenu
            appContext={"projects"}
            setAppContext={setAppContext}
            setOpenModal={setOpenModal}
            setModalContent={setModalContent}
            itemInFocus={projectInFocus}
            togglePublishProject={togglePublishProject}
            handleToggleDrawer={handleToggleDrawer}
            orientationDrawer={orientationDrawer}
          />
        }
        titleText={projectInFocus?.title}
        descriptionText={projectInFocus?.logline}
      />
      <BasicTabs tabsArray={tabsArray} />
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
