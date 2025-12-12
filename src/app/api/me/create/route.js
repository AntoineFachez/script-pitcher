import { NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { getAdminServices } from "@/lib/firebase/firebase-admin";
import { DB_PATHS } from "@/lib/firebase/paths";

/**
 * POST /api/user/create
 * Creates a new user document in Firestore.
 * Expects JSON body: { uid, email }
 */
export async function POST(request) {
  try {
    const { uid, email } = await request.json();

    if (!uid || !email) {
      return NextResponse.json(
        { error: "Missing required fields: uid, email" },
        { status: 400 }
      );
    }

    const { db } = getAdminServices();
    const userRef = db.doc(DB_PATHS.userProfile(uid));

    // Check if user already exists
    const userDoc = await userRef.get();
    if (userDoc.exists) {
      return NextResponse.json(
        { message: "User already exists", uid },
        { status: 200 }
      );
    }

    // Create new user document
    const userData = {
      uid,
      email,
      displayName: "",
      photoURL: "", // Standard Firebase field
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
      roles: ["viewer"], // Default application-level role if needed
    };

    await userRef.set(userData);

    return NextResponse.json(
      { success: true, message: "User created", uid },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
