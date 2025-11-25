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

import { bottomBarStyles, bottomNavcenterButtonStyles } from "@/theme/muiProps";
import { useApp } from "@/context/AppContext";
import { handleSetNewAppContext } from "@/lib/actions/appActions";
import {
  BottomNavigationAction,
  IconButton,
  Menu,
  Toolbar,
} from "@mui/material";
import { Add, More, Search } from "@mui/icons-material";

export default function CustomBottomNav({ BOTTOM_NAV_HEIGHT }) {
  const { setToggleDetails, showDataGrid, setShowDataGrid, handleOpenAddItem } =
    useUi();
  const { projectInFocus, setProjectInFocus } = useInFocus();
  const { appContext, setAppContext } = useApp();
  const [value, setValue] = React.useState(0);

  const optionsToRender = bottomNavActions(handleOpenAddItem);

  return (
    <BottomNavigation
      showLabels
      value={value}
      onChange={(event, newValue) => {
        setValue(newValue);
      }}
      sx={{ ...bottomBarStyles.sx, height: BOTTOM_NAV_HEIGHT }}
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
