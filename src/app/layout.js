// file path: ~/DEVFOLD/SCRIPT-PITCHER/SRC/APP/LAYOUT.JS

import { Providers } from "./body/providers";
import { getCurrentUser } from "@/lib/auth/auth";
import { getMeData } from "@/lib/data/meFetchers";

import "./globals.css";

export const metadata = {
  title: "Script Pitcher",
  description: "Manage and pitch your scripts with ease.",
};

export default async function RootLayout({ children }) {
  const user = await getCurrentUser();
  console.log("getCurrentUser", user);
  let meData = [];

  if (user?.uid) {
    try {
      meData = await getMeData(user.uid);
    } catch (e) {
      console.error("Failed to fetch invitation count for NavBar:", e);
    }
  }

  return (
    <html lang="en">
      <body
        style={{
          width: "100vw",
          height: "100vh",
        }}
      >
        <Providers meData={meData}>{children}</Providers>
      </body>
    </html>
  );
}
