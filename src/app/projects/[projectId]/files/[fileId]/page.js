// file path: ~/DEVFOLD/SCRIPT-PITCHER/SRC/APP/PROJECTS/[PROJECTID]/FILES/[FILEID]/PAGE.JS

import FilesClient from "./FileClient"; // We will create this next

/**
 * This is the main Server Component for the file page.
 * It reads the URL parameters (`params`) and passes them to the
 * FilesProvider, which will then fetch the data.
 */
export default function ViewFilePage({ params }) {
  const { projectId, fileId } = params;

  if (!projectId || !fileId) {
    // This should not happen if your routing is set up
    return <div>Missing project or file ID.</div>;
  }

  return <FilesClient projectId={projectId} fileId={fileId} />;
}
