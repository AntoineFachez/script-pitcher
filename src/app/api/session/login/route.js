// file path: src/app/api/session/login/route.js

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getAdminServices } from "@/lib/firebase/firebase-admin";

export async function POST(request) {
  const { idToken } = await request.json();
  if (!idToken) {
    return NextResponse.json(
      { error: "No ID Token provided" },
      { status: 400 }
    );
  }

  try {
    const { auth } = getAdminServices();

    // 1. Verify the Firebase ID token and get the decoded user data
    const decodedToken = await auth.verifyIdToken(idToken);
    const uid = decodedToken.uid;

    // 2. OPTIONAL: Create a Firebase Session Cookie (for longer sessions)
    // For simplicity, we just use the user's UID in a custom cookie.

    // 3. Set a simple, secure, HTTP-only cookie using Next.js native API
    cookies().set("session_uid", uid, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Must be true in production
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });

    return NextResponse.json({ uid }, { status: 200 });
  } catch (error) {
    console.error("Session creation error:", error);
    return NextResponse.json(
      { error: "Invalid token or server error" },
      { status: 401 }
    );
  }
}
