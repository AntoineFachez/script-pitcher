// file path: ~/DEVFOLD/SCRIPT-PITCHER/SRC/APP/PROJECTS/[PROJECTID]/MENU.JS

"use client";
import React from "react";
import CrudItem from "@/widgets/crudItem";
import { Edit, Public, PublicOff } from "@mui/icons-material";
import { Box, Button, IconButton, Typography } from "@mui/material";

export default function Menu({
  appContext,
  setAppContext,
  setOpenModal,
  setModalContent,
  itemInFocus,
  togglePublishProject,
}) {
  return (
    <>
      <Box
        sx={{
          width: "100%",
          display: "flex",
          flexFlow: "row nowrap",
          justifyContent: "flex-end",
          alignItems: "center",
        }}
      >
        <Typography variant="subtitle1" color="text.secondary">
          {/* {itemInFocus.status} */}
        </Typography>
        <IconButton
          onClick={() => {
            setOpenModal(true);
            // setAppContext(appContext);
            return setModalContent(
              <CrudItem
                context={appContext}
                crud="update"
                profile={itemInFocus}
              />
            );
          }}
        >
          <Edit />
        </IconButton>
        <Typography variant="subtitle1" color="text.secondary">
          {/* <Button
            aria-label="publish"
            onClick={togglePublishProject}
            variant="outlined"
            startIcon={projectInFocus.published ? <Public /> : <PublicOff />}
            sx={{
              color: projectInFocus.published ? "success.main" : "#aaa",
            }}
          >
            {projectInFocus.published ? "Published" : "Archived"}
          </Button> */}
        </Typography>
      </Box>
    </>
  );
}
