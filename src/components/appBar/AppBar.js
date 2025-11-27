// file path: ~/DEVFOLD/SCRIPT-PITCHER/SRC/COMPONENTS/APPBAR/APPBAR.JS

"use client";
import React from "react";
import { AppBar } from "@mui/material";

import { getButton } from "@/lib/maps/iconMap";
import { topNavActions } from "@/lib/appConfig";

import { useApp } from "@/context/AppContext";
import { useUi } from "@/context/UiContext";

export default function BasicAppBar({ NAV_HEIGHT }) {
  const { appContext } = useApp();
  const {
    isDesktop,
    currentWindowSize,
    handleToggleDrawer,
    orientationDrawer,
  } = useUi();

  const optionsToRender = topNavActions(
    appContext,
    handleToggleDrawer,
    orientationDrawer,
    currentWindowSize,
    isDesktop
  );
  return (
    <AppBar {...appBarProps} sx={{ ...appBarProps.sx, height: NAV_HEIGHT }}>
      {optionsToRender?.map((option, i) => {
        const onClickHandler = (e) => {
          e.stopPropagation();
          option.action(option.prop);
        };
        return option.customNavBarButton;
      })}
    </AppBar>
  );
}
const appBarProps = {
  className: "app--bar",
  sx: {
    width: "100%",
    display: "flex",
    flexFlow: "row nowrap",
    justifyContent: "space-between",
    alignItems: "center",

    backgroundColor: "bars.app",
  },
};
