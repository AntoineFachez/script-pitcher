// file path: ~/DEVFOLD/SCRIPT-PITCHER/SRC/LIB/AUTH/MIDDLEWARE.JS

import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import { authOptions } from "./auth"; // 👈 Correct: Import the unified options

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
    // ⭐️ Pass the core options so middleware can decrypt the cookie
    secret: authOptions.secret,
    session: authOptions.session,
    jwt: authOptions.jwt,
    pages: authOptions.pages,
  }
);

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
