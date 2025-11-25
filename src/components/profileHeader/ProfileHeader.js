// file path: ~/DEVFOLD/SCRIPT-PITCHER/SRC/COMPONENTS/PROFILEHEADER/PROFILEHEADER.JS

import { Box, Button, Paper, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import Banner from "../profileBanner/Banner";
import RatioAvatar from "../avatar/RatioAvatar";
import {
  profileAvatarStyles,
  profileDescriptionTextStyles,
  profileHeaderStyles,
} from "@/theme/muiProps";
import { styled } from "@mui/material/styles";

// Constants for the effect
// Constants for the effect
const MAX_SCROLL_DISTANCE = 100; // The distance (in pixels) over which the collapse happens
const HEADER_HEIGHT_MAX = 420; // Initial, fully expanded banner height
const COLLAPSE_AMOUNT = 200; // The total vertical space (in pixels) we want to shrink the header by
const HEADER_HEIGHT_MIN = HEADER_HEIGHT_MAX - COLLAPSE_AMOUNT; // Final minimum height (300 - 200 = 100px)

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
  const newHeight = `${HEADER_HEIGHT_MAX - scrollRatio * COLLAPSE_AMOUNT}px`;
  // Shrink and move the title up
  const titleTransform = `
    translateY(${scrollRatio * -80}px) 
    scale(${1 - scrollRatio * 0.3})
  `;

  // Fade the descriptive text out quickly (factor of 3)
  const descriptionOpacity = Math.max(0, 1 - scrollRatio * 3);

  // 💡 FIX 2: Dynamic height for the description text.
  // When scrollRatio=0, this height should be its full height (e.g., 'auto' or a fixed value).
  // When scrollRatio=1, this height should be 0.
  // Instead of using height, we often use max-height combined with opacity.
  const descriptionMaxHeight = `${Math.max(0, 100 - scrollRatio * 80)}px`; // Adjust 50px as needed for max height

  // 💡 FIX 3: Corrected `translateY` for the outer box (it should move up as it shrinks)
  const boxTranslateY = `${scrollRatio * -80}px`; // This makes the box move up on scroll

  return (
    <>
      {/* Outer container: sticky and sets the context */}
      <Box
        className="profile--header"
        sx={{
          position: "relative",
          zIndex: 10,

          // height: "fit-content",
          // height: "auto",
          // height: newHeight,
          height: "100%",

          maxHeight: "fit-content",

          display: "flex",
          flexFlow: "column nowrap",
          justifyContent: "flex-start",
          // justifyContent: "center",
          alignItems: "flex-start",

          backgroundColor: "background.paper",
          borderBottom: "1px solid",
          borderColor: "divider",
          // transform: `translateY(${boxTranslateY})`,
          transition: "height 0.1s linear, background-color 0.1s", // Smooth the height change
        }}
      >
        <Box
          sx={{
            // position: "fixed",
            position: "relative",
            // top: 0,
            width: "100%",

            // height: "fit-content",
            // height: "auto",
            // height: newHeight,
            height: "70%",
            // height: "50%",
            maxHeight: "40vh",
            display: "flex",
            flexGrow: 1,
            alignItems: "flex-start",
            flexFlow: "column nowrap",
          }}
        >
          <Banner
            imageUrl={bannerImageUrl}
            scrollratio={scrollRatio}
            newHeight={newHeight}
          />
          <RatioAvatar
            url={avatarImageUrl}
            // sx={profileAvatarStyles}
            scrollratio={scrollRatio}
          />
        </Box>

        <Box
          sx={{
            // position: "absolute",
            bottom: 0,
            zIndex: 50,
            width: "100%",
            height: "40%",
            minHeight: "fit-content",
            maxHeight: "fit-content",
            // height: newHeight,
            // height: "auto",

            display: "flex",
            flexGrow: 4,
            flexFlow: "column nowrap",
            justifyContent: "flex-start",
            alignItems: "flex-start",
            // p: 0,
            // pt: 0,
            // pb: 0,

            p: "0 2rem",
            overflow: "hidden",
            backgroundColor: "background.nav",
          }}
        >
          {" "}
          {menu}
          {/* Menu (Placeholder for your KebabMenu, etc.) */}
          {/* Title Text */}
          <Typography variant="h4" sx={{}}>
            {titleText}
          </Typography>
          {/* Description Text (Fades out) */}
          <Typography
            variant="subtitle1"
            color="text.secondary"
            sx={{
              // height: "100%",
              height: "fit-content",
              maxHeight: "fit-content",
              // maxHeight: descriptionMaxHeight,
              // opacity: descriptionOpacity,
              transition: "opacity 0.2s linear",
              // mb: "1rem",
              // p: "0 2rem",
              p: 0,
              mb: "1rem",
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
