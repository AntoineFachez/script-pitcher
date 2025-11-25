import React from "react";
import Image from "next/image";
import { Box, IconButton } from "@mui/material";
import { CameraAlt } from "@mui/icons-material";
import BasicAvatar from "@/components/avatar/BasicAvatar";

import {
  profileHeaderFormStyles,
  profileHeaderBannerStyles,
  profileHeaderAvatarContainerStyles,
  basicAvatarStyles,
} from "@/theme/muiProps";

export default function ProfileHeaderForm({
  widgetConfig,
  formData,
  setSelectedImageUrlContext,
  handleToggleDrawer,
}) {
  return (
    <Box
      className={`${profileHeaderFormStyles?.className}__${widgetConfig?.context}`}
      sx={profileHeaderFormStyles}
    >
      <Box
        className={`${profileHeaderBannerStyles?.className}__${widgetConfig?.context}`}
        // sx={profileHeaderBannerStyles.sx}
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
          src={formData?.bannerUrl}
          alt={formData?.bannerUrl}
          style={{ objectFit: "cover" }}
        />
      </Box>
      <Box
        className={`${profileHeaderAvatarContainerStyles?.className}__${widgetConfig?.context}`}
        sx={profileHeaderAvatarContainerStyles.sx}
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
          className={`${basicAvatarStyles?.className}__${widgetConfig?.context}`}
          itemName={formData?.title}
          url={formData?.avatarUrl}
          sx={basicAvatarStyles.sx}
        />
      </Box>
    </Box>
  );
}
