// file: src/middleware.js

import { withAuth } from "next-auth/middleware";

export default withAuth({
  // You can add custom behavior here, like redirecting to a custom login page.
  // pages: { signIn: "/login" }
});

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
