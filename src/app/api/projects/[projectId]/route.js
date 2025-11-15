// file path: ~/DEVFOLD/SCRIPT-PITCHER/SRC/APP/API/PROJECTS/[PROJECTID]/ROUTE.JS

import { NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { getAdminServices } from "@/lib/firebase/firebase-admin";

/**
 * POST /api/characters
 * Creates a new character document in a project's subcollection.
 */
export async function POST(request) {
  let decodedToken;
  let db, auth;

  const { projectId } = params;
  try {
    // 2. CRITICAL FIX: Get the stable services inside the handler
    const services = getAdminServices();
    db = services.db;
    auth = services.auth;
    // 1. Secure the route: Verify the person calling is logged in
    const idToken = request.headers.get("authorization")?.split("Bearer ")[1];
    if (!idToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    decodedToken = await auth.verifyIdToken(idToken);
  } catch (error) {
    console.error("Auth error:", error.message);
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    // 2. Get the data from the request body
    const { projectData } = await request.json();
    if (!projectData) {
      return NextResponse.json(
        { error: "projectData object is required in the body." },
        { status: 400 }
      );
    }
    if (!projectId) {
      return NextResponse.json(
        { error: "Project ID is required." },
        { status: 400 }
      );
    }

    // 3. Authorization Check: Is the caller a member of this project?
    const projectRef = db.collection("projects").doc(projectId);
    const projectSnap = await projectRef.get();
    if (!projectSnap.exists) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const members = projectSnap.data()?.members;
    const userRole = members?.[decodedToken.uid]; // Get the user's role

    // Check if user is a member (e.g., "owner", "editor", "viewer")
    if (!userRole) {
      return NextResponse.json(
        { error: "Forbidden: You are not a member of this project." },
        { status: 403 }
      );
    }

    // Optional: You could add a more granular check here if needed
    // if (userRole !== "owner" && userRole !== "editor") {
    //   return NextResponse.json(
    //     { error: "Forbidden: You must be an owner or editor to make changes." },
    //     { status: 403 }
    //   );
    // }

    // 4. Prepare the data for update
    // We trust the client has sent the correct `projectData` object
    const dataToUpdate = {
      ...projectData,
      updatedAt: FieldValue.serverTimestamp(),
    };

    // 5. Update the document
    await projectRef.update(dataToUpdate);

    // 6. Respond with the updated data
    return NextResponse.json(
      { id: projectRef.id, ...dataToUpdate },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating project:", error.message);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
