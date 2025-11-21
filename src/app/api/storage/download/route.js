// file path: ~/DEVFOLD/SCRIPT-PITCHER/SRC/APP/API/STORAGE/DOWNLOAD/ROUTE.JS

import { NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore"; // 1. Import FieldValue for serverTimestamp
import { getAdminServices } from "@/lib/firebase/firebase-admin";

/**
 * POST /api/storage/download
 * Generates a temporary, signed URL for a GCS object configured to force download
 * and logs the download event in Firestore for tracking.
 */
export async function POST(request) {
  let auth, storage, db, decodedToken;

  try {
    // 1. Initialize Admin Services and Authenticate User
    const services = getAdminServices();
    auth = services.auth;
    storage = services.storage;
    db = services.db; // Get Firestore DB service

    // 1.1. Secure the route: Verify the person calling is logged in
    const idToken = request.headers.get("authorization")?.split("Bearer ")[1];
    if (!idToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    decodedToken = await auth.verifyIdToken(idToken);

    // 2. Get All Input Data (CRITICAL: Read request body ONCE)
    const { gcsPath, fileName, projectId, fileId } = await request.json();

    // 2.1. Input Validation
    if (!gcsPath || !projectId || !fileId) {
      return NextResponse.json(
        { error: "gcsPath, projectId, and fileId are required in the body." },
        { status: 400 }
      );
    }

    const userId = decodedToken.uid;

    // 3. Log the Download Event to Firestore (Tracking)
    await db.collection("fileDownloads").add({
      userId: userId,
      projectId: projectId,
      fileId: fileId,
      fileName: fileName,
      downloadedAt: FieldValue.serverTimestamp(),
      //TODO: ipAddress: request.headers.get('x-forwarded-for') || request.ip, // if using Express/Cloud Run
    });

    // 4. Configure File Reference and Signed URL Generation
    // CRITICAL: Ensure the bucket name matches your configuration
    const bucketName =
      process.env.FIREBASE_STORAGE_BUCKET || "script-pitcher-extracted-images";
    const file = storage.bucket(bucketName).file(gcsPath);

    const options = {
      action: "read",
      // Set expiration for temporary access (e.g., 15 minutes)
      expires: Date.now() + 15 * 60 * 1000,
      // CRITICAL: Force the browser to download the file using Content-Disposition
      responseDisposition: `attachment; filename="${fileName || "download"}"`,
    };

    // 5. Generate the Signed URL
    const [downloadUrl] = await file.getSignedUrl(options);

    // 6. Respond with the Signed Download URL
    return NextResponse.json({ downloadUrl }, { status: 200 });
  } catch (error) {
    console.error("Download URL generation failed:", error.message);
    return NextResponse.json(
      { error: "Internal Server Error during download URL generation." },
      { status: 500 }
    );
  }
}
