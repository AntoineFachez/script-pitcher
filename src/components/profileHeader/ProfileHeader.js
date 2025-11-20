import { Box, Typography } from "@mui/material";
import React from "react";
import Banner from "../profileBanner/Banner";
import BasicAvatar from "../avatar/Avatar";

export default function ProfileHeader({
  menu,
  bannerImageUrl,
  avatarImageUrl,
  titleText,
  descriptionText,
  avatarStyles,
  headerStyles,
}) {
  return (
    <Box sx={{ position: "relative", height: "fit-content" }}>
      <Banner imageUrl={bannerImageUrl} />
      <BasicAvatar url={avatarImageUrl} styles={avatarStyles} />
      {menu}
      <Typography
        variant="h4"
        sx={{ width: "100%", pl: headerStyles.leftMargin, textAlign: "left" }}
      >
        {titleText}
      </Typography>
      <Typography
        variant="subtitle1"
        color="text.main"
        sx={{
          width: "100%",
          pl: headerStyles.leftMargin,
          pr: headerStyles.leftMargin,
          textAlign: "left",
        }}
      >
        {descriptionText}
      </Typography>
    </Box>
  );
}
