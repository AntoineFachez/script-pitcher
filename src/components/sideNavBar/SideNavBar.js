import { useAuth } from "@/context/AuthContext";
import { sidePanelActions } from "@/lib/appConfig";
import { getButton } from "@/lib/maps/iconMap";
import { Box, Toolbar } from "@mui/material";
import React from "react";

export default function SideNavBar() {
  const { handleLogout } = useAuth();
  console.log(handleLogout);
  const optionsToRender = sidePanelActions(
    "toggleColorMode",
    handleLogout,
    "handleSetNewAppContext",
    "handleToggleDrawer",
    "orientationDrawer"
  );
  return (
    <>
      <Toolbar>
        {optionsToRender?.map((option, i) => {
          console.log(option);
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
      </Toolbar>
    </>
  );
}
