// file path: ~/DEVFOLD/SCRIPT-PITCHER/SRC/COMPONENTS/NAVBAR/NAVBAR.JS

"use client";
import React from "react";
import { AppBar, Box, Container, Toolbar } from "@mui/material";

import { getButton } from "@/lib/maps/iconMap";
import { handleSetNewAppContext } from "@/lib/actions/appActions";
import { topNavActions } from "@/lib/appConfig";

import { useApp } from "@/context/AppContext";
import { useAuth } from "@/context/AuthContext";
import { useThemeContext } from "@/context/ThemeContext";
import { useUi } from "@/context/UiContext";

import AppHeader from "../appHeader/AppHeader";

export default function BasicAppBar({ spaceProps }) {
  const { appContext, setAppContext, loading } = useApp();
  const { handleLogout } = useAuth();
  const {
    isDesktop,
    currentWindowSize,
    handleToggleDrawer,
    orientationDrawer,
  } = useUi();
  const { toggleColorMode } = useThemeContext();

  const optionsToRender = topNavActions(
    appContext,
    handleToggleDrawer,
    orientationDrawer,
    currentWindowSize,
    isDesktop
  );
  return (
    <AppBar
      className="appBar"
      position="fixed"
      sx={{
        height: spaceProps.height,
        display: "flex",
        flexFlow: "row nowrap",
        justifyContent: "space-between",
        alignItems: "center",
        p: "0 24px",
        // backgroundColor: "background.nav",
        backgroundColor: "background.nav",
      }}
    >
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
