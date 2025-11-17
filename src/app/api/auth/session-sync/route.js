// file path: ~/DEVFOLD/SCRIPT-PITCHER/SRC/APP/API/AUTH/SESSION-SYNC/ROUTE.JS

import { NextResponse } from "next/server";
import { auth } from "@/lib/firebase/firebase-admin"; // Admin SDK for token verification
import { SignJWT } from "jose";
import { serialize } from "cookie";

// Environment variable containing the secret key for signing the JWT
const NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET;

/**
 * POST /api/auth/session-sync
 * * Takes a Firebase ID Token (from client login) and uses it to create and set
 * a NextAuth session cookie, completing the authentication flow.
 */
export async function POST(req) {
  const { idToken } = await req.json();

  if (!idToken) {
    return NextResponse.json({ message: "Missing ID token" }, { status: 400 });
  }

  // Ensure the secret is available for JWT signing
  if (!NEXTAUTH_SECRET) {
    console.error("NEXTAUTH_SECRET is not configured.");
    return NextResponse.json(
      { message: "Server configuration error." },
      { status: 500 }
    );
  }

  try {
    // 1. Verify the Firebase ID token using the Admin SDK
    const decodedToken = await auth.verifyIdToken(idToken);
    const userId = decodedToken.uid;
    const userEmail = decodedToken.email;

    // 2. CRITICAL: Manually create a NextAuth-compatible JWT session token
    // The payload must contain the minimal information NextAuth needs to hydrate the session.
    // Ensure this structure aligns with what your callbacks.jwt expects to see.
    const sessionToken = await new SignJWT({
      // Standard NextAuth fields for session:
      id: userId,
      email: userEmail,
      name: decodedToken.name || decodedToken.displayName,

      // The rest of the token payload will be enriched by callbacks.jwt on subsequent loads.
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("30d") // Match maxAge in NextAuth config (30 * 24 * 60 * 60 seconds)
      .sign(new TextEncoder().encode(NEXTAUTH_SECRET));

    // 3. Set the NextAuth session cookie
    const sessionCookie = serialize("next-auth.session-token", sessionToken, {
      httpOnly: true,
      // ⭐️ Standard check for HTTPS/Secure environment
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 30 * 24 * 60 * 60, // 30 days
    });

    const response = NextResponse.json({ success: true, userId });
    response.headers.set("Set-Cookie", sessionCookie);
    return response;
  } catch (error) {
    // Firebase verification failure or JWT signing failure
    console.error("Session sync failed:", error.message);
    return NextResponse.json(
      { message: "Authentication failed or invalid token" },
      { status: 401 } // Use 401 for authentication failure
    );
  }
}
