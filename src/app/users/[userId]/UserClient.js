// file path: ~/DEVFOLD/SCRIPT-PITCHER/SRC/APP/USERS/[USERID]/USERCLIENT.JS

"use client";

import React, { useEffect, useState } from "react";
import { Box, Typography, IconButton } from "@mui/material";
import { Person, PersonOff, Public, PublicOff } from "@mui/icons-material";

import { useData } from "@/context/DataContext";
import { useApp } from "@/context/AppContext";
import { useUi } from "@/context/UiContext";

import BasicModal from "@/components/modal/Modal";

import CrudItem from "@/widgets/crudItem";
import WidgetIndex from "@/widgets/userProfile";

export default function UserClient({ initialUser }) {
  const { appContext } = useApp();
  const { modalContent, setModalContent, openModal, setOpenModal } = useUi();
  const { handleToggleUserAccessProject } = useData();
  const [userProfile, setUserProfile] = useState(initialUser);

  useEffect(() => {
    setModalContent(
      <CrudItem context={appContext} crud="inviteUser" profile={userProfile} />
    );

    return () => {};
  }, [appContext]);

  if (!userProfile) {
    return <Typography>User not found.</Typography>;
  }
  return (
    <>
      <Box sx={{ height: "fit-content" }}></Box>
      {/* <Box sx={{ height: "100%" }}>
        {userProfile?.members?.length > 0 ? (
          <ProjectsList
            //FIX: userProfile.members???

            data={userProfile.members}
            // ...
          />
        ) : (
          <Typography color="text.secondary">No team members.</Typography>
        )}
      </Box> */}

      <WidgetIndex
        userProfile={userProfile}
        handleToggleUserAccessProject={handleToggleUserAccessProject}
      />
      <BasicModal
        content={modalContent}
        open={openModal}
        setOpen={setOpenModal}
      />
    </>
  );
}
