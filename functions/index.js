// file path: ~/DEVFOLD/SCRIPT-PITCHER/FUNCTIONS/INDEX.JS

const { setGlobalOptions } = require("firebase-functions/v2");
const { initializeApp } = require("firebase-admin/app");
const { getFirestore, FieldValue } = require("firebase-admin/firestore");

const {
  createOnProjectWriteHandler,
  createOnFileCreateHandler,
  createProcessUserInvitationHandlerV1,
} = require("./services/databaseService");

// --- CONFIGURATION ---
// const DATABASE_ID = "script-pitcher-extracted-data-stylesheets";

// Initialize Admin SDK and pass the database ID for runtime connection.
initializeApp();
const db = getFirestore();

// Set global options for all functions deployed from this file.
setGlobalOptions({ region: "europe-west4", maxInstances: 10 });

// Create the actual function triggers by calling the factory functions.
// They now contain the deploy-time database info.
exports.onProjectWrite = createOnProjectWriteHandler(db, FieldValue);
exports.onFileCreate = createOnFileCreateHandler(db);
exports.processUserInvitation = createProcessUserInvitationHandlerV1(db);
