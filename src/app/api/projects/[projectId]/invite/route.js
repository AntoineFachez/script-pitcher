// file path: ~/DEVFOLD/SCRIPT-PITCHER/SRC/APP/API/PROJECTS/[PROJECTID]/INVITE/ROUTE.JS

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

  const { projectId } = params;
  try {
    // 2. CRITICAL FIX: Get the stable services inside the handler
    const services = getAdminServices();
    db = services.db;
    auth = services.auth;
    // 1. Secure the route: Verify the person calling is logged in
    const idToken = request.headers.get("authorization")?.split("Bearer ")[1];
    if (!idToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    decodedToken = await auth.verifyIdToken(idToken);
  } catch (error) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    const { email, role } = await request.json();
    if (!email || !role) {
      return NextResponse.json(
        { error: "Email and role are required." },
        { status: 400 }
      );
    }

    // 2. Authorization Check: Is the caller an owner of this project?
    const projectRef = db.collection("projects").doc(projectId);
    const projectSnap = await projectRef.get();
    if (!projectSnap.exists) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const projectData = projectSnap.data();
    const adminRole = projectData.members?.[decodedToken.uid];

    if (adminRole !== "owner") {
      return NextResponse.json(
        { error: "Forbidden: You must be an owner to invite users." },
        { status: 403 }
      );
    }

    // 3. Create the invitation document.
    // We use the email (lowercased) as the ID for easy lookup.
    const invitationRef = projectRef
      .collection("invitations")
      .doc(email.toLowerCase());

    const invitationData = {
      email: email.toLowerCase(),
      role: role,
      invitedBy: decodedToken.uid,
      createdAt: FieldValue.serverTimestamp(),
    };

    await invitationRef.set(invitationData);

    // 4. Respond with success
    // (Optional: You would also trigger an invitation email here)
    return NextResponse.json(invitationData, { status: 201 });
  } catch (error) {
    console.error("Error creating invitation:", error.message);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
