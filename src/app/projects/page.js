// file path: ~/DEVFOLD/SCRIPT-PITCHER/SRC/APP/PROJECTS/PAGE.JS
// This is now the main Server Component for this route.

// 1. ❌ REMOVE direct imports for getServerSession and authOptions
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/lib/auth/authOptions";

// 2. ✅ ADD the import for your helper
import { getCurrentUser } from "@/lib/auth/auth"; // Assumes @/lib/auth maps to your file

import { getProjectsAndMembers } from "@/lib/data/projectFetchers";
import ProjectsClientPage from "./ProjectsClientPage"; // Import the client component
import { Box, Typography } from "@mui/material";
import { pageStyles, titleStyle } from "@/theme/muiProps";
// import Menu from "./elements/Menu"; // This should be in the Client Page

export default async function ProjectsPage() {
  // 3. ✅ Use your helper function to get the user
  // This function calls headers() and getServerSession internally.
  const user = await getCurrentUser();
  console.log("Server user:", user); // This should now log the user object or null

  // 4. ✅ Get the userId directly from the user object
  const userId = user?.uid;
  console.log("Server userId:", userId);

  // 2. Fetch data directly.
  // We provide default empty arrays if the user isn't logged in.
  const { projects, users } = userId
    ? await getProjectsAndMembers(userId)
    : { projects: [], users: [] };

  // This layout is rendered on the server
  return (
    <Box sx={{ ...pageStyles.sx }}>
      <Typography variant={titleStyle.variant} sx={titleStyle.sx}>
        Projects
      </Typography>

      {/* 3. Pass server data as props to the client component */}
      <ProjectsClientPage serverProjects={projects} serverUsers={users} />
    </Box>
  );
}
