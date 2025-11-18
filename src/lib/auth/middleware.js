// file path: ~/DEVFOLD/SCRIPT-PITCHER/SRC/LIB/AUTH/MIDDLEWARE.JS

// --- START FIX ---
// Import the new 'auth' function from your main auth.js file
import { auth } from "./auth";
// -----------------

// ⭐️ This is now your middleware
export default auth;

// This config remains the same
export const config = {
  // https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
