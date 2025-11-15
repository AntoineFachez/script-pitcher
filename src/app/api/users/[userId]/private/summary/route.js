// file path: ~/DEVFOLD/SCRIPT-PITCHER/SRC/APP/API/USERS/[USERID]/PRIVATE/SUMMARY/ROUTE.JS

import { NextResponse } from "next/server";
import { getAdminServices } from "@/lib/firebase/firebase-admin";

// --- NO initialization in the global scope ---

export async function GET(request, { params }) {
  let db;

  try {
    // 2. CRITICAL FIX: Get the stable services inside the handler
    const services = getAdminServices();
    db = services.db;

    await request.text(); // This line seems unnecessary, but keeping it
    const { userId } = params;

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const summaryRef = db
      .collection("users")
      .doc(userId)
      .collection("private")
      .doc("summary");
    const summaryDoc = await summaryRef.get();

    if (!summaryDoc.exists) {
      return NextResponse.json(
        { projects: {}, lastTouchedFile: null },
        { status: 200 }
      );
    }

    return NextResponse.json(summaryDoc.data(), { status: 200 });
  } catch (error) {
    console.error("Error fetching user summary data:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
