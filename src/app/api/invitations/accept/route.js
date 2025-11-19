// file path: ~/DEVFOLD/SCRIPT-PITCHER/SRC/APP/API/INVITATIONS/ACCEPT/ROUTE.JS

import { NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { getAdminServices } from "@/lib/firebase/firebase-admin";

export async function POST(request) {
  const { projectId, token } = await request.json();

  if (!projectId || !token) {
    return NextResponse.json({ error: "Missing parameters." }, { status: 400 });
  }

  let db, auth, decodedToken;

  try {
    // 1. Init Admin Services
    const services = getAdminServices();
    db = services.db;
    auth = services.auth;

    // 2. Auth Check
    const idToken = request.headers.get("authorization")?.split("Bearer ")[1];
    if (!idToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    decodedToken = await auth.verifyIdToken(idToken);
  } catch (error) {
    return NextResponse.json(
      { error: "Authentication failed." },
      { status: 401 }
    );
  }

  const userId = decodedToken.uid;
  const userEmail = decodedToken.email;

  try {
    // 3. Run Firestore Transaction
    await db.runTransaction(async (transaction) => {
      // A. References
      const projectRef = db.collection("projects").doc(projectId);
      const invitationRef = projectRef.collection("invitations").doc(token); // Token is the docId
      const userSummaryRef = db.doc(`users/${userId}/private/summary`);

      // B. Reads
      const projectSnap = await transaction.get(projectRef);
      const invitationSnap = await transaction.get(invitationRef);

      // C. Validations (No changes needed here)
      if (!projectSnap.exists) throw new Error("Project does not exist.");
      if (!invitationSnap.exists)
        throw new Error("Invitation not found or expired.");

      const inviteData = invitationSnap.data();

      if (inviteData.status === "accepted") {
        throw new Error("Invitation already accepted.");
      }

      if (
        inviteData.expiresAt &&
        inviteData.expiresAt.toMillis() < Date.now()
      ) {
        throw new Error("Invitation has expired.");
      }

      // D. Writes

      // 1. Update Invitation Status (in projects subcollection)
      transaction.update(invitationRef, {
        status: "accepted",
        acceptedBy: userId,
        acceptedAt: FieldValue.serverTimestamp(),
      });

      // 2. Add User to Project Members
      const newMemberData = {
        role: inviteData.role,
        email: userEmail,
        joinedAt: FieldValue.serverTimestamp(),
      };

      transaction.update(projectRef, {
        [`members.${userId}`]: newMemberData,
      });

      // 3. Add Project to User Summary (The project list)
      transaction.set(
        userSummaryRef,
        {
          projects: {
            [projectId]: {
              role: inviteData.role,
              addedAt: FieldValue.serverTimestamp(),
            },
          },
        },
        { merge: true }
      );

      // 4. ⭐ NEW: Update Invitation Status in User Summary (for the badge)
      // We use dot notation to target the nested fields within the 'invitations' map.
      transaction.update(userSummaryRef, {
        [`invitations.${token}.state`]: "accepted",
        [`invitations.${token}.acceptedAt`]: FieldValue.serverTimestamp(),
      });
    });

    return NextResponse.json({ success: true, projectId }, { status: 200 });
  } catch (error) {
    console.error("Accept Invite Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to accept invitation." },
      { status: 500 }
    );
  }
}
