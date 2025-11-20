// file path: ~/DEVFOLD/SCRIPT-PITCHER/SRC/APP/ME/PAGE.JS

import React from "react";
import { Box, Typography } from "@mui/material";
import { notFound } from "next/navigation";

// --- CLEANER IMPORTS ---
import { getCurrentUser } from "@/lib/auth/auth";
// ⭐ Import the unified function from the new module

import { getMeData } from "@/lib/data/meFetchers";

import MeIndex from "@/widgets/meProfile/index";

// 🛑 REMOVE: These functions are now in userFetchers.js
// async function getMeData(userId) { ... }
// const serializeTimestamp = (timestamp) => { ... }
// -----------------------

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

  // ⭐ Call the unified function (which returns pre-serialized data)
  const { userProfile, receivedInvitations } = await getMeData(userId);

  // 🛑 REMOVE: The serialization logic is now inside getMeData, so you don't need this block:
  /*
    // --- SERIALIZATION ---
    const serializableProfile = { ... }
    const serializableInvitations = initialInvitations.map((invite) => ({ ... }))
    // --- END SERIALIZATION ---
    */

  // Pass the already serialized data to the client component
  return (
    <MeIndex
      initialProfile={userProfile}
      initialInvitations={receivedInvitations}
    />
  );
}
