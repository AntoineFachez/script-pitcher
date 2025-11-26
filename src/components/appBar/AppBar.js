// file path: ~/DEVFOLD/SCRIPT-PITCHER/SRC/COMPONENTS/APPBAR/APPBAR.JS

"use client";
import React from "react";
import { AppBar } from "@mui/material";

import { getButton } from "@/lib/maps/iconMap";
import { topNavActions } from "@/lib/appConfig";

import { useApp } from "@/context/AppContext";
import { useUi } from "@/context/UiContext";

export default function BasicAppBar({}) {
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
    <AppBar {...appBarProps}>
      {optionsToRender?.map((option, i) => {
        const onClickHandler = (e) => {
          e.stopPropagation();

          option.action(option.prop);
        };

        return option.customNavBarButton
          ? option.customNavBarButton
          : getButton(
              i,
              option.iconName,
              onClickHandler,
              false,
              appContext === option.prop
                ? {
                    color: "button.active",
                    backgroundColor: "button.activeBackground",
                  }
                : { color: "button.inactive" },
              "contained",
              option.href
            );
      })}
    </AppBar>
  );
}
const appBarProps = {
  className: "app--bar",
  sx: {
    display: "flex",
    flexFlow: "row nowrap",
    justifyContent: "space-between",
    alignItems: "center",
    // p: "0 24px",
    // backgroundColor: "background.nav",
    backgroundColor: "bars.app",
  },
};
