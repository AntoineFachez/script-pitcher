import { cookies } from "next/headers";
import { redirect } from "next/navigation";

/**
 * GET /api/auth/logout-redirect
 * Helper route to clear session cookies from the server side
 * and redirect to home. This avoids "Cookies can only be modified..."
 * errors in Server Components.
 */
export async function GET() {
  const cookieStore = await cookies();

  // Clear the session cookie
  cookieStore.set("__session", "", {
    maxAge: 0,
    path: "/",
  });

  // Redirect to home
  redirect("/");
}
