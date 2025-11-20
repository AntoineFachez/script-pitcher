import { Fragment, useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Divider from "@mui/material/Divider";
import MenuIcon from "@mui/icons-material/Menu";
import { IconButton } from "@mui/material";
import { ArrowBack, ViewSidebar } from "@mui/icons-material";

export default function BasicDrawer({
  handleToggleDrawer,
  orientationDrawer,
  menu,
  goBack,
  // list,
  element,
}) {
  console.log("handleToggleDrawer", orientationDrawer.bottom);
  const list = (anchor) => {
    // setOrientationDrawer({ ...orientationDrawer, [anchor]: true })
    return (
      <Box
        sx={{
          width: anchor === "top" || anchor === "bottom" ? "auto" : "100%",
          overflowY: "auto",
        }}
        role="presentation"
      >
        <Divider />
        {element}
        <Divider />
      </Box>
    );
  };

  return (
    <>
      {["bottom"].map((anchor, i) => {
        return (
          <>
            <Drawer
              anchor={anchor}
              open={orientationDrawer[anchor]}
              onClose={handleToggleDrawer(anchor, false)}
              sx={{
                "& .MuiDrawer-paper": {
                  width: anchor === "left" ? "fit-content" : null,
                  marginTop: "3rem",
                  // height: "80vh",
                  // bottom: 0,
                  display: "flex",
                  justifyContent: "flex-start",
                  overflowY: "hidden",
                },
              }}
              slotProps={{
                paper: {
                  sx: {
                    zIndex: 1500, // Choose a value higher than the Modal (default 1300)
                  },
                },
              }}
            >
              <Box>
                <IconButton
                  onClick={handleToggleDrawer(
                    anchor,
                    !orientationDrawer[anchor]
                  )}
                >
                  <MenuIcon />
                </IconButton>
                <IconButton onClick={() => goBack("")}>
                  <ArrowBack />
                </IconButton>
                {menu}
              </Box>
              {list(anchor)}
            </Drawer>
          </>
        );
      })}
    </>
  );
}
