// file path: ~/DEVFOLD/SCRIPT-PITCHER/SRC/APP/API/AUTH/SESSION-SYNC/ROUTE.JS

import { NextResponse } from "next/server";
import { auth } from "@/lib/firebase/firebase-admin"; // Admin SDK for token verification
import { serialize } from "cookie";

// 1. ❌ REMOVE 'jose'
// import { SignJWT } from "jose";

// 2. ✅ ADD NextAuth's 'encode' function and your 'authOptions'
import { encode } from "next-auth/jwt";
import { authOptions } from "@/lib/auth/authOptions";

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
    // 1. Verify the Firebase ID token
    const decodedToken = await auth.verifyIdToken(idToken);
    const userId = decodedToken.uid;
    const userEmail = decodedToken.email;

    // 2. ✅ Create the NextAuth token PAYLOAD
    // This is the object that will be passed to your `callbacks.jwt`
    const tokenPayload = {
      id: userId,
      email: userEmail,
      name: decodedToken.name || decodedToken.displayName,
      // 'sub' is the standard JWT field for ID, which NextAuth also uses
      sub: userId,
    };

    // ⭐️ ADD THIS LOG
    console.log("[Session-Sync] Encoding token with payload:", tokenPayload);

    // 3. ✅ Use NextAuth's 'encode' function to create the session token
    // This signs the token with the *exact* same algorithm and keys
    // that 'getServerSession' will use to decode it.
    const sessionToken = await encode({
      token: tokenPayload,
      secret: NEXTAUTH_SECRET,
      // Pass your JWT maxAge from authOptions
      ...authOptions.jwt,
    });

    // ⭐️ ADD THIS LOG
    console.log("[Session-Sync] Token encoded successfully.");

    // 4. Set the NextAuth session cookie (your logic was correct here)
    const sessionCookie = serialize("next-auth.session-token", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: authOptions.session.maxAge, // Use maxAge from config
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
