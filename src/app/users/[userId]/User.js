// file path: ~/DEVFOLD/SCRIPT-PITCHER/SRC/APP/USERS/[USERID]/USER.JS

"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  IconButton,
} from "@mui/material";
import { Person, PersonOff, Public, PublicOff } from "@mui/icons-material";

import { useData } from "@/context/DataContext";
import ProjectsList from "@/widgets/projects/Widget";
import { useApp } from "@/context/AppContext";
import CrudItem from "@/widgets/crudItem";
import BasicModal from "@/components/modal/Modal";
import { useUi } from "@/context/UiContext";

export default function User({ initialUser }) {
  const { appContext } = useApp();
  const { modalContent, setModalContent, openModal, setOpenModal } = useUi();
  const { handleToggleUserAccessProject } = useData();
  const [userProfile, setUserProfile] = useState(initialUser);
  console.log("appContext", appContext);

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
    <Box sx={{ height: "100%" }}>
      <Box sx={{ height: "fit-content" }}>
        <Typography variant="h4">{userProfile.displayName}</Typography>
        <Typography variant="subtitle1" color="text.secondary">
          {userProfile.createdAt}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          <IconButton
            aria-label="publish"
            onClick={handleToggleUserAccessProject} // <-- Use new handler
            sx={{
              color: userProfile.activated ? "success.main" : "#ffffff",
            }}
          >
            {userProfile.activated ? <Person /> : <PersonOff />}
          </IconButton>
          {userProfile.activated ? "Activated" : "Not Activated"}
        </Typography>
        {/* ... rest of your UI ... */}

        <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
          Team
        </Typography>
      </Box>
      <Box sx={{ height: "100%" }}>
        {userProfile?.members?.length > 0 ? (
          <ProjectsList
            data={userProfile.members}
            // ...
          />
        ) : (
          <Typography color="text.secondary">No team members.</Typography>
        )}
      </Box>{" "}
      <BasicModal
        content={modalContent}
        open={openModal}
        setOpen={setOpenModal}
      />
    </Box>
  );
}
