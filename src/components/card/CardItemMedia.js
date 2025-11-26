// file path: ~/DEVFOLD/SCRIPT-PITCHER/SRC/COMPONENTS/CARD/CARDITEMMEDIA.JS

import React from "react";
import { Box, CardMedia, Chip, List, Typography } from "@mui/material";

import { useUi } from "@/context/UiContext";
import { getButton } from "@/lib/maps/iconMap";

export default function CardItemMedia({ cardActions }) {
  const { toggleDetails } = useUi();
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
    handleAddImteImage,
    alertElement,
  } = cardActions;

  const projectTitle = (
    <Typography
      sx={{
        // position: "absolute",
        width: "100%",
        // bottom: "0%",
        // left: "50%",
        // transform: "translate(-50%, -0%)",
        textAlign: "center",
        backgroundColor: "background.nav",
      }}
    >
      {item.title}
    </Typography>
  );
  return (
    <Box sx={{ position: "relative", width: "100%" }}>
      {item?.bannerUrl ? (
        <>
          {toggleDetails && (
            <List
              sx={{
                position: "absolute",
                display: "flex",
                flexFlow: "column nowrap",
              }}
            >
              {item[schemeDefinition?.subtitleArray]?.map((sub, i) => {
                return (
                  <Chip
                    key={i}
                    onClick={() => handleClickSubTitle(sub)}
                    variant="outlined"
                    // variant={"filled"}
                    sx={{
                      ...subtitleItemProps,
                      borderColor:
                        subTitleInFocus ===
                        sub[schemeDefinition?.subtitleArrayItem]
                          ? "button.active"
                          : "button.inactive",
                      // backgroundColor:
                      //   subTitleInFocus ===
                      //   sub[schemeDefinition?.subtitleArrayItem]
                      //     ? "background.primary"
                      //     : "background.contrast",
                      // color:
                      //   subTitleInFocus ===
                      //   sub[schemeDefinition?.subtitleArrayItem]
                      //     ? "text.primary"
                      //     : "text.contrast",
                    }}
                    label={sub.genre || "N/A"}
                  />
                );
              })}
            </List>
          )}
          <CardMedia
            component="img"
            height="194"
            image={item?.bannerUrl}
            alt={item.title}
            sx={{ width: "100%", p: 0, m: 0 }}
          />
          {!toggleDetails && projectTitle}
        </>
      ) : (
        <>
          <Box
            sx={{
              width: "100%",
              height: 194,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              p: 0,
              m: 0,
            }}
          >
            {toggleDetails ? (
              <>
                {getButton(
                  null, // index
                  "Add", // iconName
                  handleAddImteImage, // onClick
                  false, // disable
                  null, // sx
                  "outlined", // variant
                  null, // href
                  "Add Cover Image", // label
                  "Add Cover Image", // tooltip
                  false, // asNavigationAction
                  false, // asTextButton
                  true // startIcon
                )}
              </>
            ) : (
              <>{projectTitle}</>
            )}
          </Box>
        </>
      )}
    </Box>
  );
}
export const subtitleItemProps = {
  variant: "outlined",
  sx: {
    width: "100%",
    display: "flex",
    textAlign: "center",
  },
};
