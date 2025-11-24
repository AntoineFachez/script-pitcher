// file path: ~/DEVFOLD/SCRIPT-PITCHER/SRC/WIDGETS/USERPROFILE/INDEX.JS

"use client";

import React from "react";

import NavBarButton from "@/components/navBar/navBarButton/NavBarButton";

import { WidgetContext } from "./Context";
import Widget from "./Widget";

export default function UserIndex({
  handleSetNewAppContext,
  layoutContext,
  userProfile,
}) {
  return (
    <WidgetContext userProfile={userProfile}>
      {layoutContext === "navBar" ? (
        <>
          <NavBarButton
            iconName="Group"
            href="/users"
            prop="users"
            handleSetNewAppContext={handleSetNewAppContext}
          />{" "}
        </>
      ) : (
        <>
          <Widget userProfile={userProfile} />
        </>
      )}
    </WidgetContext>
  );
}
