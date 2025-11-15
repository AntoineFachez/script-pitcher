// file path: ~/DEVFOLD/SCRIPT-PITCHER/SRC/APP/API/USERS/[USERID]/ROUTE.JS

import { NextResponse } from "next/server";

import { getAdminServices } from "@/lib/firebase/firebase-admin";

// API function to handle GET requests
export async function GET(request, { params }) {
  let db;

  try {
    // 2. CRITICAL FIX: Get the stable services inside the handler
    const services = getAdminServices();
    db = services.db;

    const { userId } = params;

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

    // 💡 CRITICAL FIX: Add serialization logic here
    const serializableUser = {
      displayName: userData.displayName,
      email: userData.email,
      // Convert Timestamp object to ISO string for JSON serialization
      createdAt: userData.createdAt
        ? userData.createdAt.toDate().toISOString()
        : null,
    };

    return NextResponse.json(serializableUser, { status: 200 });
  } catch (error) {
    // Check if the error is our custom init error
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
