// file path: ~/DEVFOLD/SCRIPT-PITCHER/SRC/COMPONENTS/MENUS/PROFILEMENU.JS

"use client";
import React from "react";
import CrudItem from "@/widgets/crudItem";
import { Edit, Public, PublicOff } from "@mui/icons-material";
import { Box, Button, IconButton, Typography } from "@mui/material";
import BasicDrawer from "../drawer/Drawer";
import { useUi } from "@/context/UiContext";

export default function ProfileMenu({ itemInFocus, togglePublishProject }) {
  const { handleOpenAddItem } = useUi();
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
          {itemInFocus?.status}
        </Typography>
        <IconButton onClick={() => handleOpenAddItem("update", itemInFocus)}>
          <Edit />
        </IconButton>
        <Typography variant="subtitle1" color="text.secondary">
          <Button
            aria-label="publish"
            onClick={togglePublishProject}
            variant="outlined"
            startIcon={itemInFocus?.published ? <Public /> : <PublicOff />}
            sx={{
              color: itemInFocus?.published ? "success.main" : "#aaa",
            }}
          >
            {itemInFocus?.published ? "Published" : "Archived"}
          </Button>
        </Typography>
      </Box>
    </>
  );
}
