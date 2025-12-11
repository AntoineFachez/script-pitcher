import { getCurrentUser } from "@/lib/auth/auth";
import { getProjectsAndMembers } from "@/lib/data/projectFetchers"; // 💡 Import fetcher
import { DataProvider } from "@/context/DataContext"; // 💡 Import DataProvider

export default async function FetchLayout({ children }) {
  const user = await getCurrentUser();
  let projects = [];
  let users = [];

  if (user?.uid) {
    try {
      // 1. Fetch data on the Server
      ({ projects, users } = await getProjectsAndMembers(user.uid));
    } catch (e) {
      console.error("Failed to fetch projects/users:", e);
      // Data remains empty [] in case of error
    }
  }
  console.log("projects", projects);
  console.log("users", users);

  // 2. Wrap the children in the DataProvider (Client Component)
  // and pass the server-fetched data as props.
  return (
    <DataProvider
      serverProjects={projects} // Pass fetched data here
      serverUsers={users} // Pass fetched data here
    >
      {children}
    </DataProvider>
  );
}
