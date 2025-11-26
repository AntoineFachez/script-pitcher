// file path: ~/DEVFOLD/SCRIPT-PITCHER/SRC/COMPONENTS/SIDENAVBAR/SIDENAVBAR.JS

import React from "react";
import { Box, Divider, Toolbar } from "@mui/material";

import { useAuth } from "@/context/AuthContext";
import { useUi } from "@/context/UiContext";
import { useApp } from "@/context/AppContext";
import { useThemeContext } from "@/context/ThemeContext";

import { getButton } from "@/lib/maps/iconMap";
import { sidePanelActions } from "@/lib/appConfig";

export default function SideNavBar({ SIDEBAR_WIDTH }) {
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
    <Box {...sidebarProps} sx={{ ...sidebarProps.sx, width: SIDEBAR_WIDTH }}>
      <Divider />
      <Box
        sx={{
          width: "100%",
          display: "flex",
          flexFlow: "column nowrap",
          alignItems: "center",
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
                i, // i,
                option.iconName, // iconName = "",
                onClickHandler, // onClick,
                option.disabled, // disabled = false,
                option.size, // sx = iconButtonStyles.sx,
                option.variant, // variant = "outlined",
                option.href, // href = null,
                option.buttonText, // label = "",
                false, // toolTip,
                true, // asNavigationAction = false,
                false, // asTextButton = false,
                false // startIcon = null
              );
        })}
      </Box>
      <Divider />
    </Box>
  );
}
const sidebarProps = {
  className: "sidebar",
  sx: {
    // position: "absolute",
    // left: 0,
    // zIndex: 2000,
    // width: { xs: "3rem", sm: "10%", md: "15%", lg: "5rem", xl: "5rem" },
    width: "fit-content",
    height: "100%",

    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    // alignItems: "center",
    // pl: { xs: 0, sm: "10%", md: "15%", lg: "5rem", xl: "5rem" },

    border: "1px solid transparent",
    backgroundColor: "bars.side",
  },
};
