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
    const { email, role, userProfile } = await request.json();
    const targetEmail = email.toLowerCase();

    // 1. Create the invitation doc (Your existing logic)
    const invitationId = db.collection("projects").doc().id;
    const sevenDaysInMs = 7 * 24 * 60 * 60 * 1000;
    const invitationPart = `/invite/${projectId}/${invitationId}`;

    const invitationData = {
      token: invitationId,
      projectId: projectId,
      invitationPart: invitationPart,
      invitedEmail: targetEmail,
      role: role,
      invitedById: decodedToken.uid,
      state: "pending",
      createdAt: FieldValue.serverTimestamp(),
      expiresAt: new Date(Date.now() + sevenDaysInMs),
    };

    const projectRef = db.collection("projects").doc(projectId);

    // Start a batch or transaction to ensure consistency
    const batch = db.batch();

    // A. Write the invitation to the project subcollection
    const invitationRef = projectRef
      .collection("invitations")
      .doc(invitationId);
    batch.set(invitationRef, invitationData);

    // 2. 🚀 NEW: Try to find the user to give them a badge
    try {
      const userRecord = await auth.getUserByEmail(targetEmail);

      if (userRecord) {
        // The user exists! We can add this invite to their summary directly.
        const userSummaryRef = db.doc(
          `users/${userRecord.uid}/private/summary`
        );

        // Atomically add the invitation ID to a 'pendingInvitations' array
        batch.set(
          userSummaryRef,
          {
            invitations: {
              [invitationId]: {
                projectId: projectId,
                role: role,
                invitedById: decodedToken.uid,
                invitedByName: userProfile.displayName,
                invitedByEmail: userProfile.email,
                state: "pending",
                sentAt: FieldValue.serverTimestamp(),
                invitationPart: invitationPart,
              },
            },
          },
          { merge: true }
        );

        console.log(`Added badge to user ${userRecord.uid}`);
      }
    } catch (authError) {
      // If getUserByEmail fails, the user doesn't exist yet.
      // That's fine, they will rely on the email link.
      console.log("User not found, skipping badge update.");
    }

    // Commit the batch
    await batch.commit();

    return NextResponse.json(invitationData, { status: 201 });
  } catch (error) {
    console.error("Error creating invitation:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
