// file path: ~/DEVFOLD/SCRIPT-PITCHER/SRC/APP/(APP-DATA)/USERS/PAGE.JS

import React from "react";

// The Client Component that will display the page
import UsersClientPage from "./UsersClientPage";
/**
 * This is the main SERVER COMPONENT for the /projects route.
 * It fetches all necessary data on the server first.
 */
export default async function ProjectsPage() {
  return <UsersClientPage />;
}
