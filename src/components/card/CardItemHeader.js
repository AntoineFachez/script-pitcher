// file path: ~/DEVFOLD/SCRIPT-PITCHER/SRC/COMPONENTS/CARD/CARDITEMHEADER.JS

import React from "react";

import { Box, Button, Chip, IconButton, Typography } from "@mui/material";
import CardHeader from "@mui/material/CardHeader";

import Avatar from "@mui/material/Avatar";

import { stringAvatar } from "@/utils/colorHelpers";


export default function CardItemHeader({ cardActions }) {
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
  } = cardActions;
  return (
    <>
      <CardHeader
        {...cardHeaderProps}
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
          <Typography
            onClick={() => handleClickTitle(item)}
            sx={
              isSelected
                ? { color: "text.secondary" }
                : //   : item[schemeDefinition?.title]?.length > 25
                //   ? styled?.truncate
                { color: "text.secondary" }
            }
            variant="subtitle1"
          >
            {item[schemeDefinition?.title] || "N/A"}
          </Typography>
        }
        slotProps={{
          subheader: isSelected ? {} : {},
        }}
        subheader={
          <Box
            sx={{
              width: "100%",
              display: "flex",
              flexFlow: "row wrap",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 1,
            }}
          >
            <Typography onClick={() => handleClick(item)}>
              {customSubTitleItem}{" "}
            </Typography>
          </Box>
        }
        action={<Box sx={{ pr: 3 }}>{headerActions}</Box>}
      />
    </>
  );
}

const cardHeaderProps = {
  className: "cardHeader",
  variant: {},
  sx: {
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
  },
};
