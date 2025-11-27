// filepath: ~/DEVFOLD/SCRIPT-PITCHER/SRC/WIDGETS/HOME/index.js

"use client";

import React from "react";

import { handleSetNewAppContext } from "@/lib/actions/appActions";
import Widget from "./Widget";
import { WidgetLayout } from "../shared/WidgetLayout";

export default function HomeIndex({ layoutContext }) {
  return (
    <WidgetLayout
      layoutContext={layoutContext}
      onNavBarClick={handleSetNewAppContext}
      iconName="Home"
      href="/"
    >
      <Widget />
    </WidgetLayout>
  );
}
