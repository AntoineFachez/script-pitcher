// file path: ~/DEVFOLD/SCRIPT-PITCHER/SRC/APP/API/USERS/ROUTE.JS

import { NextResponse } from "next/server";
import { getAdminServices } from "@/lib/firebase/firebase-admin";

/**
 * POST /api/users
 * Creates a new user document in the users collection.
 */
export async function POST(request) {
  let db;

  try {
    // 2. CRITICAL FIX: Get the stable services inside the handler
    const services = getAdminServices();
    db = services.db;
    // Secure the route: Verify the user is logged in
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
    const { uid, email, displayName } = await request.json();

    // 1. Check for required data. The UID from the auth token MUST match.
    if (!uid || uid !== decodedToken.uid) {
      return NextResponse.json(
        { error: "Invalid user ID or token mismatch." },
        { status: 400 }
      );
    }

    // 2. Define the new user document data
    const newUserDoc = {
      uid: uid,
      email: email || decodedToken.email || "", // Get email from body or token
      displayName: displayName || "",
      createdAt: FieldValue.serverTimestamp(),
      // Add any other default fields
      isAdmin: false,
    };

    // 3. Set the document in the /users collection
    const userRef = db.collection("users").doc(uid);
    await userRef.set(newUserDoc);

    // 4. Respond with the created data
    return NextResponse.json(newUserDoc, { status: 201 }); // 201 = Created
  } catch (error) {
    console.error("Error creating user document:", error.message);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
