import React from "react";
import Image from "next/image";
import { Box, IconButton } from "@mui/material";
import { CameraAlt } from "@mui/icons-material";
import BasicAvatar from "@/components/avatar/BasicAvatar";

import { profileHeaderBannerStyles } from "@/theme/muiProps";

export default function ProfileHeaderForm({
  widgetConfig,
  formData,
  setSelectedImageUrlContext,
  handleToggleDrawer,
}) {
  return (
    <Box
      className={`${profileHeaderFormProps?.className}__${widgetConfig?.context}`}
      {...profileHeaderFormProps}
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
        {...profileHeaderAvatarcontainerProps}
        className={`${profileHeaderAvatarcontainerProps?.className}__${widgetConfig?.context}`}
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
          {...basicAvatarProps}
          className={`${basicAvatarProps?.className}__${widgetConfig?.context}`}
          itemName={formData?.title}
          url={formData?.avatarUrl}
        />
      </Box>
    </Box>
  );
}
export const basicAvatarProps = {
  className: "basicAvatar",
  component: "",
  sx: {
    position: "relative",
    width: "4rem",
    height: "4rem",
    bottom: "36px",
  },
};
const profileHeaderFormProps = {
  className: "profileHeader--form",
  sx: {
    position: "relative",
    width: "100%",
  },
};
const profileHeaderAvatarcontainerProps = {
  className: "profileHeader--avatar",
  sx: {
    width: "100%",
    height: "100%",
  },
};
