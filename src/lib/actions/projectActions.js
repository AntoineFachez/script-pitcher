// file path: ~/DEVFOLD/SCRIPT-PITCHER/SRC/LIB/ACTIONS/PROJECTACTIONS.JS

"use server";

import { FieldValue } from "firebase-admin/firestore";
import { getAdminServices } from "@/lib/firebase/firebase-admin";
// ❌ Ensure you are NOT importing modular Client SDK functions like
// { doc, updateDoc, collection } from 'firebase/firestore' in this file.

export async function toggleProjectPublishState(projectId, newPublishedState) {
  // 1. Get the Admin SDK database instance
  const { db } = getAdminServices();

  try {
    // 2. Use the Firebase Admin SDK Syntax to get the document reference
    // Admin SDK uses .collection().doc() syntax directly on the db object.
    const projectRef = db.collection("projects").doc(projectId);

    // 3. Use the Admin SDK Syntax for updating the document
    await projectRef.update({
      published: newPublishedState,
      updatedAt: FieldValue.serverTimestamp(), // Optional: if you have a custom timestamp setup
    });

    return { success: true };
  } catch (error) {
    console.error("Server Action Failed:", error.message);
    // The error object returned to the client must be a plain object
    return { error: error.message };
  }
}
