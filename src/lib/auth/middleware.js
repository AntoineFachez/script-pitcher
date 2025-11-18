// file path: ~/DEVFOLD/SCRIPT-PITCHER/SRC/LIB/AUTH/MIDDLEWARE.JS

import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
// --- START FIX ---
// Import from the "lite" config, which is Edge-safe
import { authConfig } from "./auth.config";
// --- END FIX ---

export default withAuth(
  function middleware(req) {
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const isLoggedIn = !!token;
        const nextUrl = req.nextUrl;
        const isProtectedRoute =
          nextUrl.pathname.startsWith("/dashboard") ||
          nextUrl.pathname.startsWith("/me") ||
          nextUrl.pathname.startsWith("/projects") ||
          nextUrl.pathname.startsWith("/users");

        if (isProtectedRoute) {
          if (isLoggedIn) return true;
          return false; // Redirect to signIn page
        }
        return true;
      },
    },

    // --- START FIX ---
    // Pass the options from the lite config
    secret: authConfig.secret,
    session: authConfig.session,
    jwt: authConfig.jwt,
    pages: authConfig.pages,
    // --- END FIX ---
  }
);

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
