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

/**
 * Invites a user to a project.
 * @param {object} params - { projectId, email, role, userProfile }
 * @returns {Promise<{success: boolean, invitationData?: object, error?: string}>}
 */
export async function inviteUserAction({
  projectId,
  email,
  role,
  userProfile,
}) {
  // 1. AUTHENTICATION
  const user = await getCurrentUser();
  if (!user || !user.uid) {
    return { error: "Unauthorized: User not logged in." };
  }
  const decodedToken = user; // user object from getCurrentUser acts as decoded token

  const { db, auth } = getAdminServices();
  const targetEmail = email.toLowerCase();

  try {
    // 2. AUTHORIZATION CHECK: Verify if the user is an owner or editor
    const projectRef = db.doc(DB_PATHS.project(projectId));
    const projectSnap = await projectRef.get();

    if (!projectSnap.exists) {
      return { error: "Project not found." };
    }

    const projectData = projectSnap.data();
    const members = projectData.members || {};
    const userRole = members[user.uid]?.role;

    if (userRole !== "owner" && userRole !== "editor") {
      console.warn(
        `User ${
          user.uid
        } attempted to invite to project ${projectId} but is only a ${
          userRole || "non-member"
        }.`
      );
      return {
        error:
          "Forbidden: Only project owners and editors can invite new members.",
      };
    }

    // 3. Create the invitation doc
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
                status: "pending",
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

    // Prepare serializable data for the client
    const serializableInvitationData = {
      ...invitationData,
      createdAt: new Date().toISOString(), // Approximation for client UI
      expiresAt: invitationData.expiresAt.toISOString(),
    };

    return { success: true, invitationData: serializableInvitationData };
  } catch (error) {
    console.error("Invite User Action Failed:", error);
    return { error: "Internal Server Error during invitation." };
  }
}

/**
 * Deletes a project.
 * Restricts access to project owners only.
 * @param {string} projectId - The ID of the project to delete.
 * @returns {Promise<{success: true} | {error: string}>}
 */
export async function deleteProjectAction(projectId) {
  // 1. AUTHENTICATION
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
      console.warn(
        `User ${userId} attempted to delete project ${projectId} but is only a ${
          userRole || "non-member"
        }.`
      );
      return {
        error: "Forbidden: Only the project owner can delete the project.",
      };
    }

    // 3. DELETE PROJECT DOCUMENT
    // This will trigger the Cloud Function 'onProjectDelete' which handles cascading deletions.
    await projectRef.delete();

    return { success: true };
  } catch (error) {
    console.error("Delete Project Action Failed:", error);
    return { error: "Internal Server Error during project deletion." };
  }
}

/**
 * Deletes an invitation.
 * @param {string} projectId - The ID of the project.
 * @param {string} invitationId - The ID of the invitation to delete.
 */
export async function deleteInvitationAction(projectId, invitationId) {
  // 1. AUTHENTICATION
  const user = await getCurrentUser();
  if (!user || !user.uid) {
    return { error: "Unauthorized: User not logged in." };
  }

  const { db, auth } = getAdminServices();

  try {
    // 2. FETCH INVITATION TO GET EMAIL
    // We need to know who was invited to clean up their summary
    const invitationRef = db
      .doc(DB_PATHS.project(projectId))
      .collection("invitations")
      .doc(invitationId);

    const invitationSnap = await invitationRef.get();

    if (!invitationSnap.exists) {
      return { error: "Invitation not found." };
    }

    const invitationData = invitationSnap.data();
    const targetEmail = invitationData.invitedEmail;

    // 3. DELETE INVITATION DOC
    await invitationRef.delete();

    // 4. CLEANUP USER SUMMARY (if user exists)
    if (targetEmail) {
      try {
        const userRecord = await auth.getUserByEmail(targetEmail);
        if (userRecord) {
          const userSummaryRef = db.doc(DB_PATHS.userSummary(userRecord.uid));
          // Use FieldValue.delete() to remove the specific key from the map
          await userSummaryRef.update({
            [`invitations.${invitationId}`]: FieldValue.delete(),
          });
        }
      } catch (e) {
        // User might not exist or other error, which is fine since the invite is gone
        console.log(
          "Could not cleanup user summary (user likely not found):",
          e.message
        );
      }
    }

    return { success: true };
  } catch (error) {
    console.error("Delete Invitation Action Failed:", error);
    return { error: "Internal Server Error during invitation deletion." };
  }
}

/**
 * Fetches user profiles for a list of member IDs.
 * Used to hydrate project members server-side to bypass client-side security rules.
 * @param {string[]} memberIds - Array of user UIDs.
 * @returns {Promise<{success: true, members: object[]} | {error: string}>}
 */
