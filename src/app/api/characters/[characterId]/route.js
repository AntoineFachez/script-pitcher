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
  let userId; // Declare userId outside the try/catch for scope

  try {
    // Secure the route (Authentication)
    const idToken = request.headers.get("authorization")?.split("Bearer ")[1];
    if (!idToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const decodedToken = await auth.verifyIdToken(idToken);
    userId = decodedToken.uid; // Assign userId here
  } catch (error) {
    console.error("Auth error:", error.message);
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    // 1. Get the data from the request body
    const { projectId, name, archetype, description, avatarUrl, imageUrl } =
      await request.json();

    // 2. Validate required data
    if (!projectId || !characterId) {
      return NextResponse.json(
        { error: "Project ID and Character ID are required." },
        { status: 400 }
      );
    }

    // --- START: AUTHORIZATION CHECK ---

    // 3. Get the Project Document
    const projectRef = db.collection("projects").doc(projectId);
    const projectDoc = await projectRef.get();

    if (!projectDoc.exists) {
      return NextResponse.json(
        { error: "Project not found." },
        { status: 404 }
      );
    }

    const projectData = projectDoc.data();
    const membersMap = projectData.members || {}; // Default to an empty object

    // --- START: AUTHORIZATION CHECK (for a Map/Object structure) ---

    // 4. Get the user's membership object directly using their userId as the key
    const userMember = membersMap[userId]; // e.g., membersMap['bLFRIyELT7N7PhX6xlln']

    // 5. Check if the authenticated user exists in the map and has an allowed role
    if (
      !userMember ||
      (userMember.role !== "owner" && userMember.role !== "editor")
    ) {
      console.warn(
        `Permission denied: User ${userId} with role ${
          userMember ? userMember.role : "none"
        } tried to update character ${characterId} in project ${projectId}`
      );
      return NextResponse.json(
        {
          error:
            "Forbidden: You must be an owner or editor to update this character.",
        },
        { status: 403 }
      );
    }

    // --- END: AUTHORIZATION CHECK ---

    // 5. Define the character document reference
    const charRef = projectRef.collection("characters").doc(characterId);

    const doc = await charRef.get();
    if (!doc.exists) {
      return NextResponse.json(
        { error: "Character not found." },
        { status: 404 }
      );
    }

    // 6. Define the data to update
    const dataToUpdate = {
      name: name || "",
      archetype: archetype || "",
      description: description || "",
      avatarUrl: avatarUrl || "",
      imageUrl: imageUrl || "",
      updatedAt: FieldValue.serverTimestamp(),
    };

    // 7. Update the document
    await charRef.update(dataToUpdate);

    // 8. Respond with the updated data
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
