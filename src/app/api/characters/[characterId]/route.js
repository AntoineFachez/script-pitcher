// file path: ~/DEVFOLD/SCRIPT-PITCHER/SRC/APP/API/CHARACTERS/[CHARACTERID]/ROUTE.JS

import { NextResponse } from "next/server";
import { getAdminServices } from "@/lib/firebase/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";

/**
 * PUT /api/characters/[characterId]
 * Updates an existing character document in Firestore.
 */
export async function PUT(request, { params }) {
  const { db, auth } = getAdminServices();

  const { characterId } = params; // Get the character ID from the URL

  try {
    // Secure the route
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
    // 1. Get the data from the request body
    const { projectId, name, archetype, description, avatarUrl, imageUrl } =
      await request.json();

    // 2. Validate required data
    if (!projectId) {
      return NextResponse.json(
        { error: "Project ID is required in the request body." },
        { status: 400 }
      );
    }
    if (!characterId) {
      return NextResponse.json(
        { error: "Character ID is required." },
        { status: 400 }
      );
    }

    // TODO: You should also verify that the authenticated user (decodedToken.uid)
    // is a member of this project before allowing the update.
    // (e.g., check the 'members' array on the project document)

    // 3. Define the character document reference
    const charRef = db
      .collection("projects")
      .doc(projectId)
      .collection("characters")
      .doc(characterId);

    const doc = await charRef.get();
    if (!doc.exists) {
      return NextResponse.json(
        { error: "Character not found." },
        { status: 404 }
      );
    }

    // 4. Define the data to update
    const dataToUpdate = {
      name: name || "",
      archetype: archetype || "",
      description: description || "",
      avatarUrl: avatarUrl || "",
      imageUrl: imageUrl || "",
      updatedAt: FieldValue.serverTimestamp(),
    };

    // 5. Update the document
    await charRef.update(dataToUpdate);

    // 6. Respond with the updated data
    return NextResponse.json(
      { id: charRef.id, ...dataToUpdate },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating character document:", error.message);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
