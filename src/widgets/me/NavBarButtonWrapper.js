// file path: ~/DEVFOLD/SCRIPT-PITCHER/SRC/COMPONENTS/NAVBAR/NAVBARBUTTONWRAPPER.JS (New File)

import { getCurrentUser } from "@/lib/auth/auth";
import { getMeData } from "@/lib/data/userFetchers"; // Use the centralized fetcher
import NavBarButton from "./NavBarButton"; // Import the refactored Client Component
import React from "react";

/**
 * Server Component Wrapper that fetches necessary data for the NavBarButton badge.
 */
export default async function NavBarButtonWrapper(props) {
  const user = await getCurrentUser();
  let invitationCount = 0;

  if (user?.uid) {
    try {
      // 1. Call the memoized Server Function (hits DB once per request)
      const { receivedInvitations } = await getMeData(user.uid);

      // 2. Calculate the final count
      invitationCount = receivedInvitations?.length || 0;
    } catch (e) {
      console.error("Failed to fetch invitation count for NavBar:", e);
      // In case of error, count remains 0.
    }
  }

  // 3. Pass the calculated count down to the Client Component
  return (
    <NavBarButton
      {...props}
      invitationCount={invitationCount} // New, clean prop
    />
  );
}
