// file path: ~/DEVFOLD/SCRIPT-PITCHER/SRC/LIB/DATA/PROJECTFETCHERS.JS

"use server";

import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  documentId,
} from "firebase-admin/firestore"; // 👈 Change to admin import
import { getAdminServices } from "@/lib/firebase/firebase-admin"; // 👈 Use admin services

/**
 * Helper function to fetch documents in batches to overcome Firestore's
 * 30-item limit for 'in' queries.
 * @param {FirebaseFirestore.CollectionReference} collectionRef - The Firestore collection to query.
 * @param {string[]} ids - The array of document IDs to fetch.
 * @returns {Promise<Array<Object>>} - A promise that resolves to an array of document data.
 */
async function getDocsInBatches(collectionRef, ids) {
  if (!ids || ids.length === 0) {
    return [];
  }

  const batches = [];
  // Firestore 'in' query limit is 30 as of recent updates.
  const batchSize = 30;

  for (let i = 0; i < ids.length; i += batchSize) {
    const batchIds = ids.slice(i, i + batchSize);
    const q = query(collectionRef, where(documentId(), "in", batchIds));
    batches.push(getDocs(q));
  }

  const snapshots = await Promise.all(batches);
  const results = [];
  snapshots.forEach((snapshot) => {
    snapshot.docs.forEach((doc) => results.push({ id: doc.id, ...doc.data() }));
  });

  return results;
}
/**
 * Fetches a user's projects and all associated member profiles.
 * This is a Server Action that runs with admin privileges.
 *
 * @param {string} userId - The Firebase Authentication UID of the user.
 * @returns {Promise<{projects: Array<Object>, users: Array<Object>}>}
 */
export async function getProjectsAndMembers(userId) {
  console.log(
    `[getProjectsAndMembers] 🚀 Starting fetch for userId: ${userId}`
  );
  const { db } = getAdminServices(); // 👈 Get admin db instance
  if (!db || !userId) {
    console.log("[getProjectsAndMembers] 🛑 DB or userId is missing. Exiting.");
    return { projects: [], users: [] };
  }

  try {
    // 1. Get the user's summary document
    console.log("[getProjectsAndMembers] 1. Fetching user summary document...");
    const summaryRef = doc(db, "users", userId, "private", "summary");
    const summarySnap = await getDoc(summaryRef);

    if (!summarySnap.exists()) {
      console.log(
        `[getProjectsAndMembers] ⚠️ No summary document found for user ${userId}. Returning empty data.`
      );
      return { projects: [], users: [] };
    }

    // 2. Get the 'projects' map and extract IDs
    const summaryData = summarySnap.data();
    console.log(
      "[getProjectsAndMembers] 2. ✅ Summary document found:",
      summaryData
    );

    // ⭐️ FIX: Correctly convert Firestore Map to a plain JavaScript object.
    // The spread operator (...) does not work on a Firestore Map object.
    const projectsMap = {};
    if (summaryData.projects && summaryData.projects.forEach) {
      // Firestore returns a Map-like object, so we iterate and build a plain object.
      summaryData.projects.forEach((value, key) => (projectsMap[key] = value));
    }

    if (!projectsMap || Object.keys(projectsMap).length === 0) {
      console.log(
        "[getProjectsAndMembers] ℹ️  User has no projects in their summary. Returning empty data."
      );
      return { projects: [], users: [] };
    }

    const projectIds = Object.keys(projectsMap); // This will now work correctly
    console.log(
      `[getProjectsAndMembers] 3. Found ${projectIds.length} project ID(s):`,
      projectIds
    );

    // 3. Fetch all project documents
    console.log(
      "[getProjectsAndMembers] 4. Fetching project documents in batches..."
    );
    const projectsRef = collection(db, "projects");
    // ⭐️ FIX: Use the batching helper to fetch projects
    const fetchedProjects = await getDocsInBatches(projectsRef, projectIds);

    console.log(
      `[getProjectsAndMembers] 5. ✅ Fetched ${fetchedProjects.length} project documents.`
    );

    // 4. Get all unique member IDs from all projects
    const allMemberIds = new Set();
    fetchedProjects.forEach((project) => {
      Object.keys(project.members || {}).forEach((uid) => {
        allMemberIds.add(uid);
      });
    });

    const uniqueUserIds = Array.from(allMemberIds);
    console.log(
      `[getProjectsAndMembers] 6. Found ${uniqueUserIds.length} unique member ID(s) across all projects.`
    );

    // 5. Fetch all user documents
    let fetchedUsers = [];
    if (uniqueUserIds.length > 0) {
      console.log(
        "[getProjectsAndMembers] 7. Fetching user profile documents..."
      );
      const usersRef = collection(db, "users");
      // ⭐️ FIX: Use the batching helper to fetch users
      fetchedUsers = await getDocsInBatches(usersRef, uniqueUserIds);
      console.log(
        `[getProjectsAndMembers] 8. ✅ Fetched ${fetchedUsers.length} user profiles.`
      );
    } else {
      console.log(
        "[getProjectsAndMembers] 7. ℹ️ No member IDs found, skipping user profile fetch."
      );
    }

    console.log("[getProjectsAndMembers] 🎉 Fetch complete. Returning data.");
    return { projects: fetchedProjects, users: fetchedUsers }; // 👈 Standardize return object
  } catch (err) {
    // ⭐️ LOG the original error message
    console.error("Error fetching projects and members:", err.message);
    // ⭐️ THROW the original error message
    throw new Error(err.message);
  }
}
