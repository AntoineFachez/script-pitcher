// file path: ~/DEVFOLD/SCRIPT-PITCHER/SRC/COMPONENTS/SIDENAVBAR/SIDENAVBAR.JS

import React from "react";
import { Box } from "@mui/material";

import { useUi } from "@/context/UiContext";
import { sidePanelActions } from "@/lib/appConfig";

export default function SideBar({}) {
  const { isDesktop } = useUi();

  const optionsToRender = sidePanelActions(isDesktop);

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
    // justifyContent: "space-between",
    alignItems: "center",
    padding: "1rem 0",
    border: "1px solid transparent",
    backgroundColor: "bars.side",
    gap: "1rem",
  },
};
