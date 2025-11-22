import React from "react";
import { Box, IconButton } from "@mui/material";
import {
  Camera,
  CameraAlt,
  Edit,
  Save,
  ViewSidebar,
} from "@mui/icons-material";
import BasicAvatar from "@/components/avatar/Avatar";
import Banner from "@/components/profileBanner/Banner";
import Image from "next/image";

export default function ProfileHeaderForm({
  crudProject,
  setSelectedImageUrlContext,
  handleToggleDrawer,
}) {
  const avatarStyles = {
    position: "relative",
    width: "4rem",
    height: "4rem",
    bottom: "36px",
  };

  return (
    <Box
      className="profileHeader"
      sx={{
        position: "relative",
        width: "100%",
      }}
    >
      <Box
        className="profileHeader--banner"
        sx={{
          position: "relative",
          width: "100%",
          height: "100%",
          // minHeight: "200px",
          border: "solid #ccc 1px",
        }}
      >
        <IconButton
          onClick={(e) => {
            setSelectedImageUrlContext("bannerUrl");
            handleToggleDrawer("bottom", true)(e);
          }}
          sx={{
            position: "absolute",
            zIndex: 10,
            // right: -12,
            //   bottom: -10,
          }}
        >
          <CameraAlt />
        </IconButton>

        <Image
          fill
          src={crudProject?.bannerUrl}
          alt={crudProject?.bannerUrl}
          style={{
            objectFit: "cover",
          }}
        />
      </Box>
      <Box
        className="profileHeader--avatar"
        sx={{
          width: "100%",
          height: "100%",
        }}
      >
        <IconButton
          onClick={(e) => {
            setSelectedImageUrlContext("avatarUrl");
            handleToggleDrawer("bottom", true)(e);
          }}
          sx={{
            position: "absolute",
            zIndex: 10,
            transform: "translate(4rem, 0)",
          }}
        >
          <CameraAlt />
        </IconButton>
        <BasicAvatar
          itemName={crudProject?.title}
          url={crudProject?.avatarUrl}
          sx={avatarStyles}
        />
      </Box>
    </Box>
  );
}
