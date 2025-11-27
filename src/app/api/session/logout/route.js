// file path: src/app/api/session/logout/route.js

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getAdminServices } from "@/lib/firebase/firebase-admin";

export async function POST() {
  const sessionCookie = (await cookies()).get("__session");

  // 1. Revoke the session in Firebase (security best practice)
  if (sessionCookie) {
    try {
      const { auth } = getAdminServices();
      const decodedToken = await auth.verifySessionCookie(sessionCookie);
      await auth.revokeRefreshTokens(decodedToken.sub);
    } catch (e) {
      console.warn("Could not revoke session token (likely already expired).");
    }
  }

  // 2. Clear the cookie in the client's browser by setting maxAge to 0
  cookies().set("__session", "", {
    maxAge: 0, // Immediately expire the cookie
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });

  return NextResponse.json(
    { status: "success", message: "Signed out" },
    { status: 200 }
  );
}
