// file path: ~/DEVFOLD/SCRIPT-PITCHER/SRC/COMPONENTS/MENUS/KEBABMENU.JS

import React, { useState } from "react";
import { Box, IconButton, ListItemText, Menu, MenuItem } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";

import { getButton } from "../../lib/maps/iconMap";

/**
 * A self-contained Kebab Menu. It manages its own open/close state
 * and renders its content from a blueprint passed via props.
 */
export default function KebabMenu({ actions }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (e) => {
    e.stopPropagation();
    setAnchorEl(e.currentTarget);
  };

  const handleClose = (e) => {
    e.stopPropagation();
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton
        aria-label="settings"
        onClick={handleClick}
        sx={{
          width: "2rem",
          height: "2rem",
        }}
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        className="widget"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "center",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "center",
          horizontal: "left",
        }}
        // sx={{ display: "flex", gap: 2, p: 1 }}
      >
        {actions?.map((option, i) => {
          const onClickHandler = (e) => {
            e.stopPropagation();

            option.action(e);
            handleClose(e);
          };
          return getButton(
            i,
            option.icon,
            onClickHandler,
            option.loading,
            {
              ...option.sx,
              width: "2rem",
              height: "2rem",
            },
            "contained"
          );
        })}
      </Menu>
    </>
  );
}
