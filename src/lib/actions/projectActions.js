// file path: ~/DEVFOLD/SCRIPT-PITCHER/SRC/LIB/ACTIONS/PROJECTACTIONS.JS

"use server";

import { revalidatePath } from "next/cache";
import { getAdminServices } from "@/lib/firebase/firebase-admin";

// This is a Server Action. It only runs on the server.
export async function toggleProjectPublishState(projectId, newPublishedState) {
  console.log("projectId", projectId);

  if (!projectId) {
    return { error: "Missing project ID." };
  }

  try {
    const { db } = getAdminServices();
    const projectRef = db.collection("projects").doc(projectId);

    await projectRef.update({
      published: newPublishedState,
    });

    // Tell Next.js to refresh the data for these pages
    revalidatePath("/projects"); // Revalidates the list page
    revalidatePath(`/projects/${projectId}`); // Revalidates the detail page

    return { success: true };
  } catch (error) {
    console.error("toggleProjectPublishState error:", error);
    return { error: "Failed to update project." };
  }
}

// You would add other actions here
export async function addFileToProject(projectId, fileMetadata) {
  // ... your logic to add a file
  // ...
  // revalidatePath(`/projects/${projectId}`);
}
