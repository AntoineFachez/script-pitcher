// file path: ~/DEVFOLD/SCRIPT-PITCHER/SRC/APP/API/EPISODES/ROUTE.JS

import { NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";

import { getAdminServices } from "@/lib/firebase/firebase-admin";

/**
 * POST /api/characters
 * Creates a new character document in a project's subcollection.
 */
export async function POST(request) {
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
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    decodedToken = await auth.verifyIdToken(idToken);
  } catch (error) {
    console.error("Auth error:", error.message);
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    // 1. Get the data from the request body
    const { projectId, title, description, avatarUrl, imageUrl } =
      await request.json();

    // 2. Validate required data
    if (!projectId) {
      return NextResponse.json(
        { error: "Project ID is required to create an episode." },
        { status: 400 }
      );
    }

    // TODO: Verify user (decodedToken.uid) is a member of this project.

    // 3. Define the new episode data
    const newEpisodeDoc = {
      title: title || "New Episode",
      description: description || "",
      avatarUrl: avatarUrl || "",
      imageUrl: imageUrl || "",
      createdAt: FieldValue.serverTimestamp(),
      ownerId: decodedToken.uid, // Track who created the episode
    };

    // 4. Add the document to the /episodes subcollection
    const episodeRef = await db
      .collection("projects")
      .doc(projectId)
      .collection("episodes") // <-- Changed from "characters"
      .add(newEpisodeDoc);

    // 5. Respond with the created data
    return NextResponse.json(
      { id: episodeRef.id, ...newEpisodeDoc },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating episode document:", error.message); // <-- Changed
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
