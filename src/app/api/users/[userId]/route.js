// file path: ~/DEVFOLD/SCRIPT-PITCHER/SRC/APP/API/USERS/[USERID]/ROUTE.JS

import { NextResponse } from "next/server";
import { getAdminServices } from "@/lib/firebase/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";

// API function to handle GET requests
export async function GET(request, context) {
  let db;

  try {
    const services = getAdminServices();
    db = services.db;

    // ✅ 1. Access 'userId' directly from 'context.params'
    // This avoids the 'await' error with destructuring 'params'.
    const { userId } = context.params;

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const userRef = db.collection("users").doc(userId);
    const userDoc = await userRef.get();
    if (!userDoc.exists) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const userData = userDoc.data();

    const serializableUser = {
      displayName: userData.displayName,
      email: userData.email,
      createdAt: userData.createdAt
        ? userData.createdAt.toDate().toISOString()
        : null,
    };

    return NextResponse.json(serializableUser, { status: 200 });
  } catch (error) {
    if (error.message.includes("Firebase")) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    console.error("[API LOG] CRITICAL ERROR fetching user data:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
/**
 * PUT /api/users/[userId]
 * Updates a user's profile data (e.g., displayName).
 * ONLY the authenticated user can update their own profile.
 */
export async function PUT(request, { params }) {
  let decodedToken;
  let db, auth;
  const { userId } = params;

  try {
    // 1. Get Admin Services
    const services = getAdminServices();
    db = services.db;
    auth = services.auth;

    // 2. Secure the route: Verify the person calling is logged in
    const idToken = request.headers.get("authorization")?.split("Bearer ")[1];
    if (!idToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    decodedToken = await auth.verifyIdToken(idToken);
  } catch (error) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  // 3. AUTHORIZATION: Ensure the authenticated user is updating their OWN document
  if (decodedToken.uid !== userId) {
    return NextResponse.json(
      { error: "Forbidden: Cannot update another user's profile." },
      { status: 403 }
    );
  }

  try {
    const { displayName } = await request.json();

    if (!displayName) {
      return NextResponse.json(
        { error: "Display Name is required." },
        { status: 400 }
      );
    }

    const userRef = db.collection("users").doc(userId);

    // 4. Update the Firestore document
    await userRef.update({
      displayName: displayName,
      updatedAt: FieldValue.serverTimestamp(), // Use Admin SDK timestamp
    });

    return NextResponse.json(
      {
        uid: userId,
        displayName: displayName,
        message: "User updated successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("PUT User Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
