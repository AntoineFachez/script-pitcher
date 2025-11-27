// file path: ~/DEVFOLD/SCRIPT-PITCHER/SRC/WIDGETS/PROJECTPROFILE/INDEX.JS

"use client";
import React from "react";

import widgetConfig from "@/lib/widgetConfigs/projects.widgetConfig.json";

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
            widgetConfig={widgetConfig}
            layoutContext={layoutContext}
            onNavBarClick={handleSetNewAppContext}
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