export async function fetchProjectMembersAction(memberIds) {
  // 1. AUTHENTICATION
  const user = await getCurrentUser();
  if (!user || !user.uid) {
    return { error: "Unauthorized: User not logged in." };
  }

  if (!memberIds || memberIds.length === 0) {
    return { success: true, members: [] };
  }

  const { db } = getAdminServices();

  try {
    const userDocs = await Promise.all(
      memberIds.map((uid) => db.collection("users").doc(uid).get())
    );

    const members = userDocs.map((doc) => {
      const userData = doc.exists ? doc.data() : {};
      return {
        uid: doc.id,
        ...userData,
        // Serialize timestamps
        createdAt: userData?.createdAt?.toDate
          ? userData.createdAt.toDate().toISOString()
          : null,
        lastLogin: userData?.lastLogin?.toDate
          ? userData.lastLogin.toDate().toISOString()
          : null,
        updatedAt: userData?.updatedAt?.toDate
          ? userData.updatedAt.toDate().toISOString()
          : null,
      };
    });

    return { success: true, members };
  } catch (error) {
    console.error("Fetch Project Members Action Failed:", error);
    return { error: "Internal Server Error during member fetching." };
  }
}

/**
 * Accepts an invitation.
 * @param {string} projectId
 * @param {string} invitationId
 */
export async function acceptInvitationAction(projectId, invitationId) {
  const user = await getCurrentUser();
  if (!user || !user.uid) {
    return { error: "Unauthorized: User not logged in." };
  }
  const userId = user.uid;
  const userEmail = user.email;

  const { db } = getAdminServices();

  try {
    await db.runTransaction(async (transaction) => {
      const projectRef = db.doc(DB_PATHS.project(projectId));
      const invitationRef = projectRef
        .collection("invitations")
        .doc(invitationId);
      const userSummaryRef = db.doc(DB_PATHS.userSummary(userId));

      const [projectSnap, invitationSnap] = await Promise.all([
        transaction.get(projectRef),
        transaction.get(invitationRef),
      ]);

      if (!projectSnap.exists) throw new Error("Project does not exist.");
      if (!invitationSnap.exists) throw new Error("Invitation not found.");

      const inviteData = invitationSnap.data();
      if (inviteData.status === "accepted") {
        throw new Error("Invitation already accepted.");
      }
      if (
        inviteData.expiresAt &&
        inviteData.expiresAt.toMillis() < Date.now()
      ) {
        throw new Error("Invitation has expired.");
      }

      // Update Invitation
      transaction.update(invitationRef, {
        status: "accepted",
        acceptedBy: userId,
        acceptedAt: FieldValue.serverTimestamp(),
      });

      // Add Member to Project
      const newMemberData = {
        role: inviteData.role,
        email: userEmail,
        joinedAt: FieldValue.serverTimestamp(),
      };
      transaction.update(projectRef, {
        [`members.${userId}`]: newMemberData,
      });

      // Add Project to User Summary
      transaction.set(
        userSummaryRef,
        {
          projects: {
            [projectId]: {
              role: inviteData.role,
              addedAt: FieldValue.serverTimestamp(),
            },
          },
        },
        { merge: true }
      );

      // Update Invitation in User Summary
      transaction.update(userSummaryRef, {
        [`invitations.${invitationId}.status`]: "accepted",
        [`invitations.${invitationId}.acceptedAt`]:
          FieldValue.serverTimestamp(),
      });
    });

    return { success: true };
  } catch (error) {
    console.error("Accept Invitation Action Failed:", error);
    return { error: error.message || "Failed to accept invitation." };
  }
}

/**
 * Rejects an invitation.
 * @param {string} projectId
 * @param {string} invitationId
 */
export async function rejectInvitationAction(projectId, invitationId) {
  const user = await getCurrentUser();
  if (!user || !user.uid) {
    return { error: "Unauthorized: User not logged in." };
  }
  const userId = user.uid;

  const { db } = getAdminServices();

  try {
    await db.runTransaction(async (transaction) => {
      const projectRef = db.doc(DB_PATHS.project(projectId));
      const invitationRef = projectRef
        .collection("invitations")
        .doc(invitationId);
      const userSummaryRef = db.doc(DB_PATHS.userSummary(userId));

      const invitationSnap = await transaction.get(invitationRef);
      if (!invitationSnap.exists) throw new Error("Invitation not found.");

      // Update Invitation Status
      transaction.update(invitationRef, {
        status: "rejected",
        rejectedBy: userId,
        rejectedAt: FieldValue.serverTimestamp(),
      });

      // Update Invitation in User Summary
      transaction.update(userSummaryRef, {
        [`invitations.${invitationId}.status`]: "rejected",
        [`invitations.${invitationId}.rejectedAt`]:
          FieldValue.serverTimestamp(),
      });
    });

    return { success: true };
  } catch (error) {
    console.error("Reject Invitation Action Failed:", error);
    return { error: error.message || "Failed to reject invitation." };
  }
}
