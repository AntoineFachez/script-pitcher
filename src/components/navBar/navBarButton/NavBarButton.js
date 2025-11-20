// file path: ~/DEVFOLD/SCRIPT-PITCHER/SRC/COMPONENTS/NAVBAR/NAVBARBUTTON/NAVBARBUTTON.JS
"use client"; // Retain the 'use client' directive

import React from "react";
import { AccountCircle } from "@mui/icons-material";
import { Badge, IconButton } from "@mui/material";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { iconMap } from "@/lib/maps/iconMap";

export default function NavBarButton({
  iconName,
  prop,
  href,
  badgeCount,
  handleSetNewAppContext,
}) {
  const { appContext, setAppContext, loading } = useApp();

  const IconComponent = iconName ? iconMap[iconName] : null;

  return (
    <IconButton
      onClick={() => handleSetNewAppContext(prop)}
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
      {/* Use the clean 'badgeCount' prop */}
      <Badge badgeContent={badgeCount} color="secondary">
        <IconComponent />
      </Badge>
    </IconButton>
  );
}
