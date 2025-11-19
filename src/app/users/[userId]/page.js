// file path: ~/DEVFOLD/SCRIPT-PITCHER/SRC/APP/USERS/[USERID]/PAGE.JS

import React from "react";
import { Box, Typography } from "@mui/material";
import { notFound } from "next/navigation";

// CRITICAL: Must import the Admin services for server-side fetching
import { getAdminServices } from "@/lib/firebase/firebase-admin";

// The Client Component that handles the UI
import User from "./User";

// This is the async Server Component responsible for fetching user data
export default async function ViewUserPage({ params }) {
  // 1. CRITICAL FIX: Access parameter directly to satisfy the Next.js router check
  const userId = params.userId;
  let db;

  if (!userId) {
    return notFound();
  }

  // 2. Fetch data directly on the server
  let userProfile;
  let rolesData = []; // Will hold the user's roles in various projects

  try {
    const services = getAdminServices();
    db = services.db; // Assign to the scoped variable

    // --- 2. FETCH USER PROFILE ---
    const userRef = db.collection("users").doc(userId);
    const userSnap = await userRef.get();

    if (!userSnap.exists) {
      return notFound(); // 404
    }

    userProfile = userSnap.data();

    // --- 3. FETCH USER'S ROLES/PROJECTS (Adapted from Project's member fetch) ---
    // This looks up which projects the user is a member of.
    // NOTE: This assumes your project documents have the user's ID in the 'members' map.
    const projectQuery = await db
      .collection("projects")
      .where(`members.${userId}`, "!=", null) // Find projects where this user is listed
      .get();

    projectQuery.docs.forEach((projectDoc) => {
      const projectData = projectDoc.data();

      // Adapt the data structure to what the User.js component might expect for 'members'
      rolesData.push({
        projectId: projectDoc.id,
        projectTitle: projectData.title,
        role: projectData.members[userId], // The user's role in this project
        // Add other necessary project details here if the client component needs them
      });
    });

    // Attach the roles data to the user profile, matching the shape of the client component
    userProfile.members = rolesData;
  } catch (error) {
    console.error("Failed to fetch user data:", error);
    // Return a box with a message on failure
    return (
      <Box>
        <Typography color="error">
          Error loading user data. Please check server logs.
        </Typography>
      </Box>
    );
  }

  // --- 4. SERIALIZE TIMESTAMPS ---

  const serializableUserProfile = {
    ...userProfile,

    // Serialize the User's createdAt field
    createdAt: userProfile?.createdAt
      ? userProfile?.createdAt?.toDate().toISOString()
      : null,

    // Serialize the User's lastLogin field
    //TODO: implement lastLogIn Project Setter
    lastLogin: userProfile?.lastLogin
      ? userProfile?.lastLogin.toDate().toISOString()
      : null,

    // The 'members' (rolesData) array is already serializable
    members: rolesData,
  };

  // 5. Pass the server-fetched data as a prop
  return (
    <>
      <Box sx={{ height: "100%" }}>
        {/* Pass the data to the client component that renders the UI */}
        <User initialUser={serializableUserProfile} />
      </Box>
    </>
  );
}
