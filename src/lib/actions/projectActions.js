// file path: ~/DEVFOLD/SCRIPT-PITCHER/SRC/LIB/ACTIONS/PROJECTACTIONS.JS

"use server";

import { FieldValue } from "firebase-admin/firestore";
import { getAdminServices } from "@/lib/firebase/firebase-admin";
import { getCurrentUser } from "@/lib/auth/auth"; // Assuming this utility exists based on your other components

/**
 * Toggles the publication state of a project.
 * Restricts access to project owners only.
 * @param {string} projectId - The ID of the project to update.
 * @param {boolean} newPublishedState - The new state (true/false).
 * @returns {{success: true} | {error: string}}
 */
export async function toggleProjectPublishState(projectId, newPublishedState) {
  // 1. AUTHENTICATION: Get the current authenticated user ID
  const user = await getCurrentUser();
  if (!user || !user.uid) {
    return { error: "Unauthorized: User not logged in." };
  }
  const userId = user.uid;

  const { db } = getAdminServices();

  try {
    const projectRef = db.collection("projects").doc(projectId);
    const projectSnap = await projectRef.get();

    if (!projectSnap.exists) {
      return { error: "Project not found." };
    }

    const projectData = projectSnap.data();
    const members = projectData.members || {};

    // 2. AUTHORIZATION CHECK: Verify if the user is the project owner
    const userRole = members[userId]?.role;

    if (userRole !== "owner") {
      // 🛑 Critical Fail: Only owners are allowed to publish/unpublish
      console.warn(
        `User ${userId} attempted to change publish state on project ${projectId} but is only a ${
          userRole || "non-member"
        }.`
      );
      return {
        error:
          "Forbidden: Only the project owner can change the publication state.",
      };
    }

    // 3. PERSISTENCE: If authorization check passes, proceed with the update
    await projectRef.update({
      published: newPublishedState,
      updatedAt: FieldValue.serverTimestamp(),
    });

    return { success: true };
  } catch (error) {
    console.error("Server Action Failed:", error.message);
    return { error: "Internal Server Error during project update." };
  }
}
