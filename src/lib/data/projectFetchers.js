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
  const { db } = getAdminServices(); // 👈 Get admin db instance
  if (!db || !userId) {
    // Return empty state if prerequisites are missing
    return { projects: [], users: [] };
  }

  try {
    // 1. Get the user's summary document
    const summaryRef = doc(db, "users", userId, "private", "summary");
    const summarySnap = await getDoc(summaryRef);

    if (!summarySnap.exists()) {
      return { projects: [], users: [] };
    }

    // 2. Get the 'projects' map and extract IDs
    const summaryData = summarySnap.data();
    console.log("summaryData", summaryData);

    // ⭐️ FIX: Convert Firestore Map to a plain JavaScript object
    const projectsMap = { ...(summaryData.projects || {}) };

    if (!projectsMap || Object.keys(projectsMap).length === 0) {
      return { projects: [], users: [] };
    }

    const projectIds = Object.keys(projectsMap); // This will now work correctly

    // 3. Fetch all project documents
    const projectsRef = collection(db, "projects");
    // ⭐️ FIX: Use the batching helper to fetch projects
    const fetchedProjects = await getDocsInBatches(projectsRef, projectIds);

    console.log("fetchedProjects", JSON.stringify(fetchedProjects));

    // 4. Get all unique member IDs from all projects
    const allMemberIds = new Set();
    fetchedProjects.forEach((project) => {
      Object.keys(project.members || {}).forEach((uid) => {
        allMemberIds.add(uid);
      });
    });

    const uniqueUserIds = Array.from(allMemberIds);

    // 5. Fetch all user documents
    let fetchedUsers = [];
    if (uniqueUserIds.length > 0) {
      const usersRef = collection(db, "users");
      // ⭐️ FIX: Use the batching helper to fetch users
      fetchedUsers = await getDocsInBatches(usersRef, uniqueUserIds);
    }

    return { projects: fetchedProjects, users: fetchedUsers }; // 👈 Standardize return object
  } catch (err) {
    console.error("Error fetching projects and members:", err);
    throw new Error("Failed to load project data."); // Re-throw to be handled by the Server Component
  }
}
