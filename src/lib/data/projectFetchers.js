// file path: ~/DEVFOLD/SCRIPT-PITCHER/SRC/LIB/DATA/PROJECTFETCHERS.JS

"use server";

import { getAdminServices } from "@/lib/firebase/firebase-admin";
import { FieldPath } from "firebase-admin/firestore";

// (The getDocsInBatches function remains the same as my previous answer)
async function getDocsInBatches(collectionRef, ids) {
  if (!ids || ids.length === 0) {
    return [];
  }
  const batches = [];
  const batchSize = 30;
  for (let i = 0; i < ids.length; i += batchSize) {
    const batchIds = ids.slice(i, i + batchSize);
    const q = collectionRef.where(FieldPath.documentId(), "in", batchIds);
    batches.push(q.get());
  }
  const snapshots = await Promise.all(batches);
  const results = [];
  snapshots.forEach((snapshot) => {
    snapshot.docs.forEach((doc) => results.push({ id: doc.id, ...doc.data() }));
  });
  return results;
}

export async function getProjectsAndMembers(userId) {
  console.log(
    `[getProjectsAndMembers] 🚀 Starting fetch for userId: ${userId}`
  );
  const { db } = getAdminServices();
  if (!db || !userId) {
    // console.log("[getProjectsAndMembers] 🛑 DB or userId is missing. Exiting.");
    return { projects: [], users: [] };
  }

  try {
    // console.log("[getProjectsAndMembers] 1. Fetching user summary document...");
    const summaryRef = db.doc(`users/${userId}/private/summary`);
    const summarySnap = await summaryRef.get();

    if (!summarySnap.exists) {
      // This is correct (it's a property)
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

    const projectsRef = db.collection("projects");
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
      const usersRef = db.collection("users");
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
    // We must convert all Timestamp objects to strings before returning.
    // This is the same logic you use in [projectId]/page.js.

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
        members: members, // Add the serialized members map
      };
    });

    const serializableUsers = fetchedUsers.map((user) => {
      return {
        ...user,
        createdAt: user?.createdAt?.toDate().toISOString() || null,
        lastLogin: user?.lastLogin?.toDate().toISOString() || null,
      };
    });
    // --- END FIX ---

    // console.log(
    //   "[getProjectsAndMembers] 🎉 Fetch complete. Returning SERIALIZED data."
    // );

    // Return the serialized, client-safe data
    return { projects: serializableProjects, users: serializableUsers };
  } catch (err) {
    console.error("Error fetching projects and members:", err.message);
    // Re-throw the error so the client's 'catch' block can see it
    throw new Error(err.message);
  }
}
