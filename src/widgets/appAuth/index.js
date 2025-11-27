// file path: ~/DEVFOLD/SCRIPT-PITCHER/SRC/COMPONENTS/AUTH/APPAUTH/INDEX.JS

"use client";

import React from "react";

import { useAuth } from "@/context/AuthContext";
import { ActionIcon } from "@/components/buttons/ActionIcon";

import LoginForm from "./LogInForm";

export default function Index({ layoutContext }) {
  const { handleLogout } = useAuth();
  return (
    <>
      {layoutContext === "navBar" ? (
        <ActionIcon
          onClick={handleLogout}
          iconName="Logout"
          asNavigationAction={true}
        />
      ) : (
        <LoginForm />
      )}
    </>
  );
}
