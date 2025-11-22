// file path: ~/DEVFOLD/SCRIPT-PITCHER/SRC/COMPONENTS/CARD/CARDITEMHEADER.JS

import React from "react";
import { Box, Typography, styled, useTheme } from "@mui/material";
import CardHeader from "@mui/material/CardHeader";

import Avatar from "@mui/material/Avatar";

import { stringAvatar } from "@/utils/colorHelpers";
import { subtitleItemStyles, subtitleStyles } from "@/theme/muiProps";

export default function CardItemHeader({ cardProps }) {
  const {
    item,
    headerActions,
    isSelected,
    schemeDefinition,
    customSubTitleItem,
    subTitleInFocus,
    handleClickAvatar,
    handleClickTitle,
    handleClickSubTitle,
    alertElement,
  } = cardProps;

  const StyledCardTitle = styled(Typography, {
    // 1. Tell styled which props NOT to pass down to the underlying DOM element
    shouldForwardProp: (prop) => prop !== "isSelected",
  })(({ theme, isSelected }) => ({
    // 1. Base Interaction & Sizing
    cursor: "pointer",
    display: "inline-block", // Crucial for padding/margin
    width: "100%",
    height: "100%",

    // padding: theme.spacing(0.5, 1),
    // margin: theme.spacing(-0.5, -1),

    // 2. Conditional Styling: Access `isSelected` here
    color: isSelected
      ? theme.palette.text.secondary
      : theme.palette.text.primary,

    // 3. Responsive/Interactive States
    transition: theme.transitions.create(["color", "background-color"]),

    "&:hover": {
      backgroundColor: theme.palette.action.hover,
      // textDecoration: 'underline', // Optional: link-like feel
    },

    "&:active": {
      backgroundColor: theme.palette.action.selected,
    },

    // You can also add Media Queries for responsiveness here if needed:
    // [theme.breakpoints.up('md')]: { ... }
  }));
  return (
    <>
      <CardHeader
        sx={{
          position: "relative",
          width: "100%",
          // height: "fit-content",
          display: "flex",
          flexFlow: "row nowrap",
          justifyContent: "space-between",
          alignItems: "flex-start",
          "& .MuiCardHeader-action": { marginRight: 0 },
          cursor: "pointer",
          p: 0,
          m: 2,
        }}
        variant={{}}
        avatar={
          alertElement ? (
            <>{alertElement(item)}</>
          ) : (
            <>
              <Avatar
                onClick={() => handleClickAvatar(item)}
                sx={{}}
                src={item[schemeDefinition?.avatarUrl]}
                {...stringAvatar(item[schemeDefinition?.title] || "N/A")}
              />
            </>
          )
        }
        title={
          <StyledCardTitle
            // Pass necessary props to the styled component
            isSelected={isSelected} // The prop used in the styled function
            onClick={() => handleClickTitle(item)} // Standard event handler
            variant="subtitle1" // Standard Typography prop
          >
            {item[schemeDefinition?.title] || "N/A"}
          </StyledCardTitle>
        }
        slotProps={{
          subheader: isSelected ? {} : {},
        }}
        subheader={
          <Box sx={{ ...subtitleStyles.sx, flexFlow: "row wrap" }}>
            <Typography
              onClick={() => handleClick(item)}
              sx={subtitleStyles}
              variant={{}}
            >
              {customSubTitleItem}{" "}
            </Typography>
          </Box>
        }
        action={
          <Box
            sx={{ zIndex: 100, position: "absolute", top: 0, right: 0, px: 3 }}
          >
            {headerActions}
          </Box>
        }
      />
    </>
  );
}
