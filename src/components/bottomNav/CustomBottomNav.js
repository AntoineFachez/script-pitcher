// file path: ~/DEVFOLD/SCRIPT-PITCHER/SRC/COMPONENTS/BOTTOMNAV/CUSTOMBOTTOMNAV.JS

"use client";
import * as React from "react";
import Box from "@mui/material/Box";
import BottomNavigation from "@mui/material/BottomNavigation";

import { useUi } from "@/context/UiContext";
import { useInFocus } from "@/context/InFocusContext";
import { getButton } from "@/lib/maps/iconMap";
import { bottomNavActions } from "@/lib/appConfig";
import AddNewItem from "@/widgets/crudItem";

import { bottomNavcenterButtonStyles } from "@/theme/muiProps";
import { useApp } from "@/context/AppContext";
import { handleSetNewAppContext } from "@/lib/actions/appActions";

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

  return (
    <BottomNavigation
      showLabels
      value={value}
      onChange={(event, newValue) => {
        setValue(newValue);
      }}
      sx={{
        position: "relative",
        width: "100%",
        // height: footerHeight,
        display: "flex",
        justifyContent: "space-around",
        alignItems: "center",
        backgroundColor: "background.nav",
      }}
    >
      {optionsToRender.map((option, i) =>
        option.customNavBarButton
          ? option.customNavBarButton
          : getButton(
              i, // i,
              option.iconName, // iconName = "",
              option.action, // onClick,
              option.disabled, // disabled = false,
              option.size === "large" ? bottomNavcenterButtonStyles?.sx : {}, // sx = iconButtonStyles.sx,
              option.variant, // variant = "outlined",
              option.href, // href = null,
              option.buttonText, // label = "",
              false, // toolTip,
              true, // asNavigationAction = false,
              false, // asTextButton = false,
              false // startIcon = null
            )
      )}
    </BottomNavigation>
  );
}
