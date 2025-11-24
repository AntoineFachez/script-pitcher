import { Fragment, useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Divider from "@mui/material/Divider";
import MenuIcon from "@mui/icons-material/Menu";
import { IconButton, Toolbar } from "@mui/material";
import { ArrowBack, Close, ViewSidebar } from "@mui/icons-material";

export default function BasicDrawer({
  handleToggleDrawer,
  orientationDrawer,
  menu,
  goBack,
  // list,
  element,
  anchor,
  iconToOpen,
}) {
  const list = (anchor) => {
    // setOrientationDrawer({ ...orientationDrawer, [anchor]: true })
    return (
      <Box
        sx={
          {
            // width: anchor === "top" || anchor === "bottom" ? "auto" : "100%",
            // overflowY: "auto",
            // display: "flex",
            // justifyContent: "center",
            // alignItems: "center",
          }
        }
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
      {" "}
      <IconButton
        onClick={(e) => handleToggleDrawer(anchor, true)(e)}
        sx={{ transform: "rotate(180deg)" }}
      >
        {iconToOpen}
      </IconButton>
      <Drawer
        anchor={anchor}
        open={orientationDrawer[anchor]}
        onClose={handleToggleDrawer(anchor, false)}
        slotProps={{
          paper: {
            sx: {
              width:
                anchor === "left"
                  ? "fit-content"
                  : anchor === "right"
                  ? "40%"
                  : 500,
              zIndex: 1500, // Choose a value higher than the Modal (default 1300)
            },
          },
        }}
      >
        <Toolbar
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "flex-end",
            p: 0,
            m: 0,
            // backgroundColor: "white",
          }}
        >
          {/* <IconButton onClick={() => goBack("")}>
            <ArrowBack />
          </IconButton> */}
          <IconButton
            onClick={handleToggleDrawer(anchor, !orientationDrawer[anchor])}
          >
            <Close />
          </IconButton>
          {menu}
        </Toolbar>
        {list(anchor)}
      </Drawer>
    </>
  );
}
