// file path: ~/DEVFOLD/SCRIPT-PITCHER/FUNCTIONS/SERVICES/DATABASESERVICE.JS

const { logger } = require("firebase-functions/v2");
const {
  onDocumentWritten,
  onDocumentCreated,
} = require("firebase-functions/v2/firestore");
const functions = require("firebase-functions/v1");
const { sendInviteEmail } = require("./emailService"); // Import the new email service

// --- CONFIGURATION ---
// const DATABASE_ID = "script-pitcher-extracted-data-stylesheets";
const SUMMARY_DOC_ID = "summary"; // Use a constant for the subcollection doc name

/**
 * Creates the onProjectWrite trigger.
 * @param {FirebaseFirestore.Firestore} db The Firestore database instance.
 * @param {FirebaseFirestore.FieldValue} FieldValue The Firestore FieldValue class.
 * @returns {import("firebase-functions/v2/firestore").CloudFunction<import("firebase-functions/v2/firestore").Change<import("firebase-functions/v2/firestore").DocumentSnapshot>>}
 */
exports.createOnProjectWriteHandler = (db, FieldValue) => {
  const triggerOptions = {
    document: "projects/{projectId}",
    // database: DATABASE_ID,
  };

  return onDocumentWritten(triggerOptions, async (event) => {
    const projectId = event.params.projectId;
    const dataBefore = event.data.before.data() || {};
    const dataAfter = event.data.after.data() || {};
    logger.info("onProjectWrite triggered for project:", projectId);

    const membersBefore = new Set(Object.keys(dataBefore.members || {}));
    const membersAfter = new Set(Object.keys(dataAfter.members || {}));

    const projectName =
      dataAfter.name || dataAfter.title || dataBefore.name || dataBefore.title;
    if (!projectName) {
      logger.warn(`Project ${projectId} has no name. Aborting.`);
      return;
    }

    const batch = db.batch();

    // --- Handle users added to the project ---
    const addedMembers = new Set(
      [...membersAfter].filter((x) => !membersBefore.has(x))
    );
    for (const userId of addedMembers) {
      const userRef = db.collection("users").doc(userId);

      // Check if user exists (this is an async operation)
      const userDoc = await userRef.get();

      if (!userDoc.exists) {
        logger.info(`Adding user ${userId} to batch for creation.`);
        batch.set(userRef, {
          createdAt: FieldValue.serverTimestamp(),
          // TODO: Add Auth logic here to get user email/name
        });
      }

      // Add summary doc creation to batch
      const summaryRef = db
        .collection("users")
        .doc(userId)
        .collection("private")
        .doc(SUMMARY_DOC_ID);
      const role = dataAfter.members?.[userId]?.role || "viewer";
      logger.info(`Adding project ${projectId} to user ${userId}.`);

      batch.set(
        summaryRef,
        { projects: { [projectId]: { projectName: projectName, role } } },
        { merge: true }
      );
    }

    // --- Handle users removed from the project ---
    const removedMembers = new Set(
      [...membersBefore].filter((x) => !membersAfter.has(x))
    );
    removedMembers.forEach((userId) => {
      // ADJUSTED PATH: Point to the 'summary' document.
      const summaryRef = db
        .collection("users")
        .doc(userId)
        .collection("private")
        .doc(SUMMARY_DOC_ID);
      logger.info(`Removing project ${projectId} from user ${userId}.`);
      batch.update(summaryRef, {
        [`projects.${projectId}`]: FieldValue.delete(),
      });
    });

    // --- Handle project name or role changes for existing members ---
    const updatedMembers = new Set(
      [...membersBefore].filter((x) => membersAfter.has(x))
    );
    updatedMembers.forEach((userId) => {
      if (
        dataBefore.name !== dataAfter.name ||
        dataBefore.members?.[userId] !== dataAfter.members?.[userId]
      ) {
        // ADJUSTED PATH: Point to the 'summary' document.
        const summaryRef = db
          .collection("users")
          .doc(userId)
          .collection("private")
          .doc(SUMMARY_DOC_ID);
        const roleAfter = dataAfter.members?.[userId]?.role;

        logger.info(
          `Updating project ${projectId} details for user ${userId}.`
        );
        batch.set(
          summaryRef,
          {
            projects: {
              [projectId]: { projectName: projectName, role: roleAfter },
            },
          },
          { merge: true }
        );
      }
    });

    await batch
      .commit()
      .catch((err) =>
        logger.error("Error committing batch for project updates:", err)
      );
  });
};

/**
 * Creates the onFileCreate trigger.
 * @param {FirebaseFirestore.Firestore} db The Firestore database instance.
 * @returns {import("firebase-functions/v2/firestore").CloudFunction<import("firebase-functions/v2/firestore").DocumentSnapshot>}
 */
