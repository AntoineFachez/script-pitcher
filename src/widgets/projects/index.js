"use client";

import React, { useEffect, useState } from "react";
import { doc, onSnapshot, collection } from "firebase/firestore";
import { Box, Typography } from "@mui/material";

import { ProjectProvider, useProject } from "@/context/ProjectContext";

import ProjectContent from "./Widget";

export function WidgetIndex({ initialProject, initialFiles }) {
  // The projectId is part of the initialProject data, or if you still need it separately:
  const projectId = initialProject?.id;

  if (!projectId) {
    // Handle case where project data is null/undefined after fetch failure
    return <Typography>Project data error.</Typography>;
  }

  return (
    <ProjectProvider projectId={projectId}>
      <ProjectContent
        initialProject={initialProject}
        initialFiles={initialFiles}
      />
    </ProjectProvider>
  );
}
