// file path: ~/DEVFOLD/SCRIPT-PITCHER/SRC/APP/PROJECTS/[PROJECTID]/PAGE.JS

import React from "react";
import { Box } from "@mui/material";
import { notFound } from "next/navigation";
import { FieldPath } from "firebase-admin/firestore";

import { getAdminServices } from "@/lib/firebase/firebase-admin";

import Project from "./Project";

// This is now an async Server Component
export default async function ViewProjectPage({ params }) {
  const projectId = params.projectId;
  let db;

  // 2. Fetch data directly on the server
  let projectProfile;
  let membersData = [];
  let filesData = [];

  try {
    const services = getAdminServices();
    db = services.db; // Assign to the scoped variable
    const projectRef = db.collection("projects").doc(projectId);
    const projectSnap = await projectRef.get();

    if (!projectSnap.exists) {
      return notFound(); // 404
    }

    projectProfile = projectSnap.data();

    // --- 2. ADD: FETCH FILES SUBCOLLECTION ---
    const filesRef = projectRef.collection("files");
    // You could add .orderBy("createdAt", "asc") if you want
    const filesSnap = await filesRef.get();

    filesSnap.forEach((doc) => {
      filesData.push({
        id: doc.id,
        ...doc.data(),
      });
    });
    // --- END OF NEW FETCH ---

    // 3. (Optional) Fetch related data, e.g., member profiles
    const memberIds = Object.keys(projectProfile?.members || {});
    if (memberIds.length > 0) {
      // Example: Fetch all user profiles for the team
      const usersQuery = await db
        .collection("users")
        .where(FieldPath.documentId(), "in", memberIds)
        .get();
      usersQuery.docs.forEach((doc) => {
        membersData.push({
          ...doc.data(),
          role: projectProfile?.members[doc.id],
        });
      });
      projectProfile.members = membersData; // Replace IDs with full profiles
    }
  } catch (error) {
    console.error("Failed to fetch project:", error);
    // You could return an error component here
  }

  // --- 3. ADD: SERIALIZE THE FILES DATA ---
  // (This is critical, files will have timestamps)
  const serializableFilesData = filesData.map((file) => ({
    ...file,
    // Convert the 'createdAt' timestamp
    createdAt: file?.createdAt ? file?.createdAt?.toDate().toISOString() : null,
    // Convert the 'processedAt' timestamp
    processedAt: file?.processedAt
      ? file?.processedAt?.toDate().toISOString()
      : null,
    // NOTE: Your 'processedData' object is fine to pass as-is
    // because it's a plain object, not a class.

    // --- START FIX ---
    // Add the missing 'aiProcessedAt' timestamp
    aiProcessedAt: file?.aiProcessedAt
      ? file?.aiProcessedAt?.toDate().toISOString()
      : null,
    // --- END FIX ---
  }));
  // --- END OF FILE SERIALIZATION ---

  const serializableProjectProfile = {
    ...projectProfile,

    // Serialize the Project's createdAt field
    createdAt: projectProfile?.createdAt
      ? projectProfile?.createdAt?.toDate().toISOString()
      : null,
    updatedAt: projectProfile?.updatedAt
      ? projectProfile?.updatedAt?.toDate().toISOString()
      : null,

    // Serialize all fields within the members array
    members: Array.isArray(projectProfile?.members)
      ? projectProfile.members.map((member) => ({
          ...member,

          // User Profile Timestamps
          createdAt: member?.createdAt?.toDate().toISOString() || null,
          lastLogin: member?.lastLogin?.toDate().toISOString() || null,

          // 🔴 CRITICAL FIX: Serialize the Nested Role Object
          role: {
            ...member.role, // Spreads existing properties (including the raw Timestamp!)

            // Overwrite 'joinedAt' with a string
            joinedAt: member.role?.joinedAt?.toDate().toISOString() || null,

            // 🛡️ SAFETY: If you have other timestamps like 'invitedAt', fix them here too:
            // invitedAt: member.role?.invitedAt?.toDate().toISOString() || null,
          },
        }))
      : [],
  };

  // 4. Pass the server-fetched data as a prop
  return (
    <>
      <Box sx={{ height: "100%" }}>
        <Project
          initialProject={serializableProjectProfile}
          initialFiles={serializableFilesData}
        />
      </Box>
    </>
  );
}
