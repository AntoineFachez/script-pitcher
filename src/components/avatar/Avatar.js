import React from "react";
import { Avatar, Box } from "@mui/material";
import { styled } from "@mui/material/styles";
import { stringAvatar } from "@/utils/colorHelpers";

// --- Constants (Matching the previous profile header example) ---
const MAX_SCROLL_DISTANCE = 100;

// 1. STYLED COMPONENT (CSS and Dynamic Transforms)
const AvatarBase = styled(Avatar, {
  // Prevent scrollratio from being passed down to the Avatar DOM element
  shouldForwardProp: (prop) => prop !== "scrollratio",
})(({ theme, scrollratio }) => ({
  width: 64,
  height: 64,
  borderRadius: "50%",
  position: "absolute",
  bottom: -30, // Position slightly below the banner
  left: theme.spacing(3),
  border: `4px solid ${theme.palette.background.paper}`,
  overflow: "hidden",

  // Dynamic styles for scaling and lifting based on scrollratio
  transform: `
        translateY(${scrollratio * -20}px)
        scale(${1 - scrollratio * 0.4})
    `,
  transition: "transform 0.1s linear",
  transformOrigin: "bottom left",

  // Ensure the default MUI Avatar styles are maintained or augmented
}));

// 2. FUNCTIONAL COMPONENT (Props Handling)
export default function BasicAvatar({
  url,
  sx,
  scrollratio = 0,
  itemName = "",
}) {
  // We combine the passed-in sx with the dynamic styles from AvatarBase
  return (
    <AvatarBase src={url} sx={{ ...sx }} scrollratio={scrollratio}>
      {/* Placeholder for text initials if the image fails */}
      {url ? null : stringAvatar(itemName).children}
    </AvatarBase>
  );
}
