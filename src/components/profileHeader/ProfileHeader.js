// file path: ~/DEVFOLD/SCRIPT-PITCHER/SRC/COMPONENTS/PROFILEHEADER/PROFILEHEADER.JS

import { Box, Button, Paper, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import Banner from "../profileBanner/Banner";
import BasicAvatar from "../avatar/Avatar";
import {
  profileAvatarStyles,
  profileDescriptionTextStyles,
  profileHeaderStyles,
} from "@/theme/muiProps";
import { styled } from "@mui/material/styles";

// Constants for the effect
const MAX_SCROLL_DISTANCE = 100; // The distance (in pixels) over which the collapse happens
const HEADER_HEIGHT = 300; // Initial banner height
const COLLAPSE_AMOUNT = 200; // The total vertical space (in pixels) we want to shrink the header by
const ProfileHeader = ({
  containerRef,
  menu,
  bannerImageUrl,
  avatarImageUrl,
  titleText,
  descriptionText,
}) => {
  const [scrollY, setScrollY] = useState(0);

  // 1. Hook to track scroll position
  useEffect(() => {
    // Ensure the ref is attached to a DOM element
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      // FIX: Use scrollTop for a DOM element instead of scrollY
      setScrollY(container.scrollTop);
    };

    // FIX: Attach listener to the container's DOM element
    container.addEventListener("scroll", handleScroll, { passive: true });

    return () => container.removeEventListener("scroll", handleScroll);
  }, [containerRef]);

  // 2. Calculate the ratio (0 to 1) of collapse
  const clampedScroll = Math.min(scrollY, MAX_SCROLL_DISTANCE);
  const scrollRatio = clampedScroll / MAX_SCROLL_DISTANCE;

  // 3. Define Dynamic Styles based on scrollRatio
  const newHeight = `${HEADER_HEIGHT + 100 - scrollRatio * COLLAPSE_AMOUNT}px`;
  // Shrink and move the title up
  const titleTransform = `
    translateY(${scrollRatio * -80}px) 
    scale(${1 - scrollRatio * 0.3})
  `;

  // Fade the descriptive text out quickly (factor of 3)
  const descriptionOpacity = Math.max(0, 1 - scrollRatio * 3);

  return (
    <>
      {/* Outer container: sticky and sets the context */}
      <Box
        className="profile--header"
        sx={{
          // position: "fixed",
          top: 0,
          zIndex: 10,

          height: newHeight,
          overflow: "hidden",

          display: "flex",
          flexFlow: "column nowrap",
          justifyContent: "flex-end",
          alignItems: "flex-start",

          backgroundColor: "background.paper",
          borderBottom: "1px solid",
          borderColor: "divider",
          translateY: `${scrollRatio * -60}px`,
          transition: "height 0.1s linear, background-color 0.1s", // Smooth the height change
        }}
      >
        <Box
          sx={{
            position: "relative",
            width: "100%",
            // height: HEADER_HEIGHT,
            height: newHeight,
            display: "flex",
            flexFlow: "column nowrap",
            // backgroundColor: "red",
          }}
        >
          <Banner
            imageUrl={bannerImageUrl}
            scrollratio={scrollRatio}
            newHeight={newHeight}
          />
          <BasicAvatar
            url={avatarImageUrl}
            styles={profileAvatarStyles}
            scrollratio={scrollRatio}
          />
        </Box>
        {menu}
        <Box
          sx={{
            // height: "fit-content",
            height: "100%",
            display: "flex",
            flexFlow: "column nowrap",
            justifyContent: "flex-start",
            alignItems: "flex-start",
            // p: 0,
            // pt: 0,
            // pb: 0,
            overflow: "hidden",
          }}
        >
          {/* Menu (Placeholder for your KebabMenu, etc.) */}
          {/* Title Text */}
          <Typography
            variant="h4"
            sx={{
              // position: "fixed",
              zIndex: 100,
              // transform: titleTransform,
              // transition: "transform 0.1s linear",
              // transformOrigin: "top left",
              // whiteSpace: "nowrap",
              overflow: "hidden",
              // textOverflow: "ellipsis",
              p: "0 2rem",
            }}
          >
            {titleText}
          </Typography>
          {/* Description Text (Fades out) */}
          <Typography
            variant="subtitle1"
            color="text.secondary"
            sx={{
              opacity: descriptionOpacity,
              transition: "opacity 0.2s linear",
              // mt: "3rem",
              p: "0 2rem",
              backgroundColor: "transparent",
            }}
          >
            {descriptionText}
          </Typography>
        </Box>
      </Box>
    </>
  );
};
export default ProfileHeader;
