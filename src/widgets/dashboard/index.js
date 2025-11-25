// file path: ~/DEVFOLD/SCRIPT-PITCHER/SRC/WIDGETS/DASHBOARD/INDEX.JS

"use client";
import React from "react";

import NavBarButton from "@/components/appBar/navBarButton/NavBarButton";

import { WidgetContext } from "./Context";
import Widget from "./Widget";

export default function DashboardIndex({
  layoutContext,
  initialData,
  handleSetNewAppContext,
}) {
  return (
    <>
      <WidgetContext>
        {layoutContext === "navBar" ? (
          <>
            <NavBarButton
              iconName="Dashboard"
              href="/dashboard"
              prop="dashboard"
              badgeCount={null}
              handleSetNewAppContext={handleSetNewAppContext}
            />{" "}
          </>
        ) : (
          <>
            <Widget initialData={initialData} />
          </>
        )}
      </WidgetContext>
    </>
  );
}
