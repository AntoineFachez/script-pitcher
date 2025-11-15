// file path: ~/DEVFOLD/SCRIPT-PITCHER/SRC/APP/API/STORAGE/DELETE/ROUTE.JS

import { NextResponse } from "next/server";

import { getAdminServices } from "@/lib/firebase/firebase-admin";

const storageBucketName = "script-pitcher-extracted-images";

/**
 * POST /api/characters
 * Creates a new character document in a project's subcollection.
 */
export async function POST(request) {
  let db, auth;

  try {
    // 2. CRITICAL FIX: Get the stable services inside the handler
    const services = getAdminServices();
    db = services.db;
    auth = services.auth;
    // 1. Get all three required IDs from the client
    const { fileName, projectId, fileId } = await request.json();

    if (!fileName || !projectId || !fileId) {
      return NextResponse.json(
        { error: "fileName, projectId, and fileId are required" },
        { status: 400 } // This is the "Bad Request" error you were seeing
      );
    }

    // 2. Delete the file from Cloud Storage
    // 'fileName' is the full path inside the bucket, e.g., "1352ffeb.../image.png"
    await storage.file(fileName).delete();
    console.log(`Successfully deleted "${fileName}" from GCS.`);

    // 3. Get the correct Firestore document
    // This matches your path: /projects/{projectId}/files/{fileId}
    const docRef = db
      .collection("projects")
      .doc(projectId)
      .collection("files")
      .doc(fileId);

    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      console.warn(
        `Document "${projectId}/files/${fileId}" not found, but GCS file was deleted.`
      );
      return NextResponse.json(
        { message: "File deleted from storage, but document not found." },
        { status: 200 }
      );
    }

    // 4. Filter the 'pages' array to remove the deleted element
    const documentData = docSnap.data();

    // Construct the public URL that is stored in the 'src' field
    const publicUrlToDelete = `https://storage.googleapis.com/${storageBucketName}/${fileName}`;

    // Get the pages array from within the 'processedData' map
    const originalPages = documentData.processedData?.pages || [];

    const updatedPages = originalPages.map((page) => {
      const updatedElements = page.elements.filter((element) => {
        // Keep the element only if its 'src' does not match
        return element.src !== publicUrlToDelete;
      });
      return { ...page, elements: updatedElements };
    });

    // 5. Update the document in Firestore using dot notation
    // This correctly targets the nested 'pages' array
    await docRef.update({ "processedData.pages": updatedPages });

    console.log(
      `Successfully removed element from Firestore document "${fileId}".`
    );

    return NextResponse.json(
      { message: "Element deleted successfully from storage and Firestore." },
      { status: 200 }
    );
  } catch (error) {
    console.error(`Error deleting element:`, error.message);
    // Provide a specific error message
    return NextResponse.json(
      { error: `Internal Server Error: ${error.message}` },
      { status: 500 }
    );
  }
}
