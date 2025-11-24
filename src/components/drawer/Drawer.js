// file path: ~/DEVFOLD/SCRIPT-PITCHER/SRC/COMPONENTS/DRAWER/DRAWER.JS

import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import { IconButton, Toolbar } from "@mui/material";

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
      <Box sx={{}} role="presentation">
        {element}
      </Box>
    );
  };

  return (
    <>
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
        slotProps={{}}
      >
        {menu}

        {list(anchor)}
      </Drawer>
    </>
  );
}
