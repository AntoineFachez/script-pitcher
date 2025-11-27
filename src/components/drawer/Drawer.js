// file path: ~/DEVFOLD/SCRIPT-PITCHER/SRC/COMPONENTS/DRAWER/DRAWER.JS

import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import { IconButton, Toolbar } from "@mui/material";
import { ActionIcon } from "../buttons/ActionIcon";

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
    return (
      <Box
        sx={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
        role="presentation"
      >
        {element}
      </Box>
    );
  };

  return (
    <>
      {" "}
      <ActionIcon
        iconName={iconToOpen}
        onClick={(e) => handleToggleDrawer(anchor, true)(e)}
        variant="outlined"
      />
      {/* <IconButton
        onClick={(e) => handleToggleDrawer(anchor, true)(e)}
        sx={{ transform: "rotate(180deg)" }}
      >
        {iconToOpen}
      </IconButton> */}
      <Drawer
        anchor={anchor}
        open={orientationDrawer[anchor]}
        onClose={handleToggleDrawer(anchor, false)}
        slotProps={{}}
      >
        {menu}

        {list(anchor)}
      </Drawer>
    </>
  );
}
