// file path: ~/DEVFOLD/SCRIPT-PITCHER/SRC/APP/PROJECTS/ELEMENTS/MENU.JS

"use client";
import React, { Fragment } from "react";
import { getButton } from "@/lib/maps/iconMap";
import { Box, List } from "@mui/material";

export default function Menu({ menuActions }) {
  return (
    <List sx={{ height: "3rem" }}>
      {menuActions.map((item, i) => (
        <Fragment key={i}>
          {getButton(
            i, // i,
            "Add", // iconName = "",
            item.action, // onClick,
            null, // disabled = false,
            {}, // sx = iconButtonStyles.sx,
            "outlined", // variant = "outlined",
            null, // href = null,
            item.label, // label = "",
            false, // asNavigationAction = false,
            true, // asTextButton = false
            item.startIcon
          )}
        </Fragment>
      ))}
    </List>
  );
}
