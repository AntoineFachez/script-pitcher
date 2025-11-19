// file path: ~/DEVFOLD/SCRIPT-PITCHER/SRC/APP/ME/INDEX.JS

"use client";

import React from "react";
import { WidgetContext } from "./Context";
import NavBarButton from "./NavBarButton";
import MeContent from "./MeContent";
import { useUser } from "@/context/UserContext";

export default function index({
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
  console.log(receivedInvitations);

  return (
    <WidgetContext>
      {layoutContext === "navBar" ? (
        <>
          <NavBarButton
            handleSetNewAppContext={handleSetNewAppContext}
            href="/me"
            prop="me"
            invitationCount={invitationCount}
          />{" "}
        </>
      ) : (
        <>
          <MeContent
            initialProfile={initialProfile}
            initialInvitations={pendingInvitations}
          />
        </>
      )}
    </WidgetContext>
  );
}
