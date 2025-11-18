// file path: ~/DEVFOLD/SCRIPT-PITCHER/SRC/APP/API/PROJECTS/[PROJECTID]/INVITE/ROUTE.JS

import { NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";

import { getAdminServices } from "@/lib/firebase/firebase-admin";

/**
 * POST /api/projects/[projectId]/invite
 * Creates a new character document in a project's subcollection.
 * * @param {object} request The incoming Next.js request object.
 * @param {{params: {projectId: string}}} context Context object containing dynamic params.
 */
export async function POST(request, { params }) {
  let decodedToken;
  let db, auth;

  // ✅ FIX: projectId is now correctly destructured from params
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
    // Get the member object
    const adminMember = projectData.members?.[decodedToken.uid];

    // Check the 'role' property inside the object
    if (adminMember?.role !== "owner") {
      return NextResponse.json(
        { error: "Forbidden: You must be an owner to invite users." },
        { status: 403 }
      );
    }

    // 3. Create the invitation document.

    // Generate a unique token for the document ID (e.g., a simple UUID or KSUID)
    // For this example, we'll use a placeholder for a unique ID generator
    const invitationId = db.collection("projects").doc().id; // Firestore's auto-ID generator is a good choice

    // Set expiration (e.g., 7 days)
    const sevenDaysInMs = 7 * 24 * 60 * 60 * 1000;
    const expiresAt = new Date(Date.now() + sevenDaysInMs);

    const invitationRef = projectRef
      .collection("invitations")
      .doc(invitationId); // Use the unique ID

    const invitationData = {
      // Use a unique ID as the token in the URL
      token: invitationId,
      projectId: projectId, // Add projectId for easier retrieval and rules
      invitedEmail: email.toLowerCase(),
      role: role,
      invitedBy: decodedToken.uid,
      status: "pending", // Add status field
      createdAt: FieldValue.serverTimestamp(),
      expiresAt: expiresAt, // Add expiration field (as a Date object)
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
