// file path: ~/DEVFOLD/SCRIPT-PITCHER/SRC/APP/API/AUTH/SESSION-SYNC/ROUTE.JS

import { NextResponse } from "next/server";
import { encode } from "next-auth/jwt";
import { serialize } from "cookie";

import { auth } from "@/lib/firebase/firebase-admin"; // Admin SDK for token verification
// 2. ✅ ADD NextAuth's 'encode' function and your 'authOptions'
import { authOptions } from "@/lib/auth/auth";

// 1. ❌ REMOVE 'jose'
// import { SignJWT } from "jose";

// Environment variable containing the secret key for signing the JWT
const NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET;

// ⭐️ ADD THIS LOG
console.log(
  `[Session-Sync] Secret loaded (first 5 chars): ${NEXTAUTH_SECRET?.substring(
    0,
    5
  )}`
);

export async function POST(req) {
  const { idToken } = await req.json();

  if (!idToken) {
    return NextResponse.json({ message: "Missing ID token" }, { status: 400 });
  }

  if (!NEXTAUTH_SECRET) {
    console.error("NEXTAUTH_SECRET is not configured.");
    return NextResponse.json(
      { message: "Server configuration error." },
      { status: 500 }
    );
  }

  try {
    const decodedToken = await auth.verifyIdToken(idToken);
    const userId = decodedToken.uid;
    const userEmail = decodedToken.email;

    // 2. ✅ FIX: Ensure 'name' is 'null', not 'undefined'
    const tokenPayload = {
      id: userId,
      email: userEmail,
      // This guarantees the value is 'null' if both are missing
      name: decodedToken.name || decodedToken.displayName || null,
      sub: userId,
    };

    console.log("[Session-Sync] Encoding token with payload:", tokenPayload);

    // 3. ✅ SIMPLIFY: Use session.maxAge directly
    const sessionToken = await encode({
      token: tokenPayload,
      secret: NEXTAUTH_SECRET,
      // This is the only other property 'encode' needs
      maxAge: authOptions.session.maxAge,
    });

    console.log("[Session-Sync] Token encoded successfully.");

    // 4. Set the cookie (your code was correct)
    const sessionCookie = serialize("next-auth.session-token", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: authOptions.session.maxAge,
    });

    const response = NextResponse.json({ success: true, userId });
    response.headers.set("Set-Cookie", sessionCookie);
    return response;
  } catch (error) {
    console.error("Session sync failed:", error.message);
    return NextResponse.json(
      { message: "Authentication failed or invalid token" },
      { status: 401 }
    );
  }
}
