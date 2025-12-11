// file path: ~/DEVFOLD/SCRIPT-PITCHER/SRC/APP/ME/PAGE.JS

import React from "react";

import MeIndex from "@/widgets/meProfile/index";

/**
 * This is the main SERVER COMPONENT for the /me route.
 * It fetches all necessary data on the server first.
 */
export default async function MePage() {
  return <MeIndex />;
}
