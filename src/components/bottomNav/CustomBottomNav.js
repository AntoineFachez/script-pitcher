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

export default function CustomBottomNav() {
  const {
    showNewProject,
    setShowNewProject,
    showNewFile,
    setShowNewFile,
    modalContent,
    setModalContent,
    openModal,
    setOpenModal,
    setToggleDetails,
    showDataGrid,
    setShowDataGrid,
    footerHeight,
    handleOpenAddItem,
  } = useUi();
  const { projectInFocus, setProjectInFocus } = useInFocus();
  const { appContext } = useApp();
  const [value, setValue] = React.useState(0);

  const optionsToRender = bottomNavActions(
    setToggleDetails,
    showDataGrid,
    setShowDataGrid,
    handleOpenAddItem
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
      {optionsToRender.map((action, i) =>
        getButton(
          i, // i,
          action.iconName, // iconName = "",
          action.action, // onClick,
          action.disabled, // disabled = false,
          action.size === "large" ? bottomNavcenterButtonStyles : {}, // sx = iconButtonStyles.sx,
          action.variant, // variant = "outlined",
          action.href, // href = null,
          action.buttonText, // label = "",
          false, // toolTip,
          true, // asNavigationAction = false,
          false, // asTextButton = false,
          false // startIcon = null
        )
      )}
    </BottomNavigation>
  );
}
