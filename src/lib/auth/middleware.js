// file: src/middleware.js

import { auth } from "@/auth";

export default auth;

// This config specifies which routes the middleware should run on.
// Adjust as needed for your app.
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
