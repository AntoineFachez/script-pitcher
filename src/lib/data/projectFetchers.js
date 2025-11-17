// file path: ~/DEVFOLD/SCRIPT-PITCHER/SRC/LIB/DATA/PROJECTFETCHERS.JS

import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  documentId,
} from "firebase/firestore";
import { getFirebaseDb } from "@/lib/firebase/firebase-client";

/**
 * Fetches a user's projects and all associated member profiles.
 * This function is designed to be called from a Next.js Server Component or Server Action.
 *
 * @param {string} userId - The Firebase Authentication UID of the user.
 * @returns {Promise<{projects: Array<Object>, users: Array<Object>}>}
 */
export async function getProjectsAndMembers(userId) {
  const db = getFirebaseDb();
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
    const projectsMap = summaryData.projects;

    if (!projectsMap || Object.keys(projectsMap).length === 0) {
      return { projects: [], users: [] };
    }

    const projectIds = Object.keys(projectsMap);

    // 3. Fetch all project documents
    const projectsRef = collection(db, "projects");
    // Note: The 'in' query supports up to 10 projectIds. Batching is needed for more.
    const qP = query(projectsRef, where(documentId(), "in", projectIds));
    const queryProjectsSnapshot = await getDocs(qP);

    const fetchedProjects = queryProjectsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

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
      // Note: The 'in' query supports up to 10 userIds. Batching is needed for more.
      const qU = query(usersRef, where(documentId(), "in", uniqueUserIds));
      const queryUsersSnapshot = await getDocs(qU);

      fetchedUsers = queryUsersSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    }

    return { fetchedProjects, fetchedUsers };
  } catch (err) {
    console.error("Error fetching projects and members:", err);
    throw new Error("Failed to load project data."); // Re-throw to be handled by the Server Component
  }
}
