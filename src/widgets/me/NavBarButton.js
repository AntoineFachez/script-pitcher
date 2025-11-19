// file path: ~/DEVFOLD/SCRIPT-PITCHER/SRC/APP/ME/NAVBARBUTTON.JS (Refactored)

"use client"; // Retain the 'use client' directive

import React from "react";
import { AccountCircle } from "@mui/icons-material";
import { Badge, IconButton } from "@mui/material";
import Link from "next/link";
import { useApp } from "@/context/AppContext";

// ❌ REMOVE: All server-side imports (getMeData, useAuth, await logic)

export default function NavBarButton({
  handleSetNewAppContext,
  prop,
  href,
  invitationCount, // ⭐ New prop replacing the client-side fetch result
}) {
  const { appContext, setAppContext, loading } = useApp();

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
      {/* Use the clean 'invitationCount' prop */}
      <Badge badgeContent={invitationCount} color="secondary">
        <AccountCircle />
      </Badge>
    </IconButton>
  );
}
