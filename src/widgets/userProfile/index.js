// file path: ~/DEVFOLD/SCRIPT-PITCHER/SRC/WIDGETS/USERPROFILE/INDEX.JS

"use client";

import React from "react";

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
        iconName="Group"
        href="/users"
      >
        <Widget userProfile={userProfile} />
      </WidgetLayout>
    </WidgetContext>
  );
}
