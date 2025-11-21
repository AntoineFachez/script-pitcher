// file path: ~/DEVFOLD/SCRIPT-PITCHER/SRC/APP/API/STORAGE/GETSIGNEDURL/ROUTE.JS

import { NextResponse } from "next/server";
import { getAdminServices } from "@/lib/firebase/firebase-admin"; // Utility to get initialized Admin services
// Note: You might need to adjust getAdminServices to also return a configured
// instance of @google-cloud/storage, or initialize it here.

/**
 * Helper function to generate the signed URL using the Admin SDK's storage service.
 * Assumes the admin SDK is initialized to use a service account with Storage access.
 *
 * @param {string} gcsPath - The path to the file in the bucket (e.g., 'project-id/file-id/image.jpg').
 * @param {object} storage - The initialized Google Cloud Storage client instance.
 * @returns {Promise<string>} The generated signed URL.
 */
async function generateSignedUrl(storage, gcsPath) {
  // CRITICAL: Replace 'your-storage-bucket-name' with your actual bucket name
  // based on your Firebase configuration.
  const bucketName =
    process.env.FIREBASE_STORAGE_BUCKET || "script-pitcher-extracted-images";

  // The GCS path needs to be prefixed with the bucket name
  const file = storage.bucket(bucketName).file(gcsPath);

  // Define options for the signed URL
  const options = {
    action: "read",
    // The URL will expire in 15 minutes (900 seconds)
    expires: Date.now() + 15 * 60 * 1000,
  };

  // Get the signed URL. The return is an array containing the URL string.
  const [url] = await file.getSignedUrl(options);
  return url;
}

/**
 * POST /api/storage/getSignedUrl
 * Generates a temporary, signed URL for a private GCS object.
 */
export async function POST(request) {
  let db, auth, storage; // Storage client instance

  try {
    // 1. Get Admin Services (including Storage if possible)
    const services = getAdminServices();
    db = services.db;
    auth = services.auth;
    // NOTE: If getAdminServices doesn't expose the GCS client,
    // you need to initialize it here or import it from your lib file.
    storage = services.storage; // Assuming getAdminServices includes 'storage'

    // 2. Secure the route: Verify the person calling is logged in
    const idToken = request.headers.get("authorization")?.split("Bearer ")[1];
    if (!idToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const decodedToken = await auth.verifyIdToken(idToken);

    // 3. Get the data from the request body
    const { gcsPath } = await request.json();
    if (!gcsPath || typeof gcsPath !== "string") {
      return NextResponse.json(
        { error: "gcsPath string is required in the body." },
        { status: 400 }
      );
    }

    // 4. Authorize User (Optional, but recommended):
    // If files are project-specific, you'd check here if decodedToken.uid
    // has access to the project associated with the gcsPath.
    // This is typically handled robustly by your Firebase Storage Rules,
    // but a server-side check adds an extra layer of security.

    // For now, we rely on authenticated user and Storage Rules.

    // 5. Generate the signed URL
    const signedUrl = await generateSignedUrl(storage, gcsPath);

    // 6. Respond with the signed URL
    return NextResponse.json({ url: signedUrl }, { status: 200 });
  } catch (error) {
    console.error("Signed URL generation failed:", error.message);
    // If the error is an authorization failure, you may return 403 or 401
    // Otherwise, return 500
    return NextResponse.json(
      { error: "Internal Server Error during URL generation." },
      { status: 500 }
    );
  }
}
