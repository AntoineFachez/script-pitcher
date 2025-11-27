// file path: ~/DEVFOLD/SCRIPT-PITCHER/SRC/LIB/DATA/PROJECTFETCHERS.JS

"use server";

import { getAdminServices } from "@/lib/firebase/firebase-admin";
import { getDocsInBatches } from "../firebase/utils";
import { DB_PATHS } from "@/lib/firebase/paths";

export async function getProjectsAndMembers(userId) {
  // console.log(
  //   `[getProjectsAndMembers] 🚀 Starting fetch for userId: ${userId}`
  // );
  const { db } = getAdminServices();
  if (!db || !userId) {
    // console.log("[getProjectsAndMembers] 🛑 DB or userId is missing. Exiting.");
    return { projects: [], users: [] };
  }

  try {
    // console.log("[getProjectsAndMembers] 1. Fetching user summary document...");
    const summaryRef = db.doc(DB_PATHS.userSummary(userId));
    const summarySnap = await summaryRef.get();

    if (!summarySnap.exists) {
      // console.log(
      //   `[getProjectsAndMembers] ⚠️ No summary document found for user ${userId}. Returning empty data.`
      // );
      return { projects: [], users: [] };
    }

    const summaryData = summarySnap.data();
    const projectsMap = summaryData.projects || {};

    if (Object.keys(projectsMap).length === 0) {
      // console.log(
      //   "[getProjectsAndMembers] ℹ️  User has no projects in their summary. Returning empty data."
      // );
      return { projects: [], users: [] };
    }

    const projectIds = Object.keys(projectsMap);
    // console.log(
    //   `[getProjectsAndMembers] 3. Found ${projectIds.length} project ID(s):`
    // );

    const projectsRef = db.collection(DB_PATHS.projects());
    const fetchedProjects = await getDocsInBatches(projectsRef, projectIds);

    // console.log(
    //   `[getProjectsAndMembers] 5. ✅ Fetched ${fetchedProjects.length} project documents.`
    // );

    const allMemberIds = new Set();
    fetchedProjects.forEach((project) => {
      Object.keys(project.members || {}).forEach((uid) => {
        allMemberIds.add(uid);
      });
    });

    const uniqueUserIds = Array.from(allMemberIds);
    // console.log(
    //   `[getProjectsAndMembers] 6. Found ${uniqueUserIds.length} unique member ID(s).`
    // );

    let fetchedUsers = [];
    if (uniqueUserIds.length > 0) {
      // console.log(
      //   "[getProjectsAndMembers] 7. Fetching user profile documents..."
      // );
      const usersRef = db.collection(DB_PATHS.users());
      fetchedUsers = await getDocsInBatches(usersRef, uniqueUserIds);
      // console.log(
      //   `[getProjectsAndMembers] 8. ✅ Fetched ${fetchedUsers.length} user profiles.`
      // );
    } else {
      console.log(
        "[getProjectsAndMembers] 7. ℹ️ No member IDs found, skipping user profile fetch."
      );
    }

    // --- START FIX: Serialize Timestamps ---
    const serializableProjects = fetchedProjects.map((project) => {
      const members = project.members
        ? Object.fromEntries(
          Object.entries(project.members).map(([id, roleData]) => [
            id,
            {
              ...roleData,
              joinedAt: roleData?.joinedAt?.toDate().toISOString() || null,
            },
          ])
        )
        : {};

      return {
        ...project,
        createdAt: project?.createdAt?.toDate().toISOString() || null,
        updatedAt: project?.updatedAt?.toDate().toISOString() || null,
        members: members,
      };
    });

    const serializableUsers = fetchedUsers.map((user) => {
      return {
        ...user,
        createdAt: user?.createdAt?.toDate().toISOString() || null,
        updatedAt: user?.updatedAt?.toDate().toISOString() || null,
        lastLogin: user?.lastLogin?.toDate().toISOString() || null, //TODO: implement lastLogIn Project Setter
      };
    });
    // --- END FIX ---

    // --- START FIX: Enrichment / Cross-Referencing ---

    // 1. Create a Map of users for fast lookup by ID
    const userMap = new Map(serializableUsers.map((u) => [u.id, u]));

    // 2. Enrich Projects: Inject full user profile data into the project.members object
    const enrichedProjects = serializableProjects.map((project) => {
      const enrichedMembers = {};

      // Iterate over the existing members (which contain role/joinedAt)
      if (project.members) {
        Object.entries(project.members).forEach(([uid, roleData]) => {
          const userProfile = userMap.get(uid) || {};

          // Merge user profile properties into the member object.
          // Note: If `roleData` and `userProfile` share keys, the order determines priority.
          // Usually we want the profile data (displayName, avatar) + the role data.
          enrichedMembers[uid] = {
            ...userProfile, // displayName, email, etc.
            ...roleData, // role, joinedAt, etc.
          };
        });
      }

      return {
        ...project,
        members: enrichedMembers,
      };
    });

    // 3. Enrich Users: Add an array of projects the user belongs to
    const enrichedUsers = serializableUsers.map((user) => {
      // Find all projects where this user's ID exists in the members keys
      const userProjects = enrichedProjects.filter(
        (project) => project.members && project.members[user.id]
      );

      return {
        ...user,
        projects: userProjects, // Attaches the full array of (now enriched) projects
      };
    });

    // --- END FIX ---

    // console.log(
    //   "[getProjectsAndMembers] 🎉 Fetch complete. Returning ENRICHED data."
    // );

    return { projects: enrichedProjects, users: enrichedUsers };
  } catch (err) {
    console.error("Error fetching projects and members:", err.message);
    throw new Error(err.message);
  }
}
