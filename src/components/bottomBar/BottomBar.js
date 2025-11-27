// file path: ~/DEVFOLD/SCRIPT-PITCHER/SRC/COMPONENTS/BOTTOMNAV/CUSTOMBOTTOMNAV.JS

"use client";
import * as React from "react";
import BottomNavigation from "@mui/material/BottomNavigation";

import { useUi } from "@/context/UiContext";
import { useInFocus } from "@/context/InFocusContext";
import { bottomNavActions } from "@/lib/appConfig";

import { useApp } from "@/context/AppContext";

export default function BottomBar({ BOTTOM_NAV_HEIGHT }) {
  const { handleOpenAddItem } = useUi();
  const [value, setValue] = React.useState(0);

  const optionsToRender = bottomNavActions(handleOpenAddItem);

  return (
    <BottomNavigation
      showLabels
      value={value}
      onChange={(event, newValue) => {
        setValue(newValue);
      }}
      sx={{ height: BOTTOM_NAV_HEIGHT }}
      {...bottomBarProps}
    >
      {optionsToRender.map((option, i) => {
        const onClickHandler = (e) => {
          e.stopPropagation();

          option.action(option.prop);
        };

        return option.customNavBarButton;
      })}
    </BottomNavigation>
  );
}
const bottomBarProps = {
  sx: {
    position: "fixed",
    bottom: 0,
    width: "100%",
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "bars.bottom",
  },
};
