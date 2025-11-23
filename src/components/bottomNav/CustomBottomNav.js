// file path: ~/DEVFOLD/SCRIPT-PITCHER/SRC/COMPONENTS/BOTTOMNAV/CUSTOMBOTTOMNAV.JS

"use client";
import * as React from "react";
import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import Fab from "@mui/material/Fab";
import BottomNavigation from "@mui/material/BottomNavigation";

import { useUi } from "@/context/UiContext";
import { useInFocus } from "@/context/InFocusContext";
import { getButton } from "@/lib/maps/iconMap";
import { bottomNavActions } from "@/lib/appConfig";
import AddNewItem from "@/widgets/crudItem";

import { bottomNavcenterButtonStyles } from "@/theme/muiProps";
import { useApp } from "@/context/AppContext";
import { handleSetNewAppContext } from "@/lib/actions/appActions";
import { IconButton, Menu, Toolbar } from "@mui/material";
import { Add, More, Search } from "@mui/icons-material";

export default function CustomBottomNav() {
  const { setToggleDetails, showDataGrid, setShowDataGrid, handleOpenAddItem } =
    useUi();
  const { projectInFocus, setProjectInFocus } = useInFocus();
  const { appContext, setAppContext } = useApp();
  const [value, setValue] = React.useState(0);

  const optionsToRender = bottomNavActions(
    appContext,
    setAppContext,
    setToggleDetails,
    showDataGrid,
    setShowDataGrid,
    handleOpenAddItem,
    handleSetNewAppContext
  );

  const StyledFab = styled(Fab)({
    position: "absolute",
    zIndex: 1,
    top: -30,
    left: 0,
    right: 0,
    margin: "0 auto",
  });
  return (
    <BottomNavigation
      showLabels
      value={value}
      onChange={(event, newValue) => {
        setValue(newValue);
      }}
      sx={{
        // position: "relative",
        display: "flex",
        justifyContent: "space-around",
        // p: "0 32",
      }}
    >
      {optionsToRender.map((option, i) => {
        const onClickHandler = (e) => {
          e.stopPropagation();

          option.action(option.prop);
        };
        return option.customNavBarButton ? (
          option.customNavBarButton
        ) : (
          <BottomNavigationAction>
            {getButton(
              i, // i,
              option.iconName, // iconName = "",
              onClickHandler, // onClick,
              option.disabled, // disabled = false,
              option.size === "large" ? bottomNavcenterButtonStyles?.sx : {}, // sx = iconButtonStyles.sx,
              option.variant, // variant = "outlined",
              option.href, // href = null,
              option.buttonText, // label = "",
              false, // toolTip,
              true, // asNavigationAction = false,
              false, // asTextButton = false,
              false // startIcon = null
            )}
          </BottomNavigationAction>
        );
      })}
    </BottomNavigation>
  );
}
