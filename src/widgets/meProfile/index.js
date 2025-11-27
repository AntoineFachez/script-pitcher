// file path: ~/DEVFOLD/SCRIPT-PITCHER/SRC/APP/ME/INDEX.JS

"use client";

import React from "react";

import { useUser } from "@/context/UserContext";

import { WidgetContext } from "./Context";
import Widget from "./Widget";
import { WidgetLayout } from "../shared/WidgetLayout";

export default function MeIndex({
  handleSetNewAppContext,
  layoutContext,
  initialProfile,
}) {
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
      <WidgetLayout
        layoutContext={layoutContext}
        onNavBarClick={handleSetNewAppContext}
        iconName="Person"
        href="/me"
      >
        <Widget
          initialProfile={initialProfile}
          initialInvitations={pendingInvitations}
        />
      </WidgetLayout>
    </WidgetContext>
  );
}
