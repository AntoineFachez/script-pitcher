// file path: ~/DEVFOLD/SCRIPT-PITCHER/SRC/APP/DASHBOARD/PAGE.JS

// import { Box } from "@mui/material";

// import { getProjectsAndMembers } from "@/lib/data/projectFetchers";
// import { getCurrentUser } from "@/lib/auth/auth";

import DashboardIndex from "@/widgets/dashboard";

export default async function DashboardLayout({ children }) {
  // const user = await getCurrentUser();

  // if (!user) {
  //   return <div>Please log in to view your dashboard.</div>;
  // }

  // let initialData = { projects: [], users: [] };
  // try {
  //   initialData = await getProjectsAndMembers(user.uid);
  // } catch (error) {
  //   console.error(error);
  //   return <div>An error occurred while loading your projects.</div>;
  // }
  // if (!initialData) return;

  return (
    <DashboardIndex
    // initialData={initialData}
    />
  );
}
