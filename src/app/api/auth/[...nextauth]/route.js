// file path: ~/DEVFOLD/SCRIPT-PITCHER/SRC/APP/API/AUTH/[...NEXTAUTH]/ROUTE.JS
import NextAuth from "next-auth";
// ✅ Import from the new single source of truth
import { authOptions } from "@/lib/auth/auth";

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
