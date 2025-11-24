// file path: ~/DEVFOLD/SCRIPT-PITCHER/SRC/APP/ME/INDEX.JS

"use client";

import React, { useEffect } from "react";

import { useUser } from "@/context/UserContext";
import { useApp } from "@/context/AppContext";

import NavBarButton from "@/components/navBar/navBarButton/NavBarButton";

import { WidgetContext } from "./Context";
import Widget from "./Widget";

export default function MeIndex({
  handleSetNewAppContext,
  layoutContext,
  initialProfile,
}) {
  const { setAppContext } = useApp();
  const { receivedInvitations } = useUser();
  let invitationCount;
  let pendingInvitations = [];

  invitationCount =
    receivedInvitations?.filter((invite) => invite.state === "pending")
      .length || 0;
  pendingInvitations =
    receivedInvitations?.filter((invite) => invite.state === "pending") || [];

  return (
    <WidgetContext>
      {layoutContext === "navBar" ? (
        <>
          <NavBarButton
            iconName="Person"
            href="/me"
            prop="me"
            badgeCount={invitationCount}
            handleSetNewAppContext={handleSetNewAppContext}
          />{" "}
        </>
      ) : (
        <>
          <Widget
            initialProfile={initialProfile}
            initialInvitations={pendingInvitations}
          />
        </>
      )}
    </WidgetContext>
  );
}
