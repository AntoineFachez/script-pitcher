// file path: ~/DEVFOLD/SCRIPT-PITCHER/SRC/LIB/ACTIONS/PROJECTACTIONS.JS

"use server";

import { FieldValue } from "firebase-admin/firestore";
import { getAdminServices } from "@/lib/firebase/firebase-admin";
import { DB_PATHS } from "@/lib/firebase/paths";
import { getCurrentUser } from "@/lib/auth/auth"; // Assuming this utility exists based on your other components

/**
 * Toggles the publication state of a project.
 * Restricts access to project owners only.
 * @param {string} projectId - The ID of the project to update.
 * @param {boolean} newPublishedState - The new state (true/false).
 * @returns {{success: true} | {error: string}}
 */
export async function toggleProjectPublishState(projectId, newPublishedState) {
  console.log("currentPublishedState", newPublishedState);
  // 1. AUTHENTICATION: Get the current authenticated user ID
  const user = await getCurrentUser();
  if (!user || !user.uid) {
    return { error: "Unauthorized: User not logged in." };
  }
  const userId = user.uid;

  const { db } = getAdminServices();

  try {
    const projectRef = db.doc(DB_PATHS.project(projectId));
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
        `User ${userId} attempted to change publish state on project ${projectId} but is only a ${userRole || "non-member"
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

/**
 * Invites a user to a project.
 * @param {object} params - { projectId, email, role, userProfile }
 * @returns {Promise<{success: boolean, invitationData?: object, error?: string}>}
 */
export async function inviteUserAction({ projectId, email, role, userProfile }) {
  // 1. AUTHENTICATION
  const user = await getCurrentUser();
  if (!user || !user.uid) {
    return { error: "Unauthorized: User not logged in." };
  }
  const decodedToken = user; // user object from getCurrentUser acts as decoded token

  const { db, auth } = getAdminServices();
  const targetEmail = email.toLowerCase();

  try {
    // 2. Create the invitation doc
    const invitationId = db.collection(DB_PATHS.projects()).doc().id;
    const sevenDaysInMs = 7 * 24 * 60 * 60 * 1000;
    const invitationPart = `/invite/${projectId}/${invitationId}`;

    const invitationData = {
      token: invitationId,
      projectId: projectId,
      invitationPart: invitationPart,
      invitedEmail: targetEmail,
      role: role,
      invitedById: decodedToken.uid,
      status: "pending",
      createdAt: FieldValue.serverTimestamp(),
      expiresAt: new Date(Date.now() + sevenDaysInMs),
    };

    const projectRef = db.doc(DB_PATHS.project(projectId));

    // Start a batch
    const batch = db.batch();

    // A. Write the invitation to the project subcollection
    const invitationRef = projectRef
      .collection("invitations")
      .doc(invitationId);
    batch.set(invitationRef, invitationData);

    // B. Try to find the user to give them a badge
    try {
      const userRecord = await auth.getUserByEmail(targetEmail);

      if (userRecord) {
        // The user exists! Add to their summary.
        const userSummaryRef = db.doc(DB_PATHS.userSummary(userRecord.uid));

        // Atomically add the invitation ID to a 'pendingInvitations' array
        batch.set(
          userSummaryRef,
          {
            invitations: {
              [invitationId]: {
                projectId: projectId,
                role: role,
                invitedById: decodedToken.uid,
                invitedByName: userProfile.displayName,
                invitedByEmail: userProfile.email,
                state: "pending",
                sentAt: FieldValue.serverTimestamp(),
                invitationPart: invitationPart,
              },
            },
          },
          { merge: true }
        );
      }
    } catch (authError) {
      // User not found, skipping badge update.
      console.log("User not found, skipping badge update.");
    }

    // Commit the batch
    await batch.commit();

    return { success: true, invitationData };
  } catch (error) {
    console.error("Invite User Action Failed:", error);
    return { error: "Internal Server Error during invitation." };
  }
}
