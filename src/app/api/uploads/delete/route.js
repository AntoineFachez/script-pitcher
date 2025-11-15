// file path: ~/DEVFOLD/SCRIPT-PITCHER/SRC/APP/API/STORAGE/DELETE/ROUTE.JS

import { NextResponse } from "next/server";

import { getAdminServices } from "@/lib/firebase/firebase-admin";

/**
 * POST /api/characters
 * Creates a new character document in a project's subcollection.
 */
export async function POST(request) {
  let db, storage;

  try {
    // 2. CRITICAL FIX: Get the stable services inside the handler
    const services = getAdminServices();
    db = services.db;
    storage = services.storage;
    const { fileName, documentId } = await request.json();

    if (!fileName || !documentId) {
      return NextResponse.json(
        { error: "fileName and documentId are required" },
        { status: 400 }
      );
    }

    console.log(
      `API Deleting file: "${fileName}" from document: "${documentId}"`
    );

    // --- Step 1: Delete the file from Cloud Storage ---
    // This now uses the locally-scoped 'bucket' from our helper function
    await storage.file(fileName).delete();
    console.log(`Successfully deleted "${fileName}" from GCS.`);

    // --- Step 2: Remove the element from the Firestore document ---
    // This now uses the locally-scoped 'db' from our helper function
    const docRef = db.collection("documents").doc(documentId);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      console.warn(
        `Document "${documentId}" not found, but GCS file was deleted.`
      );
      return NextResponse.json(
        { message: "File deleted from storage, but document not found." },
        { status: 200 }
      );
    }

    const documentData = docSnap.data();
    const publicUrlToDelete = `https://storage.googleapis.com/${storageBucketName}/${fileName}`;

    // Create a new 'pages' array, filtering out the deleted element
    const updatedPages = documentData.pages.map((page) => {
      const updatedElements = page.elements.filter((element) => {
        // Keep the element only if its 'src' does not match the one we're deleting
        return element.src !== publicUrlToDelete;
      });
      return { ...page, elements: updatedElements };
    });

    // Update the document in Firestore with the modified pages array
    await docRef.update({ pages: updatedPages });
    console.log(
      `Successfully removed element from Firestore document "${documentId}".`
    );

    return NextResponse.json(
      { message: "Element deleted successfully from storage and Firestore." },
      { status: 200 }
    );
  } catch (error) {
    console.error(`Error deleting element:`, error.message);
    // Check if the error is our custom init error
    if (error.message.includes("Firebase")) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
