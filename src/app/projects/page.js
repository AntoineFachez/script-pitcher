// file path: ~/DEVFOLD/SCRIPT-PITCHER/SRC/APP/PROJECTS/PAGE.JS
// This is now the main Server Component for this route.

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/authOptions";
import { getProjectsAndMembers } from "@/lib/data/projectFetchers";
import ProjectsClientPage from "./ProjectsClientPage"; // Import the client component
import { Box, Typography } from "@mui/material";
import { pageStyles, titleStyle } from "@/theme/muiProps";
import Menu from "./elements/Menu"; // Keep server-rendered static UI here

export default async function ProjectsPage() {
  // 1. Get session and data on the server
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

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

      {/* The Menu is tricky. If its actions MUST be client-side,
        it should be inside ProjectsClientPage. If it's simple
        (like links), it can stay here.
        Assuming it needs client state from UiContext, move it.
      */}

      {/* 3. Pass server data as props to the client component */}
      <ProjectsClientPage serverProjects={projects} serverUsers={users} />
    </Box>
  );
}
