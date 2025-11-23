// file path: ~/DEVFOLD/SCRIPT-PITCHER/SRC/APP/PAGE.JS

import { getCurrentUser } from "@/lib/auth/auth";
import HomeIndex from "@/widgets/home";

export default async function ViewHomePage({ children }) {
  const user = await getCurrentUser();

  if (!user) {
    return <div>Please log in to view your dashboard.</div>;
  }

  return <HomeIndex />;
}
