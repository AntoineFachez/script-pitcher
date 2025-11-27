// file path: ~/DEVFOLD/SCRIPT-PITCHER/SRC/APP/API/DOCUMENT/ROUTE.JS

import { NextResponse } from "next/server";
import { getAdminServices } from "@/lib/firebase/firebase-admin";
import { DB_PATHS } from "@/lib/firebase/paths";

/**
 * Securely fetches a single document's data.
 *
 * This endpoint expects a Firebase ID Token in the Authorization header.
 * It also expects `projectId` and `fileId` as query parameters.
 *
 * Example: GET /api/document?projectId=...&fileId=...
 */
export async function GET(request) {
  try {
    // 1. Authenticate the user
    const { db, auth } = getAdminServices();
    const idToken = request.headers.get("Authorization")?.split("Bearer ")[1];
    if (!idToken) {
      return NextResponse.json(
        { error: "No authorization token provided." },
        { status: 401 }
      );
    }
    const decodedToken = await auth.verifyIdToken(idToken);
    const uid = decodedToken.uid;

    // 2. Get query parameters
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get("projectId");
    const fileId = searchParams.get("fileId");

    if (!projectId || !fileId) {
      return NextResponse.json(
        { error: "Missing required query parameters: projectId and fileId" },
        { status: 400 }
      );
    }

    // 3. Verify user permissions
    // Check if the user is a member of the project
    const projectRef = db.doc(DB_PATHS.project(projectId));
    const projectSnap = await projectRef.get();

    if (!projectSnap.exists) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const projectData = projectSnap.data();
    if (!projectData.members || !projectData.members[uid]) {
      return NextResponse.json(
        { error: "You are not authorized to view this document." },
        { status: 403 }
      );
    }

    // 4. Fetch the document
    const fileRef = projectRef.collection("files").doc(fileId);
    const fileSnap = await fileRef.get();

    if (!fileSnap.exists) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    // 5. Return the document data
    return NextResponse.json(fileSnap.data(), { status: 200 });
  } catch (error) {
    console.error("Error fetching document:", error);
    if (error.code === "auth/id-token-expired") {
      return NextResponse.json({ error: "Token expired." }, { status: 401 });
    }
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
