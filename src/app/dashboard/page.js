// file path: ~/DEVFOLD/SCRIPT-PITCHER/SRC/APP/DASHBOARD/PAGE.JS

// This is a Server Component, indicated by the 'async' function and lack of 'use client'.
import { cloneElement } from "react";
import { getProjectsAndMembers } from "@/lib/data/projectFetchers";
import { getCurrentUser } from "@/lib/auth/auth"; // Assume a server utility to get the user ID

export default async function DashboardLayout({ children }) {
  const user = await getCurrentUser(); // Get the authenticated user on the server

  if (!user) {
    // Handle unauthenticated state. You could also redirect to a login page.
    return <div>Please log in to view your dashboard.</div>;
  }

  let initialData = { projects: [], users: [] };
  try {
    // --- SERVER-SIDE DATA FETCHING ---
    initialData = await getProjectsAndMembers(user.uid);
  } catch (error) {
    console.error(error);
    // Render an error page or a fallback UI
    return <div>An error occurred while loading your projects.</div>;
  }
  if (!initialData) return;
  console.log("initialData", initialData);

  // Pass the server-fetched data as props to the child client component (ProjectsPage)
  return <>{cloneElement(children, { initialData })}</>;
}
