// file path: ~/DEVFOLD/SCRIPT-PITCHER/SRC/COMPONENTS/NAVBAR/NAVBAR.JS

"use client";
import React from "react";
import { Box } from "@mui/material";

import { navActions } from "@/lib/appConfig";
import { useApp } from "@/context/AppContext";

import { getButton } from "@/lib/maps/iconMap";
import { useThemeContext } from "@/context/ThemeContext";
import { useAuth } from "@/context/AuthContext";
import { handleSetNewAppContext } from "@/lib/actions/appActions";

export default function NavBar({}) {
  const { appContext, setAppContext, loading } = useApp();
  const { handleLogout } = useAuth();
  const { toggleColorMode } = useThemeContext();

  const optionsToRender = navActions(
    toggleColorMode,
    handleLogout,
    handleSetNewAppContext
  );
  return (
    <Box
      component="nav"
      sx={{
        width: "100%",
        height: "3rem",
        display: "flex",
        justifyContent: "space-around",
        alignItems: "center",
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
              option.icon,
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
    </Box>
  );
}
