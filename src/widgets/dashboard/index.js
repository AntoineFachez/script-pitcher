// file path: ~/DEVFOLD/SCRIPT-PITCHER/SRC/WIDGETS/DASHBOARD/INDEX.JS

"use client";
import React from "react";

import { useData } from "@/context/DataContext";

import { WidgetContext } from "./Context";
import Widget from "./Widget";
import { WidgetLayout } from "../shared/WidgetLayout";

export default function DashboardIndex({
  layoutContext,
  // initialData,
  handleSetNewAppContext,
}) {
  const {} = useData();
  return (
    <>
      <WidgetContext>
        <WidgetLayout
          layoutContext={layoutContext}
          onNavBarClick={handleSetNewAppContext}
          iconName="Dashboard"
          href="/dashboard"
        >
          <Widget
          // initialData={initialData}
          />
        </WidgetLayout>
      </WidgetContext>
    </>
  );
}
