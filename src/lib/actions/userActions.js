// file path: ~/DEVFOLD/SCRIPT-PITCHER/SRC/LIB/ACTIONS/USERACTIONS.JS

"use server";

import { getAdminServices } from "@/lib/firebase/firebase-admin";

// import { headers } from "next/headers"; // <-- NO LONGER NEEDED

/**
 * Fetches the list of projects that a target user is in, *but only
 * the projects that the currently logged-in user (the "teamLeader")
 * is ALSO in and has an "owner" role in.
 *
 * @param {string} targetUserId - The UID of the user to query.
 * @param {string} idToken - The Firebase ID token of the user making the request.
 */
export async function getSharedProjectsForUser(targetUserId, idToken) {
  const { db, auth } = getAdminServices();
  // 2. Get the currently logged-in user (the "teamLeader") from the passed token
  let teamLeaderUid;
  try {
    // const idToken = headers().get("Authorization")?.split("Bearer ")[1]; // <-- REMOVE
    if (!idToken) throw new Error("No authorization token provided."); // <-- UPDATE

    // Verify the token that was passed as an argument
    const decodedToken = await auth.verifyIdToken(idToken);
    teamLeaderUid = decodedToken.uid;
  } catch (error) {
    console.error("Auth error in server action:", error.message);
    return { error: "You are not authorized to perform this action." };
  }

  if (teamLeaderUid === targetUserId) {
    // This check is probably fine, but you might want to allow
    // admins to query themselves. Your call.
    return { error: "Cannot query projects for yourself." };
  }
  console.log("teamLeaderUid", teamLeaderUid, targetUserId);

  try {
    // 3. Fetch both users' private summary documents
    const leaderSummaryRef = db.doc(`users/${teamLeaderUid}/private/summary`);
    const memberSummaryRef = db.doc(`users/${targetUserId}/private/summary`);

    const [leaderSnap, memberSnap] = await Promise.all([
      leaderSummaryRef.get(),
      memberSummaryRef.get(),
    ]);

    if (!leaderSnap.exists || !memberSnap.exists) {
      return { error: "User data not found." };
    }

    const leaderProjectsMap = leaderSnap.data().projects || {};
    const memberProjectsMap = memberSnap.data().projects || {};

    // 4. Compute the intersection (This logic is correct)
    const sharedProjects = [];
    for (const projectId in memberProjectsMap) {
      const memberRole = memberProjectsMap[projectId].role;
      const leaderProjectInfo = leaderProjectsMap[projectId];

      if (leaderProjectInfo) {
        const leaderRole = leaderProjectInfo.role;
        // Business logic: Only show if the leader is an "owner" or "admin"
        if (leaderRole === "owner" || leaderRole === "admin") {
          sharedProjects.push({
            id: projectId,
            projectName: leaderProjectInfo.projectName,
            memberRole: memberRole,
          });
        }
      }
    }

    // 5. Return *only* the safe, computed list
    return { data: sharedProjects };
  } catch (error) {
    console.error("Error fetching shared projects:", error);
    return { error: "Failed to get shared projects." };
  }
}
