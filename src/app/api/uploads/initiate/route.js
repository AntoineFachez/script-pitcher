// filepath: ~/DEVFOLD/SCRIPT-PITCHER/SRC/APP/API/UPLOADS/INITIATE/ROUTE.JS

import { NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore"; // KEEP FieldValue, as it's a constant

import { getAdminServices } from "@/lib/firebase/firebase-admin";
import { DB_PATHS } from "@/lib/firebase/paths";

/**
 * POST /api/uploads/initiate
 * Handles both new project creation and adding new files.
 */
export async function POST(request) {
  let decodedToken;
  let db, auth, storage;
  // Use the imported services directly

  // NOTE: FIREBASE_STORAGE_BUCKET must be retrieved from process.env
  // or provided during the Admin SDK initialization in firebase-admin.js
  const storageBucket =
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ||
    process.env.FIREBASE_STORAGE_BUCKET;

  try {
    // 2. CRITICAL FIX: Get the stable services inside the handler
    const services = getAdminServices();
    db = services.db;
    auth = services.auth;
    storage = services.storage;

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
    // 1. Parse request body
    const {
      projectData, // (Optional) For new projects
      projectId, // (Optional) For existing projects
      fileMetadata,
    } = await request.json();

    if (!fileMetadata || (!projectData && !projectId)) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    // --- 2. REFACTORED LOGIC (No changes here) ---
    const isNewProject = !!projectData;
    let finalProjectId;

    if (isNewProject) {
      // --- This logic now ONLY runs for NEW projects ---
      const primaryFormat =
        projectData.formats && projectData.formats.length > 0
          ? projectData.formats[0].format // Get the string "TV-Serie"
          : "Uncategorized"; // Fallback if something went wrong

      finalProjectId = `${primaryFormat}_${projectData.title
        .trim()
        .replace(/ /g, "-")}-${crypto.randomUUID().slice(0, 8)}`;
    } else {
      // --- This logic runs for ADDING FILES to existing projects ---
      finalProjectId = projectId;
    }
    // --- END REFACTORED LOGIC ---

    // 3. Generate secure IDs and the *canonical storage path*
    const fileId = crypto.randomUUID();
    // const storagePath = `${decodedToken.uid}/projects/${finalProjectId}/files/${fileId}/upload/${fileId}.pdf`;
    const storagePath = `${decodedToken.uid}/projects/${finalProjectId}/files/${fileId}.pdf`;

    // 4. Prepare Firestore document references
    const projectRef = db.doc(DB_PATHS.project(finalProjectId)); // ✅ Use stable db
    const fileRef = projectRef.collection("files").doc(fileId);
    // --- ADD THIS ---
    const lookupRef = db.doc(DB_PATHS.fileLookup(fileId)); // ✅ Use stable db

    // 5. Run an atomic batch write
    const batch = db.batch(); // ✅ Use stable db

    if (isNewProject) {
      // Create the main project document
      const newProjectDoc = {
        ...projectData,
        id: finalProjectId,
        project: finalProjectId,
        uploaderId: decodedToken.uid,
        createdAt: FieldValue.serverTimestamp(),
        members: {
          [decodedToken.uid]: {
            role: "owner",
            joinedAt: FieldValue.serverTimestamp(), // Use server timestamp
            invitedBy: null, // The owner wasn't invited
          },
        },
      };
      batch.set(projectRef, newProjectDoc);
    } else {
      // --- OPTIONAL BUT RECOMMENDED ---
      // For existing projects, just update the 'updatedAt' timestamp
      batch.update(projectRef, { updatedAt: FieldValue.serverTimestamp() });
    }

    // Create the file subcollection document
    const fileDocData = {
      ...fileMetadata,
      fileId: fileId,
      storagePath: storagePath,
      status: "UPLOADING", // The processor will change this
      uploaderId: decodedToken.uid,
      createdAt: FieldValue.serverTimestamp(),
    };
    batch.set(fileRef, fileDocData);

    // --- ADD THIS ---
    // Create the lookup document required by storage rules
    batch.set(lookupRef, { projectId: finalProjectId });

    // Commit the metadata
    await batch.commit();

    // 6. Generate the Signed URL
    // 6. Generate the Signed URL
    let signedUrl;
    try {
      [signedUrl] = await storage // ✅ Use stable storage
        .bucket(storageBucket)
        .file(storagePath)
        .getSignedUrl({
          action: "write",
          version: "v4",
          expires: Date.now() + 15 * 60 * 1000, // 15 minutes
          contentType: fileMetadata.fileType,
        });
    } catch (signError) {
      console.error("Error signing URL:", signError);
      // Check for specific IAM permission error
      if (
        signError.message &&
        signError.message.includes("iam.serviceAccounts.signBlob")
      ) {
        return NextResponse.json(
          {
            error:
              "Server Configuration Error: The service account is missing the 'iam.serviceAccounts.signBlob' permission. Please check your Google Cloud IAM settings or local credentials.",
            details: signError.message,
          },
          { status: 500 }
        );
      }
      throw signError; // Re-throw other errors to be caught by the outer catch
    }

    // 7. Respond with the URL and IDs
    return NextResponse.json(
      {
        success: true,
        signedUrl,
        projectId: finalProjectId,
        fileId,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating project/file:", error.message);
    // Send back the specific error message for debugging
    return NextResponse.json(
      { error: error.message || "Internal Server Error." },
      { status: 500 }
    );
  }
}
