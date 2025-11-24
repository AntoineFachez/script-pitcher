// file path: ~/DEVFOLD/SCRIPT-PITCHER/SRC/APP/USERS/[USERID]/PAGE.JS

import React from "react";
import { Box, Typography } from "@mui/material";
import { notFound } from "next/navigation";

// CRITICAL: Must import the Admin services for server-side fetching
import { getAdminServices } from "@/lib/firebase/firebase-admin";

// The Client Component that handles the UI
import UserClient from "./UserClient";

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

      // Get the raw member object (e.g., { role: "owner", joinedAt: Timestamp })
      const rawMemberData = projectData.members[userId] || {};

      // SANITIZE: Convert the specific member data timestamp to a string
      const serializedMemberData = {
        ...rawMemberData,
        joinedAt:
          rawMemberData.joinedAt &&
          typeof rawMemberData.joinedAt.toDate === "function"
            ? rawMemberData.joinedAt.toDate().toISOString()
            : null, // or rawMemberData.joinedAt if it's already a string
        createdAt:
          rawMemberData.createdAt &&
          typeof rawMemberData.createdAt.toDate === "function"
            ? rawMemberData.createdAt.toDate().toISOString()
            : null, // or rawMemberData.joinedAt if it's already a string
        updatedAt:
          rawMemberData.updatedAt &&
          typeof rawMemberData.updatedAt.toDate === "function"
            ? rawMemberData.updatedAt.toDate().toISOString()
            : null, // or rawMemberData.joinedAt if it's already a string
        lastLogin:
          rawMemberData.lastLogin &&
          typeof rawMemberData.lastLogin.toDate === "function"
            ? rawMemberData.lastLogin.toDate().toISOString()
            : null, // or rawMemberData.joinedAt if it's already a string
      };

      rolesData.push({
        projectId: projectDoc.id,
        projectTitle: projectData.title,
        role: serializedMemberData, // Passing the sanitized object here
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
    // 1. Copy all basic fields (strings, numbers, booleans)
    ...userProfile,

    // 2. Overwrite ALL Timestamp fields with strings
    createdAt: userProfile?.createdAt?.toDate
      ? userProfile.createdAt.toDate().toISOString()
      : null,

    // FIX: You were missing this field!
    updatedAt: userProfile?.updatedAt?.toDate
      ? userProfile.updatedAt.toDate().toISOString()
      : null,

    lastLogin: userProfile?.lastLogin?.toDate
      ? userProfile.lastLogin.toDate().toISOString()
      : null,

    joinedAt: userProfile?.joinedAt?.toDate
      ? userProfile.joinedAt.toDate().toISOString()
      : null,

    // 3. Attach the already-sanitized arrays/objects
    members: rolesData,
  };

  // 5. Pass the server-fetched data as a prop
  return (
    <>
      <Box sx={{ height: "100%" }}>
        {/* Pass the data to the client component that renders the UI */}
        <UserClient initialUser={serializableUserProfile} />
      </Box>
    </>
  );
}
