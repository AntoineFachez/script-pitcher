export const DB_PATHS = {
    users: () => "users",
    userProfile: (uid) => `users/${uid}`,
    userSummary: (uid) => `users/${uid}/private/summary`,
    projects: () => "projects",
    project: (id) => `projects/${id}`,
    projectFiles: (pid) => `projects/${pid}/files`,
    projectFile: (pid, fid) => `projects/${pid}/files/${fid}`,
    invitations: () => "invitations",
    invitation: (id) => `invitations/${id}`,
    fileLookup: (id) => `fileId_to_projectId_lookup/${id}`,
};
