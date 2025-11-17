// file path: ~/DEVFOLD/SCRIPT-PITCHER/SRC/LIB/ACTIONS/PROJECTACTIONS.JS

"use server";

import { revalidatePath } from "next/cache";
import { doc, updateDoc } from "firebase/firestore"; // Or "firebase-admin/firestore"
import { getAdminServices } from "@/lib/firebase/firebase-admin";

// (Keep your existing toggleProjectPublishState function)
export async function toggleProjectPublishState(projectId, newPublishedState) {
  const { db } = getAdminServices();
  if (!projectId) {
    return { error: "Missing project ID" };
  }

  try {
    const projectRef = doc(db, "projects", projectId);
    await updateDoc(projectRef, {
      published: newPublishedState,
    });

    // ⭐️ ADD THIS LINE ⭐️
    // This tells Next.js to refresh the data for the '/projects' page.
    revalidatePath("/projects");

    return { success: true };
  } catch (error) {
    console.error("Error toggling publish state:", error);
    return { error: error.message };
  }
}
