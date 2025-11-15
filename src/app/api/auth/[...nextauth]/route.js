// TODO: refactor with "// file path: ~/DEVFOLD/SCRIPT-PITCHER/SRC/LIB/AUTH.JS"

// file path: ~/DEVFOLD/SCRIPT-PITCHER/SRC/APP/API/AUTH/[...NEXTAUTH]/ROUTE.JS

import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
// Add any other providers you need, e.g., GitHub, Credentials, etc.

export const authOptions = {
  // Configure one or more authentication providers
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    // ...add more providers here
  ],
  // A secret is required for JWT encryption
  secret: process.env.NEXTAUTH_SECRET,

  // You can add custom pages, callbacks, etc. here if needed
  // pages: {
  //   signIn: '/auth/signin',
  // },
};

const handler = NextAuth(authOptions);

// Export the handler for both GET and POST methods
export { handler as GET, handler as POST };
