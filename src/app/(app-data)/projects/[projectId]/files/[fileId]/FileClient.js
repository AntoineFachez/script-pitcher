// file path: ~/DEVFOLD/SCRIPT-PITCHER/SRC/WIDGETS/PROJECTPROFILE/INDEX.JS

"use client";
import React from "react";

import WidgetIndex from "@/widgets/fileProfile";

export default function FileClient({ projectId, fileId }) {
  return (
    <>
      <WidgetIndex projectId={projectId} fileId={fileId} />
    </>
  );
}
