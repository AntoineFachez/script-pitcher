// file path: ~/DEVFOLD/SCRIPT-PITCHER/SRC/COMPONENTS/AUTH/APPAUTH/INDEX.JS

"use client";

import React from "react";
import widgetConfig from "@/lib/widgetConfigs/auth.widgetConfig.json";

import { useAuth } from "@/context/AuthContext";
import { WidgetLayout } from "../shared/WidgetLayout";
import { ActionIcon } from "@/components/buttons/ActionIcon";

import LoginForm from "./LogInForm";

export default function Index({ layoutContext }) {
  const { handleLogout } = useAuth();
  return (
    <>
      <WidgetLayout
        widgetConfig={widgetConfig}
        layoutContext={layoutContext}
        onNavBarClick={handleLogout}
      >
        <LoginForm />
      </WidgetLayout>
    </>
  );
}
