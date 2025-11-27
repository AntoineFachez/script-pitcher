// file path: ~/DEVFOLD/SCRIPT-PITCHER/SRC/WIDGETS/USERPROFILE/INDEX.JS

"use client";

import React from "react";
import widgetConfig from "@/lib/widgetConfigs/users.widgetConfig.json";

import { WidgetLayout } from "../shared/WidgetLayout";

import { WidgetContext } from "./Context";
import Widget from "./Widget";

export default function UserIndex({
  handleSetNewAppContext,
  layoutContext,
  userProfile,
}) {
  return (
    <WidgetContext userProfile={userProfile}>
      <WidgetLayout
        layoutContext={layoutContext}
        onNavBarClick={handleSetNewAppContext}
        widgetConfig={widgetConfig}
      >
        <Widget userProfile={userProfile} />
      </WidgetLayout>
    </WidgetContext>
  );
}
