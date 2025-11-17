// file: src/auth.config.js

import GoogleProvider from "@auth/nextjs/providers/google";

export const authConfig = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  // You can add custom pages here if you need them
  // pages: {
  //   signIn: "/login",
  // },
};
