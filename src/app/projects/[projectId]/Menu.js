// file path: ~/DEVFOLD/SCRIPT-PITCHER/SRC/APP/PROJECTS/[PROJECTID]/MENU.JS

"use client";
import React from "react";
import CrudItem from "@/widgets/crudItem";
import { Edit, Public, PublicOff } from "@mui/icons-material";
import { Box, IconButton, Typography } from "@mui/material";

export default function Menu({
  appContext,
  setOpenModal,
  setModalContent,
  projectProfile,
  togglePublishProject,
}) {
  return (
    <>
      {" "}
      <Box
        sx={{
          width: "100%",
          display: "flex",
          flexFlow: "row nowrap",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography variant="subtitle1" color="text.secondary">
          {projectProfile.status}
        </Typography>
        <IconButton
          onClick={() => {
            setOpenModal(true);
            return setModalContent(
              <CrudItem
                context={appContext}
                crud="update"
                profile={projectProfile}
              />
            );
          }}
        >
          <Edit />
        </IconButton>
        <Typography variant="subtitle1" color="text.secondary">
          <IconButton
            aria-label="publish"
            onClick={togglePublishProject}
            sx={{
              color: projectProfile.published ? "success.main" : "#ffffff",
            }}
          >
            {projectProfile.published ? <Public /> : <PublicOff />}
          </IconButton>

          {projectProfile.published ? "Published" : "Not Published"}
        </Typography>
      </Box>
    </>
  );
}
