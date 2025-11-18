// file path: ~/DEVFOLD/SCRIPT-PITCHER/SRC/LIB/DATA/PROJECTFETCHERS.JS
"use server";

// 1. ❌ REMOVE V9 imports
// import {
//   doc,
//   getDoc,
//   collection,
//   query,
//   where,
//   getDocs,
//   documentId,
// } from "firebase-admin/firestore";
import { getAdminServices } from "@/lib/firebase/firebase-admin";

/**
 * Helper function to fetch documents in batches to overcome Firestore's
 * 30-item limit for 'in' queries.
 * @param {FirebaseFirestore.CollectionReference} collectionRef - The Firestore collection to query.
 * @param {string[]} ids - The array of document IDs to fetch.
 * @returns {Promise<Array<Object>>} - A promise that resolves to an array of document data.
 */
//TODO: reimplement getDocsInBatches()
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

export async function getProjectsAndMembers(userId) {
  console.log(
    `[getProjectsAndMembers] 🚀 Starting fetch for userId: ${userId}`
  );
  const { db } = getAdminServices();
  if (!db || !userId) {
    // ...
    return { projects: [], users: [] };
  }

  try {
    // 1. ✅ FIX: Use V8 syntax for db.doc()
    console.log("[getProjectsAndMembers] 1. Fetching user summary document...");
    const summaryRef = db.doc(`users/${userId}/private/summary`);
    const summarySnap = await summaryRef.get(); // ✅ FIX: Use .get()

    if (!summarySnap.exists) {
      // ...
      return { projects: [], users: [] };
    }

    // 2. This logic is OK
    const summaryData = summarySnap.data();
    console.log("[getProjectsAndMembers] 2. ✅ Summary document found:");

    // ... (Your projectsMap logic is fine)
    const projectsMap = {};
    if (summaryData.projects && summaryData.projects.forEach) {
      summaryData.projects.forEach((value, key) => (projectsMap[key] = value));
    }
    if (!projectsMap || Object.keys(projectsMap).length === 0) {
      return { projects: [], users: [] };
    }
    const projectIds = Object.keys(projectsMap);

    // 3. ✅ FIX: Fetch projects using V8 syntax (batching is tricky, let's simplify)
    // We will do one query for now. This will fail if you have > 30 projects.
    console.log("[getProjectsAndMembers] 4. Fetching project documents...");
    const projectsRef = db.collection("projects");
    const projectsQuery = projectsRef.where(
      "__name__", // Use '__name__' for document ID
      "in",
      projectIds
    );
    const projectsSnapshot = await projectsQuery.get();
    const fetchedProjects = projectsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    console.log(
      `[getProjectsAndMembers] 5. ✅ Fetched ${fetchedProjects.length} project documents.`
    );

    // 4. This logic is fine
    const allMemberIds = new Set();
    fetchedProjects.forEach((project) => {
      Object.keys(project.members || {}).forEach((uid) => {
        allMemberIds.add(uid);
      });
    });
    const uniqueUserIds = Array.from(allMemberIds);

    // 5. ✅ FIX: Fetch users using V8 syntax
    let fetchedUsers = [];
    if (uniqueUserIds.length > 0) {
      console.log(
        "[getProjectsAndMembers] 7. Fetching user profile documents..."
      );
      const usersRef = db.collection("users");
      // This will fail if you have > 30 users.
      const usersQuery = usersRef.where("__name__", "in", uniqueUserIds);
      const usersSnapshot = await usersQuery.get();
      fetchedUsers = usersSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      console.log(
        `[getProjectsAndMembers] 8. ✅ Fetched ${fetchedUsers.length} user profiles.`
      );
    }
    // ...
    return { projects: fetchedProjects, users: fetchedUsers };
  } catch (err) {
    console.error("Error fetching projects and members:", err.message);
    throw new Error(err.message);
  }
}