exports.createOnFileCreateHandler = (db) => {
  const triggerOptions = {
    document: "projects/{projectId}/files/{fileId}",
    // database: DATABASE_ID,
  };
  return onDocumentCreated(triggerOptions, async (event) => {
    const { projectId, fileId } = event.params;
    logger.info(
      "onFileCreate triggered for project:",
      projectId,
      "and file:",
      fileId
    );

    const fileData = event.data.data();

    if (!fileData) {
      logger.warn(`File ${fileId} has no data. Aborting.`);
      return;
    }

    const projectRef = db.collection("projects").doc(projectId);
    const projectDoc = await projectRef.get();

    if (!projectDoc.exists) {
      logger.warn(`Parent project ${projectId} not found. Aborting.`);
      return;
    }
    const projectData = projectDoc.data();
    const members = projectData.members || {};

    if (Object.keys(members).length === 0) {
      return;
    }

    const lastTouchedFile = {
      projectId,
      projectName: projectData.name || projectData.title || "Unknown Project",
      avatarUrl: projectData.avatarUrl,
      bannerUrl: projectData.bannerUrl,
      fileId,
      fileName: fileData.name || "untitled.pdf",
      timestamp: fileData.createdAt || new Date().toISOString(),
    };

    const batch = db.batch();
    for (const userId of Object.keys(members)) {
      // ADJUSTED PATH: Point to the 'summary' document in the 'private' subcollection.
      const summaryRef = db
        .collection("users")
        .doc(userId)
        .collection("private")
        .doc(SUMMARY_DOC_ID);
      logger.info(`Updating lastTouchedFile for user ${userId}.`);
      batch.set(summaryRef, { lastTouchedFile }, { merge: true });
    }

    await batch
      .commit()
      .catch((err) =>
        logger.error("Error committing batch for file update:", err)
      );
  });
};

/**
 * Creates the v1 style onUserCreate trigger (V1).
 * @param {FirebaseFirestore.Firestore} db The Firestore database instance.
 * @returns {functions.CloudFunction<functions.auth.UserRecord>}
 */
exports.createProcessUserInvitationHandlerV1 = (db, FieldValue) => {
  // This is a V1 function, using the imported 'functions' object
  return functions.auth.user().onCreate(async (user, context) => {
    // <-- v1 signature
    // 'user' directly contains UserRecord (no event.data)
    const email = user.email;
    const newUserId = user.uid;

    if (!email) {
      // Use v2 logger if available, otherwise console.log
      logger.info(
        `User ${newUserId} created without email (v1), skipping invitation check.`
      );
      return null;
    }

    logger.info(`Checking invitations for new user (v1): ${email}`);

    // Firestore logic remains the same, using the passed 'db' instance
    const invitationsRef = db.collectionGroup("invitations");
    const querySnapshot = await invitationsRef
      .where("email", "==", email.toLowerCase())
      .get();

    if (querySnapshot.empty) {
      logger.info(`No invitations found for ${email} (v1).`);
      return null;
    }

    const batch = db.batch();

    for (const doc of querySnapshot.docs) {
      const invitation = doc.data();
      const projectRef = doc.ref.parent.parent;

      if (!projectRef) continue;

      logger.info(
        `Found invitation for ${email} to project ${projectRef.id} (v1).`
      );

      const newMemberData = {
        role: invitation.role,
        joinedAt: FieldValue.serverTimestamp(), // Sets the join time
        invitedBy: invitation.invitedBy || null, // Uses the ID from the invitation
      };

      batch.update(projectRef, {
        [`members.${newUserId}`]: newMemberData,
      });
      batch.delete(doc.ref);
    }

    await batch
      .commit()
      .catch((err) =>
        logger.error("Error committing batch for user invitations:", err)
      );

    logger.info(
      `Successfully processed ${querySnapshot.size} invitation(s) for ${email} (v1).`
    );

    return null;
  });
};

/**
 * Creates the onInvitationCreate trigger.
 * This function is triggered when a new invitation document is created.
 * It is responsible for sending an email to the invited user.
 * @param {FirebaseFirestore.Firestore} db The Firestore database instance.
 * @returns {import("firebase-functions/v2/firestore").CloudFunction<import("firebase-functions/v2/firestore").DocumentSnapshot>}
 */
exports.createOnInvitationCreateHandler = (db) => {
  const triggerOptions = {
    document: "projects/{projectId}/invitations/{invitationId}",
  };

  return onDocumentCreated(triggerOptions, async (event) => {
    const { projectId, invitationId } = event.params;
    logger.info(
      "onInvitationCreate triggered for project:",
      projectId,
      "and invitation:",
      invitationId
    );

    const invitationData = event.data?.data();

    if (!invitationData || !invitationData.email) {
      logger.warn(`Invitation document ${invitationId} is invalid. Aborting.`);
      return;
    }

    const { email, role, invitedBy } = invitationData;

    // 1. Fetch Project Name
    const projectRef = db.collection("projects").doc(projectId);
    const projectSnap = await projectRef.get();
    const projectName = projectSnap.exists
      ? projectSnap.data().name || projectSnap.data().title || "a project"
      : "a project";

    // 2. Fetch Inviter's Name AND EMAIL 🚨 MODIFIED BLOCK 🚨
    let inviterName = "A team member";
    let inviterEmail = ""; // Initialize inviterEmail

    if (invitedBy) {
      const inviterRef = db.collection("users").doc(invitedBy);
      const inviterSnap = await inviterRef.get();
      if (inviterSnap.exists) {
        const inviterData = inviterSnap.data();
        // Assuming the 'users' document has an 'email' field
        inviterEmail = inviterData.email || "";
        inviterName =
          inviterData.displayName || inviterData.email || inviterName;
      }
    }

    if (!inviterEmail) {
      logger.warn(
        `Inviter (UID: ${invitedBy}) email not found. Cannot send personalized email.`
      );
      // Fallback or use a default if needed, but we proceed with what we have
      inviterEmail = process.env.MAIL_USER;
    }

    // 3. 🚀 SEND THE EMAIL 🚀 🚨 MODIFIED CALL 🚨
    try {
      await sendInviteEmail(
        email,
        projectName,
        role,
        inviterName,
        inviterEmail
      );
    } catch (error) {
      logger.error(`Failed to send invitation email to ${email}.`, error);
      // You might consider updating the invitation document here to mark it as failed.
    }
  });
};
