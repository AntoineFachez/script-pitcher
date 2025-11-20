import { Box, Typography } from "@mui/material";
import React from "react";
import Banner from "../profileBanner/Banner";
import BasicAvatar from "../avatar/Avatar";
import {
  profileAvatarStyles,
  profileDescriptionTextStyles,
  profileHeaderStyles,
} from "@/theme/muiProps";

export default function ProfileHeader({
  menu,
  bannerImageUrl,
  avatarImageUrl,
  titleText,
  descriptionText,
}) {
  return (
    <Box sx={{ position: "relative", height: "fit-content" }}>
      <Banner imageUrl={bannerImageUrl} />
      <BasicAvatar url={avatarImageUrl} styles={profileAvatarStyles} />
      {menu}
      <Typography variant="h4" sx={profileHeaderStyles?.sx}>
        {titleText}
      </Typography>
      <Typography
        variant="subtitle1"
        color="text.main"
        sx={profileDescriptionTextStyles.sx}
      >
        {descriptionText}
      </Typography>
    </Box>
  );
}
