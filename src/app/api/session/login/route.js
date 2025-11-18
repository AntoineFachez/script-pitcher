// file path: src/app/api/session/login/route.js

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getAdminServices } from "@/lib/firebase/firebase-admin";

// Define the maximum age for the session cookie (e.g., 5 days in milliseconds)
const MAX_AGE = 60 * 60 * 24 * 5 * 1000;

export async function POST(request) {
  const { idToken } = await request.json();
  if (!idToken) {
    return NextResponse.json(
      { error: "Missing Firebase ID token" },
      { status: 400 }
    );
  }

  try {
    const { auth } = getAdminServices();

    // 1. Create a secure session cookie using the Firebase Admin SDK
    const sessionCookie = await auth.createSessionCookie(idToken, {
      expiresIn: MAX_AGE,
    });

    // 2. Set the secure HTTP-only cookie using the Next.js native API
    cookies().set("__session", sessionCookie, {
      maxAge: MAX_AGE / 1000, // Max age in seconds
      httpOnly: true,
      // secure: process.env.NODE_ENV === "production" is often enough, but
      // setting true ensures it's always secure behind your proxy.
      secure: true,
      sameSite: "lax",
      path: "/",
    });

    return NextResponse.json({ status: "success" }, { status: 200 });
  } catch (error) {
    console.error("Firebase Session Cookie creation failed:", error);
    return NextResponse.json(
      { error: "Authentication failed" },
      { status: 401 }
    );
  }
}
