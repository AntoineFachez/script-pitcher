// file path: ~/DEVFOLD/SCRIPT-PITCHER/SRC/APP/API/AUTH/[...NEXTAUTH]/ROUTE.JS

import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth/authOptions";

const handler = NextAuth(authOptions);

// Export the handler for both GET and POST methods
export { handler as GET, handler as POST };
