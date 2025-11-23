// file path: ~/DEVFOLD/SCRIPT-PITCHER/SRC/APP/ME/PAGE.JS

import React from "react";
import { notFound } from "next/navigation";

import { getCurrentUser } from "@/lib/auth/auth";
import { getMeData } from "@/lib/data/meFetchers";

import MeIndex from "@/widgets/meProfile/index";

/**
 * This is the main SERVER COMPONENT for the /me route.
 * It fetches all necessary data on the server first.
 */
export default async function MePage() {
  const user = await getCurrentUser();
  const userId = user?.uid;

  if (!userId) {
    return notFound();
  }

  const { userProfile, receivedInvitations } = await getMeData(userId);

  return (
    <MeIndex
      initialProfile={userProfile}
      initialInvitations={receivedInvitations}
    />
  );
}
