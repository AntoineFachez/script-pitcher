// file path: ~/DEVFOLD/SCRIPT-PITCHER/SRC/APP/API/CHARACTERS/ROUTE.JS

import { NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";

import { getAdminServices } from "@/lib/firebase/firebase-admin";

/**
 * POST /api/characters
 * Creates a new character document in a project's subcollection.
 */
export async function POST(request) {
  // 1. Declare variables outside the try block
  let decodedToken;
  let db, auth;

  try {
    // 2. CRITICAL FIX: Get the stable services inside the handler
    const services = getAdminServices();
    db = services.db;
    auth = services.auth;

    // Secure the route
    const idToken = request.headers.get("authorization")?.split("Bearer ")[1];

    if (!idToken) {
      // Throw an error here to jump to the catch block for unauthorized handling
      throw new Error("ID token missing");
    }

    // Verify the token using the stable 'auth' object
    decodedToken = await auth.verifyIdToken(idToken);
  } catch (error) {
    // Log the error detail for debugging
    console.error("Authentication/Initialization error:", error.message);

    // Return 401 for auth errors or failed token verification
    if (
      error.code === "auth-invalid-credential" ||
      error.message.includes("ID token missing")
    ) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    // Check for Firebase initialization failure
    if (error.message.includes("Firebase Admin SDK failed to initialize")) {
      return NextResponse.json(
        { error: "Server Configuration Error." },
        { status: 500 }
      );
    }

    // Catch-all for other auth errors
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  // --- Start Data Processing (Safe to proceed with stable 'db') ---
  try {
    // 1. Get the data from the request body
    const { projectId, name, archetype, description, avatarUrl, imageUrl } =
      await request.json();

    // 2. Validate required data
    if (!projectId) {
      return NextResponse.json(
        { error: "Project ID is required to create a character." },
        { status: 400 }
      );
    }

    // TODO: Implement actual membership check here using 'db'

    // 3. Define the new character data
    const newCharacterDoc = {
      name: name || "New Character",
      archetype: archetype || "",
      description: description || "",
      avatarUrl: avatarUrl || "",
      imageUrl: imageUrl || "",
      createdAt: FieldValue.serverTimestamp(),
      ownerId: decodedToken.uid, // Track who created the character
    };

    // 4. Add the document to the /characters subcollection
    const charRef = await db
      .collection("projects")
      .doc(projectId)
      .collection("characters")
      .add(newCharacterDoc);

    // 5. Respond with the created data
    return NextResponse.json(
      { id: charRef.id, ...newCharacterDoc },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating character document:", error.message);
    // 🚨 Always return a specific, non-crashing response here
    return NextResponse.json(
      { error: "Failed to create character." },
      { status: 500 }
    );
  }
}
