import { IconButton } from "@mui/material";
import React from "react";

export default function NavBarButton({ widgetProps, styled }) {
  const { gridMapKey, dropWidgetName, onNavBarButtonClick, iconButton } =
    widgetProps;

  return (
    <IconButton
      className="navBarButton"
      onClick={onNavBarButtonClick}
      sx={
        gridMapKey === dropWidgetName
          ? styled?.navBarButton?.active
          : styled?.navBarButton?.inactive
      }
    >
      {iconButton}
    </IconButton>
  );
}
