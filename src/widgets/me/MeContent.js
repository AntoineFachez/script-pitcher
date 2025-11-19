// file path: ~/DEVFOLD/SCRIPT-PITCHER/SRC/APP/ME/MECONTENT.JS

"use client";

import React, { useEffect, useState } from "react";
import { Avatar, Box, Divider, Typography } from "@mui/material";

import { useApp } from "@/context/AppContext";
import { useUi } from "@/context/UiContext";
// NOTE: useUser is kept but may need refactoring if it duplicates fetching/state

import BasicModal from "@/components/modal/Modal";
import BasicTabs from "@/components/tabs/BasicTabs";
import CrudItem from "@/widgets/crudItem";

import ReceivedInvitationsList from "@/widgets/receivedInvitations";

import { useInFocus } from "@/context/InFocusContext";
import { useAuth } from "@/context/AuthContext";
import { useUser } from "@/context/UserContext";

import Menu from "./Menu";

import { widgetContainerStyles, containerStyles } from "@/theme/muiProps";

// Receive initial data as props from the Server Component
export default function MeContent({ initialProfile, initialInvitations }) {
  const { appContext, setAppContext } = useApp();
  const { firebaseUser } = useAuth();
  const { userProfile } = useUser();

  const { modalContent, setModalContent, openModal, setOpenModal } = useUi();
  const { userInFocus, setUserInFocus } = useInFocus();
  // Use local state initialized by props to allow client-side updates (e.g., removing an invite)

  const [invitations, setInvitations] = useState(initialInvitations);

  useEffect(() => {
    // Set the default modal content for the page's context
    setModalContent(<CrudItem context={appContext} crud="update" />);

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
            backgroundImage: `url(${userProfile?.imageUrl})`,

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
          src={userProfile?.avatarUrl || userProfile?.imageUrl}
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
          userInFocus={userInFocus}
          // togglePublishProject={togglePublishProject}
        />
        <Typography
          variant="h4"
          sx={{ width: "100%", pl: styles.leftMargin, textAlign: "left" }}
        >
          {userProfile?.title}
        </Typography>
      </Box>
      <Typography
        variant="body1"
        sx={{
          width: "100%",
          height: "fit-content",
          display: "flex",
          flexFlow: "column nowrap",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        Welcome back {userProfile.displayName}
      </Typography>{" "}
      <BasicTabs tabsArray={tabsArray} />
      <BasicModal
        content={modalContent}
        open={openModal}
        setOpen={setOpenModal}
      />
    </>
  );
}
