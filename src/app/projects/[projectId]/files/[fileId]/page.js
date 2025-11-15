// file path: ~/DEVFOLD/SCRIPT-PITCHER/SRC/APP/PROJECTS/[PROJECTID]/FILES/[FILEID]/PAGE.JS

import { DocumentProvider } from "@/context/DocumentContext";
import DocumentClient from "./DocumentClient"; // We will create this next

/**
 * This is the main Server Component for the file page.
 * It reads the URL parameters (`params`) and passes them to the
 * DocumentProvider, which will then fetch the data.
 */
export default function FilePage({ params }) {
  const { projectId, fileId } = params;

  if (!projectId || !fileId) {
    // This should not happen if your routing is set up
    return <div>Missing project or file ID.</div>;
  }

  return (
    // 1. Wrap your page in the provider
    <DocumentProvider projectId={projectId} fileId={fileId}>
      {/* 2. Render the Client component that will consume the context */}
      <DocumentClient />
    </DocumentProvider>
  );
}
