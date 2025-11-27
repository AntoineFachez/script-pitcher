// filepath: ~/DEVFOLD/SCRIPT-PITCHER/SRC/WIDGETS/HOME/index.js

"use client";
import React from "react";

import widgetConfig from "@/lib/widgetConfigs/home.widgetConfig.json";
import { handleSetNewAppContext } from "@/lib/actions/appActions";

import Widget from "./Widget";
import { WidgetLayout } from "../shared/WidgetLayout";

export default function HomeIndex({ layoutContext }) {
  return (
    <WidgetLayout
      widgetConfig={widgetConfig}
      layoutContext={layoutContext}
      onNavBarClick={handleSetNewAppContext}
    >
      <Widget />
    </WidgetLayout>
  );
}
