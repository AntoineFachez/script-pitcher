// file path: ~/DEVFOLD/SCRIPT-PITCHER/SRC/LIB/MAPS/ACTIONS.JS

export function getProjectsForUser(userInFocus, roles, projects) {
  const userRoles = roles?.filter(
    (role) => role.userId === userInFocus?.userId
  );

  const userProjectIds = [...new Set(userRoles?.map((role) => role.projectId))];

  const projectsInvolvingUser = projects?.filter((project) =>
    userProjectIds.includes(project.projectId)
  );

  const allRolesByProjectMap = roles?.reduce((acc, role) => {
    const projectId = role.projectId;

    const teamMember = {
      ...userInFocus,
      role: role.role,
      isAdmin: role.admin === role.userId,
      filesAccess: role?.files?.map((f) => f.fileId).filter((id) => id),
    };

    if (!acc[projectId]) {
      acc[projectId] = [];
    }

    if (!acc[projectId].some((member) => member.userId === role.userId)) {
      acc[projectId].push(teamMember);
    }

    return acc;
  }, {});

  const knitData = projectsInvolvingUser?.map((project) => {
    const projectId = project.projectId;
    const team = allRolesByProjectMap[projectId] || [];

    return {
      ...project,
      team: team, // Attach the full team
      teamSize: team.length,
    };
  });

  return knitData;
}
export function knitProjectData(projects, users, rolesInProjects) {
  // 1. Create a map for quick user lookup by userId
  const userMap = users?.reduce((acc, user) => {
    acc[user.userId] = user;
    return acc;
  }, {});

  // 2. Group roles by projectId and enrich them with user details
  const rolesByProjectMap = rolesInProjects?.reduce((acc, role) => {
    const projectId = role.projectId;
    const userDetails = userMap[role.userId] || {}; // Get user details

    // Create an enriched team member object
    const teamMember = {
      ...userDetails, // Include all user details
      role: role.role,
      isAdmin: role.admin === role.userId, // Determine if they are the admin
      filesAccess: role.files?.map((f) => f.fileId).filter((id) => id), // Extract file IDs
    };

    if (!acc[projectId]) {
      acc[projectId] = [];
    }

    // Check if user already exists for this project (e.g., if multiple role entries exist for the same user/project, which is common)
    const existingIndex = acc[projectId].findIndex(
      (member) => member.userId === role.userId
    );

    if (existingIndex === -1) {
      acc[projectId].push(teamMember);
    } else {
      // Logic to merge roles/access if a user appears multiple times for the same project
      // For simplicity here, we'll just keep the first entry, but in a real-world scenario,
      // you might combine roles/access if the data structure allowed.
      // E.g., acc[projectId][existingIndex].roles.push(role.role);
    }

    return acc;
  }, {});

  // 3. Merge the projects with their corresponding roles/team
  const knitData = projects?.map((project) => {
    const projectId = project.projectId;
    const team = rolesByProjectMap[projectId] || [];

    return {
      ...project,
      team: team, // Add the consolidated team array to the project
      // Optional: Add a count for quick filtering/display
      teamSize: team.length,
    };
  });

  return knitData;
}
