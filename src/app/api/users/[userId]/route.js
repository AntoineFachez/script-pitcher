// file path: ~/DEVFOLD/SCRIPT-PITCHER/SRC/APP/API/USERS/[USERID]/ROUTE.JS

import { NextResponse } from "next/server";
import { getAdminServices } from "@/lib/firebase/firebase-admin";

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
