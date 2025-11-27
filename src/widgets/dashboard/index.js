// file path: ~/DEVFOLD/SCRIPT-PITCHER/SRC/WIDGETS/DASHBOARD/INDEX.JS

"use client";
import React from "react";

import widgetConfig from "@/lib/widgetConfigs/dashboard.widgetConfig.json";

import { WidgetContext } from "./Context";
import Widget from "./Widget";
import { WidgetLayout } from "../shared/WidgetLayout";

export default function DashboardIndex({
  layoutContext,
  // initialData,
  handleSetNewAppContext,
}) {
  return (
    <>
      <WidgetContext>
        <WidgetLayout
          widgetConfig={widgetConfig}
          layoutContext={layoutContext}
          onNavBarClick={handleSetNewAppContext}
        >
          <Widget
          // initialData={initialData}
          />
        </WidgetLayout>
      </WidgetContext>
    </>
  );
}
