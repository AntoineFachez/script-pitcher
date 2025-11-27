// file path: ~/DEVFOLD/SCRIPT-PITCHER/SRC/COMPONENTS/SIDENAVBAR/SIDENAVBAR.JS

import React from "react";
import { Box, Divider, Toolbar } from "@mui/material";

import { useAuth } from "@/context/AuthContext";
import { useUi } from "@/context/UiContext";
import { useApp } from "@/context/AppContext";
import { useThemeContext } from "@/context/ThemeContext";

import { getButton } from "@/lib/maps/iconMap";
import { sidePanelActions } from "@/lib/appConfig";

export default function SideBar({}) {
  const { appContext } = useApp();
  const { isDesktop } = useUi();
  const { toggleColorMode } = useThemeContext();
  const { showDataGrid, setToggleDetails, setShowDataGrid, handleOpenAddItem } =
    useUi();
  const { handleLogout } = useAuth();

  const optionsToRender = sidePanelActions(
    appContext,
    showDataGrid,
    setToggleDetails,
    setShowDataGrid,
    handleOpenAddItem,
    toggleColorMode,
    handleLogout,
    isDesktop
  );

  return (
    <Box {...sidebarProps}>
      {optionsToRender?.map((option, i) => {
        const onClickHandler = (e) => {
          e.stopPropagation();

          option.action(option.prop);
        };

        return option.customNavBarButton;
      })}
    </Box>
  );
}
const sidebarProps = {
  className: "sidebar",
  sx: {
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "1rem 0",
    border: "1px solid transparent",
    backgroundColor: "bars.side",
  },
};
