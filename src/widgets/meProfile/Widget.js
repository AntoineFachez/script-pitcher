// file path: ~/DEVFOLD/SCRIPT-PITCHER/SRC/APP/ME/MECONTENT.JS

"use client";

import React, { useEffect, useRef, useState } from "react";
import { Avatar, Box, Divider, Typography } from "@mui/material";

import { useApp } from "@/context/AppContext";
import { useUi } from "@/context/UiContext";
// NOTE: useUser is kept but may need refactoring if it duplicates fetching/state

import BasicModal from "@/components/modal/Modal";
import BasicTabs from "@/components/tabs/BasicTabs";
import CrudItem from "@/widgets/crudItem";

import ReceivedInvitationsList from "@/widgets/receivedInvitations/ReceivedInvitationsList";

import { useInFocus } from "@/context/InFocusContext";
import { useAuth } from "@/context/AuthContext";
import { useUser } from "@/context/UserContext";

import ProfileMenu from "@/components/menus/ProfileMenu";

import {
  widgetContainerStyles,
  containerStyles,
  profileAvatarStyles,
  profileHeaderStyles,
  profileDescriptionTextStyles,
} from "@/theme/muiProps";
import ProfileHeader from "@/components/profileHeader/ProfileHeader";

// Receive initial data as props from the Server Component
export default function MeContent({ initialProfile, initialInvitations }) {
  const { appContext, setAppContext } = useApp();
  const { firebaseUser } = useAuth();
  const { userProfile } = useUser();

  const { modalContent, setModalContent, openModal, setOpenModal } = useUi();
  const { userInFocus, setUserInFocus } = useInFocus();
  const containerRef = useRef();
  // Use local state initialized by props to allow client-side updates (e.g., removing an invite)

  const [invitations, setInvitations] = useState(initialInvitations);

  useEffect(() => {
    // Set the default modal content for the page's context
    // setModalContent(<CrudItem context={appContext} crud="update" />);

    // NOTE: If you need real-time updates (e.g., a new invite arrives while on this page),
    // you would add a client-side listener here, but it would start with the initial data.

    return () => {};
  }, [appContext, setModalContent]);

  useEffect(() => {
    // 1. Check if the local state is empty (length=0)
    // AND the server prop is NOT empty (length > 0)
    if (invitations.length === 0 && initialInvitations?.length > 0) {
      // 2. If true, explicitly reset the state to the authoritative server prop value.

      setInvitations(initialInvitations);
    }
  }, [initialInvitations]);
  useEffect(() => {
    setAppContext("me");
    setUserInFocus(firebaseUser);
    return () => {};
  }, []);

  const tabsArray = [
    {
      label: "Invitations",
      content:
        invitations?.length > 0 ? (
          <>
            <ReceivedInvitationsList data={invitations} />
          </>
        ) : (
          <Typography color="text.secondary">No Invitations.</Typography>
        ),
    },
  ];

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
          bannerImageUrl={userProfile?.imageUrl}
          avatarImageUrl={userProfile?.avatarUrl || userProfile?.imageUrl}
          menu={
            <ProfileMenu
              itemInFocus={userInFocus}
              // togglePublishProject={togglePublishProject}
            />
          }
          titleText={userProfile?.displayName}
          descriptionText={`Welcome back ${userProfile?.displayName}`}
        />
        <BasicTabs tabsArray={tabsArray} />
      </Box>
      <BasicModal
        content={modalContent}
        open={openModal}
        setOpen={setOpenModal}
      />
    </>
  );
}
