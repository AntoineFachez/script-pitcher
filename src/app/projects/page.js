// file path: ~/DEVFOLD/SCRIPT-PITCHER/SRC/APP/PROJECTS/PAGE.JS

// 1. ❌ REMOVE manual trace imports
// import { cookies } from "next/headers";
// import { decode } from "next-auth/jwt";

import { getCurrentUser } from "@/lib/auth/auth";
import { getProjectsAndMembers } from "@/lib/data/projectFetchers";
import ProjectsClientPage from "./ProjectsClientPage";
import { Box, Typography } from "@mui/material";
import { pageStyles, titleStyle } from "@/theme/muiProps";

export default async function ProjectsPage() {
  // 2. ❌ REMOVE the manual trace logic
  // --- START MANUAL TRACE ---
  // ...
  // --- END MANUAL TRACE ---

  // 3. ✅ Use the original, correct logic
  const user = await getCurrentUser(); // This will now work
  console.log("Server user (from getServerSession):", user);
  const userId = user?.uid;
  console.log("Server userId (from getServerSession):", userId);

  const { projects, users } = userId
    ? await getProjectsAndMembers(userId) // This will also work now
    : { projects: [], users: [] };

  return (
    <Box sx={{ ...pageStyles.sx }}>
      <Typography variant={titleStyle.variant} sx={titleStyle.sx}>
        Projects
      </Typography>
      <ProjectsClientPage serverProjects={projects} serverUsers={users} />
    </Box>
  );
}
