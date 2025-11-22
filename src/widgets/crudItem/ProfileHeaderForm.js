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
    // zIndex: 1,
    top: 0,
    // right: "50%",
    left: -16,
    transform: "translate(-50%, -50%)",
  };
  console.log("crudProject?.imageUrl", crudProject?.bannerUrl);

  return (
    <Box
      className="profileHeader"
      sx={{
        position: "relative",
        width: "100%",
        height: "100%",
      }}
    >
      <Box
        className="profileHeader--banner"
        sx={{
          position: "relative",
          width: "100%",
          height: "100%",
          minHeight: "200px",
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
        {/* <Banner imageUrl={crudProject?.bannerUrl} scrollratio={1} /> */}

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
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          transform: "translate(-10%, 0)",
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
            transform: "translate(-50%, -50%)",
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
