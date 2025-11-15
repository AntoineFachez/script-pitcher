// file path: ~/DEVFOLD/SCRIPT-PITCHER/SRC/APP/DASHBOARD/PAGE.JS

// This is a Server Component, indicated by the 'async' function and lack of 'use client'.
import { getProjectsAndMembers } from "@/lib/data/projectFetchers";
import { getCurrentUser } from "@/lib/auth"; // Assume a server utility to get the user ID

export default async function DashboardPage() {
  const user = await getCurrentUser(); // Get the authenticated user on the server
  console.log(user);

  if (!user) {
    // Handle unauthenticated state (e.g., redirect to login)
    return <div>Please log in to view your dashboard.</div>;
  }

  try {
    // --- SERVER-SIDE DATA FETCHING ---
    const { projects, users } = await getProjectsAndMembers(user.uid);

    // This data is now available *before* the component renders on the server.
    const projectCount = projects.length;

    return (
      <main>
        <h1>Welcome back, {user.name}</h1>
        <p>You are currently a member of {projectCount} project(s).</p>

        {/* You can pass the fetched data to Client Components as props */}
        {/* <ProjectList clientProjects={projects} clientUsers={users} /> */}

        {/* ... rest of your server-rendered content */}
      </main>
    );
  } catch (error) {
    console.error(error);
    // Render an error page or a fallback UI
    return <div>An error occurred while loading your projects.</div>;
  }
}
