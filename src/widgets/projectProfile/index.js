// file path: ~/DEVFOLD/SCRIPT-PITCHER/SRC/WIDGETS/PROJECTPROFILE/INDEX.JS

"use client";
import React from "react";

import { ProjectProvider } from "@/context/ProjectContext";
import { WidgetLayout } from "../shared/WidgetLayout";

import { WidgetContext } from "./Context";
import Widget from "./Widget";

export default function ProjectIndex({
  layoutContext,
  initialProject,
  initialFiles,
  handleSetNewAppContext,
  togglePublishProject,
}) {
  const projectId = initialProject?.id;
  return (
    <>
      <ProjectProvider projectId={projectId}>
        <WidgetContext>
          <WidgetLayout
            layoutContext={layoutContext}
            onNavBarClick={handleSetNewAppContext}
            iconName="Article"
            href="/projects"
          >
            <Widget
              initialProject={initialProject}
              files={initialFiles}
              togglePublishProject={togglePublishProject}
            />
          </WidgetLayout>
        </WidgetContext>
      </ProjectProvider>{" "}
    </>
  );
}
