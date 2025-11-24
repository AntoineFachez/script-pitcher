// file path: ~/DEVFOLD/SCRIPT-PITCHER/SRC/APP/PROJECTS/PAGE.JS

import React from "react";

// The Client Component that will display the page
import ProjectsClientPage from "./ProjectsClientPage";
/**
 * This is the main SERVER COMPONENT for the /projects route.
 * It fetches all necessary data on the server first.
 */
export default async function ProjectsPage() {
  return <ProjectsClientPage />;
}
