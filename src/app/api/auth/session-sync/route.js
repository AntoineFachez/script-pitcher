// file path: ~/app/api/auth/session-sync/route.js

import { NextResponse } from "next/server";
import { auth } from "@/lib/firebase/firebase-admin";
import { SignJWT } from "jose"; // You may need to install 'jose' (or 'jsonwebtoken')
import { serialize } from "cookie"; // You may need to install 'cookie'

const NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET;

export async function POST(req) {
  const { idToken } = await req.json();

  if (!idToken) {
    return NextResponse.json({ message: "Missing ID token" }, { status: 400 });
  }

  try {
    // 1. Verify the Firebase ID token using the Admin SDK
    const decodedToken = await auth.verifyIdToken(idToken);
    const userId = decodedToken.uid;

    // 2. CRITICAL: Manually create a NextAuth-compatible JWT session token
    // This token structure must match what NextAuth expects (session.user.id = userId).
    const sessionToken = await new SignJWT({
      user: { id: userId }, // Must match the format used in authOptions.callbacks.session
      id: userId,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("30d") // Match your authOptions maxAge
      .sign(new TextEncoder().encode(NEXTAUTH_SECRET)); // Sign with your NextAuth secret

    // 3. Set the NextAuth session cookie
    const sessionCookie = serialize("next-auth.session-token", sessionToken, {
      httpOnly: true,
      // ⭐️ FIX: Set 'secure: true' ONLY in production (or if you are sure you are on HTTPS)
      secure:
        process.env.NODE_ENV === "production" ||
        process.env.NEXT_PUBLIC_FORCE_HTTPS === "true",
      sameSite: "lax",
      path: "/",
      maxAge: 30 * 24 * 60 * 60, // 30 days
    });

    const response = NextResponse.json({ success: true, userId });
    response.headers.set("Set-Cookie", sessionCookie);
    return response;
  } catch (error) {
    console.error("Session sync failed:", error);
    return NextResponse.json(
      { message: "Invalid token or server error" },
      { status: 500 }
    );
  }
}
