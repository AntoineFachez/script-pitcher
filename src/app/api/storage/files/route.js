// file path: ~/DEVFOLD/SCRIPT-PITCHER/SRC/APP/API/STORAGE/FILES/ROUTE.JS

import { NextResponse } from "next/server";

import { getAdminServices } from "@/lib/firebase/firebase-admin";

// --- Configuration ---
// Just define the bucket name. DO NOT initialize here.
const storageBucketName = "script-pitcher-extracted-images";

// The main API function to handle GET requests
export async function GET() {
  let storage;

  try {
    // 2. CRITICAL FIX: Get the stable services inside the handler
    const services = getAdminServices();
    storage = services.storage;

    console.log(`API listing files from storage: ${storageBucketName}`);

    // 🟢 FIX 1: Explicitly target the correct bucket
    const [files] = await storage.bucket(storageBucketName).getFiles();

    const fileData = files.map((file) => ({
      name: file.name,
      url: `https://storage.googleapis.com/${storageBucketName}/${file.name}`,
    }));

    return NextResponse.json(fileData, { status: 200 });
  } catch (error) {
    console.error(`Firebase error listing files:`, error.message);
    // Check if the error is our custom init error
    if (error.message.includes("Firebase")) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
