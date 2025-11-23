import { useAuth } from "@/context/AuthContext";
import { sidePanelActions } from "@/lib/appConfig";
import { getButton } from "@/lib/maps/iconMap";
import { Box, Toolbar } from "@mui/material";
import React from "react";

export default function SideNavBar() {
  const { handleLogout } = useAuth();

  const optionsToRender = sidePanelActions(handleLogout);
  return (
    <>
      <Toolbar sx={{ flexFlow: "column nowrap" }}>
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
      </Toolbar>
    </>
  );
}
