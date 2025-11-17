// file path: ~/DEVFOLD/SCRIPT-PITCHER/SRC/APP/ME/PAGE.JS

"use client";

import React, { useEffect } from "react";
import { Box, Divider, Typography } from "@mui/material";

import { useApp } from "@/context/AppContext";
import { useUi } from "@/context/UiContext";
import { useUser } from "@/context/UserContext";

import BasicModal from "@/components/modal/Modal";
import CrudItem from "@/widgets/crudItem";

import { widgetContainerStyles, containerStyles } from "@/theme/muiProps";

export default function Page() {
  const { appContext } = useApp();
  const {
    modalContent,
    setModalContent,
    openModal,
    setOpenModal,
    toggleDetails,
    showPublishedProjects,
    setShowPublishedProjects,
  } = useUi();
  const { userProfile, myProjects, lastFile } = useUser();

  useEffect(() => {
    setModalContent(<CrudItem context={appContext} crud="create" />);

    return () => {};
  }, [appContext]);
  return (
    <Box sx={widgetContainerStyles.sx}>
      <Typography
        variant="h1"
        sx={{ width: "100%", height: "fit-content", fontSize: "3rem", pt: 10 }}
      >
        Me
      </Typography>
      {JSON.stringify(myProjects)}
      <Box
        sx={{
          ...containerStyles.sx,
          // backgroundColor: "background.paper",
        }}
      >
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
          Welcome back {userProfile?.displayName}
        </Typography>{" "}
      </Box>{" "}
      <BasicModal
        content={modalContent}
        open={openModal}
        setOpen={setOpenModal}
      />
    </Box>
  );
}
