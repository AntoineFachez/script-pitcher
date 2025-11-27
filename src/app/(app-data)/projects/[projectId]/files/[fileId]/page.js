// file path: ~/DEVFOLD/SCRIPT-PITCHER/SRC/APP/PROJECTS/[PROJECTID]/FILES/[FILEID]/PAGE.JS

import FilesClient from "./FileClient"; // We will create this next

/**
 * This is the main Server Component for the file page.
 * It reads the URL parameters (`params`) and passes them to the
 * FilesProvider, which will then fetch the data.
 */
export default async function ViewFilePage({ params }) {
  // 2. Await the params before using them
  const resolvedParams = await params;
  const { projectId, fileId } = resolvedParams;

  if (!projectId || !fileId) {
    return <div>Missing project or file ID.</div>;
  }

  return <FilesClient projectId={projectId} fileId={fileId} />;
}
