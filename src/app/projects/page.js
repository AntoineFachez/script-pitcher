// file path: ~/DEVFOLD/SCRIPT-PITCHER/SRC/APP/PROJECTS/PAGE.JS

import React from "react";
import { Box, Typography } from "@mui/material";

// Server-side auth and data fetching
import { getCurrentUser } from "@/lib/auth/auth";
import { getProjectsAndMembers } from "@/lib/data/projectFetchers";

// The Client Component that will display the page
import ProjectsClientPage from "./ProjectsClientPage";

// Styles
import { pageStyles, pageTitleStyles } from "@/theme/muiProps";

/**
 * This is the main SERVER COMPONENT for the /projects route.
 * It fetches all necessary data on the server first.
 */
export default async function ProjectsPage() {
  // 1. Get the user on the server
  const user = await getCurrentUser();

  const userId = user?.uid;

  // 2. Fetch the data using the server action
  // We use the serialized getProjectsAndMembers function.
  const { projects, users } = userId
    ? await getProjectsAndMembers(userId)
    : { projects: [], users: [] };
  // 3. Render the static parts and pass the data to the client
  return <ProjectsClientPage serverProjects={projects} serverUsers={users} />;
}
