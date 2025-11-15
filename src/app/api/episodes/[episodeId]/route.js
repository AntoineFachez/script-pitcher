// file path: ~/DEVFOLD/SCRIPT-PITCHER/SRC/APP/API/EPISODES/[EPISODEID]/ROUTE.JS

import { NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";

import { getAdminServices } from "@/lib/firebase/firebase-admin";

/**
 * POST /api/characters
 * Creates a new character document in a project's subcollection.
 */
export async function POST(request, { params }) {
  // ⬅️ FIX 1: Add { params }
  let db, auth, decodedToken; // ⬅️ FIX 2: Declare decodedToken here

  const { episodeId } = params; // ⬅️ FIX 3: This now correctly destructures the ID

  try {
    // 2. CRITICAL FIX: Get the stable services inside the handler
    const services = getAdminServices();
    db = services.db;
    auth = services.auth;
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
    // Fields from your EpisodesForm.js
    const { projectId, title, description, avatarUrl, imageUrl } =
      await request.json();

    // 2. Validate required data
    if (!projectId) {
      return NextResponse.json(
        { error: "Project ID is required in the request body." },
        { status: 400 }
      );
    }
    if (!episodeId) {
      return NextResponse.json(
        { error: "Episode ID is required." },
        { status: 400 }
      );
    }

    // TODO: Verify that the authenticated user (decodedToken.uid)
    // is a member of this project before allowing the update.

    // 3. Define the episode document reference
    const episodeRef = db
      .collection("projects")
      .doc(projectId)
      .collection("episodes") // <-- Changed from "characters"
      .doc(episodeId);

    const doc = await episodeRef.get();
    if (!doc.exists) {
      return NextResponse.json(
        { error: "Episode not found." }, // <-- Changed
        { status: 404 }
      );
    }

    // 4. Define the data to update
    const dataToUpdate = {
      title: title || "", // <-- Changed from "name"
      description: description || "",
      avatarUrl: avatarUrl || "",
      imageUrl: imageUrl || "",
      updatedAt: FieldValue.serverTimestamp(),
    };

    // 5. Update the document
    await episodeRef.update(dataToUpdate);

    // 6. Respond with the updated data
    return NextResponse.json(
      { id: episodeRef.id, ...dataToUpdate },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating episode document:", error.message); // <-- Changed
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
