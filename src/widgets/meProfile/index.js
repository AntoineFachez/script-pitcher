// filepath: ~/DEVFOLD/SCRIPT-PITCHER/SRC/WIDGETS/ME-PROFILE/index.js

"use client";

import React from "react";

import { useUser } from "@/context/UserContext";
import widgetConfig from "@/lib/widgetConfigs/me.widgetConfig.json";
import { WidgetContext } from "./Context";
import Widget from "./Widget";
import { WidgetLayout } from "../shared/WidgetLayout";

export default function MeIndex({ handleSetNewAppContext, layoutContext }) {
  const { userProfile, receivedInvitations } = useUser();

  // console.log("userProfile", userProfile);
  // console.log("receivedInvitations", receivedInvitations);
  let invitationCount;
  let pendingInvitations = [];

  invitationCount =
    receivedInvitations?.filter((invite) => invite.status === "pending")
      .length || 0;
  pendingInvitations =
    receivedInvitations?.filter((invite) => invite.status === "pending") || [];

  return (
    <WidgetContext>
      <WidgetLayout
        widgetConfig={widgetConfig}
        layoutContext={layoutContext}
        onNavBarClick={handleSetNewAppContext}
      >
        <Widget
          initialProfile={userProfile}
          initialInvitations={pendingInvitations}
        />
      </WidgetLayout>
    </WidgetContext>
  );
}
