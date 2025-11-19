// file path: ~/DEVFOLD/SCRIPT-PITCHER/SRC/LIB/DATA/USERFETCHERS.JS

"use server"; // Must be a Server Action/Function

import { getAdminServices } from "@/lib/firebase/firebase-admin";

// Helper for consistent serialization logic
const serializeTimestamp = (timestamp) =>
  timestamp ? timestamp.toDate().toISOString() : null;

/**
 * Fetches user profile and received invitations/summary data from the server.
 * This function should be called from any Server Component that needs this user data (e.g., layout, dashboard, /me page).
 * @param {string} userId - The Firebase UID of the current user.
 * @returns {object} Contains serializable userProfile and receivedInvitations.
 */
export async function getMeData(userId) {
  if (!userId) {
    return { userProfile: {}, receivedInvitations: [] };
  }
  const { db } = getAdminServices();

  try {
    // 1. Fetch User Profile
    const userProfileSnap = await db.collection("users").doc(userId).get();
    const initialProfile = userProfileSnap.data() || {};

    // 2. Fetch User Summary (where invitations are stored)
    const summarySnap = await db.doc(`users/${userId}/private/summary`).get();
    const summaryData = summarySnap.data() || {};

    const receivedInvitationsMap = summaryData.invitations || {};
    const initialInvitations = Object.keys(receivedInvitationsMap).map(
      (token) => ({
        id: token,
        ...receivedInvitationsMap[token],
      })
    );

    // --- SERIALIZATION ---
    // Serialize profile timestamps
    const serializableProfile = {
      ...initialProfile,
      createdAt: serializeTimestamp(initialProfile?.createdAt),
      updatedAt: serializeTimestamp(initialProfile?.updatedAt),
      lastLogin: serializeTimestamp(initialProfile?.lastLogin),
    };

    // Serialize invitation timestamps
    const serializableInvitations = initialInvitations.map((invite) => ({
      ...invite,
      sentAt: serializeTimestamp(invite?.sentAt),
      expiresAt: serializeTimestamp(invite?.expiresAt),
      acceptedAt: serializeTimestamp(invite?.acceptedAt),
    }));
    // --- END SERIALIZATION ---
    return {
      userProfile: serializableProfile,
      receivedInvitations: serializableInvitations,
    };
  } catch (error) {
    console.error("Failed to fetch user data in Server Action:", error);
    return { userProfile: {}, receivedInvitations: [] };
  }
}
