// file path: ~/DEVFOLD/SCRIPT-PITCHER/SRC/COMPONENTS/NAVBAR/NAVBARBUTTON/NAVBARBUTTON.JS

"use client";

import React from "react";
import Link from "next/link";
import { Badge, IconButton } from "@mui/material";

import { useApp } from "@/context/AppContext";
import { iconMap } from "@/lib/maps/iconMap";
import { handleSetNewAppContext } from "@/lib/actions/appActions";

export default function NavBarButton({ iconName, prop, href, badgeCount }) {
  const { appContext, setAppContext, loading } = useApp();

  const IconComponent = iconName ? iconMap[iconName] : null;

  return (
    <IconButton
      onClick={() => handleSetNewAppContext(prop, setAppContext)}
      component={Link}
      href={href}
      sx={
        appContext === prop
          ? {
              color: "button.active",
              backgroundColor: "button.activeBackground",
            }
          : { color: "button.inactive" }
      }
    >
      <Badge badgeContent={badgeCount} color="secondary">
        <IconComponent />
      </Badge>
    </IconButton>
  );
}
