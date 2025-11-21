// file path: ~/DEVFOLD/SCRIPT-PITCHER/SRC/APP/API/STORAGE/DOWNLOAD/ROUTE.JS

import { NextResponse } from "next/server";
import { getAdminServices } from "@/lib/firebase/firebase-admin";

/**
 * POST /api/storage/download
 * Generates a temporary, signed URL for a GCS object configured to force download.
 */
export async function POST(request) {
  let auth, storage;

  try {
    // 1. Get Admin Services
    const services = getAdminServices();
    auth = services.auth;
    storage = services.storage; // Assuming this provides the GCS client

    // 2. Authentication
    const idToken = request.headers.get("authorization")?.split("Bearer ")[1];
    if (!idToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    await auth.verifyIdToken(idToken); // Ensure the user is authenticated

    // 3. Get input data
    const { gcsPath, fileName } = await request.json();
    if (!gcsPath) {
      return NextResponse.json(
        { error: "gcsPath is required." },
        { status: 400 }
      );
    }

    // 4. Determine bucket and file reference
    // CRITICAL: Replace 'your-storage-bucket-name' with your actual bucket name
    const bucketName =
      process.env.FIREBASE_STORAGE_BUCKET || "script-pitcher-extracted-images";
    const file = storage.bucket(bucketName).file(gcsPath);

    // 5. Configure options for signed URL (force download)
    const options = {
      action: "read",
      // Expires in 15 minutes
      expires: Date.now() + 15 * 60 * 1000,
      // CRITICAL: Force the browser to download the file
      responseDisposition: `attachment; filename="${fileName || "download"}"`,
    };

    // 6. Generate the signed URL
    const [downloadUrl] = await file.getSignedUrl(options);

    // 7. Respond with the download URL
    return NextResponse.json({ downloadUrl }, { status: 200 });
  } catch (error) {
    console.error("Download URL generation failed:", error.message);
    return NextResponse.json(
      { error: "Internal Server Error during download URL generation." },
      { status: 500 }
    );
  }
}
