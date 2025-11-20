// file path: ~/DEVFOLD/SCRIPT-PITCHER/SRC/WIDGETS/PROJECTPROFILE/INDEX.JS

"use client";
import React from "react";

import NavBarButton from "@/components/navBar/navBarButton/NavBarButton";
import { ProjectProvider, useProject } from "@/context/ProjectContext";

import Widget from "./Widget";
import { WidgetContext } from "./Context";

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
          {layoutContext === "navBar" ? (
            <>
              <NavBarButton
                iconName="Article"
                href="/projects"
                prop="projects"
                badgeCount={null}
                handleSetNewAppContext={handleSetNewAppContext}
              />{" "}
            </>
          ) : (
            <>
              <Widget
                initialProject={initialProject}
                files={initialFiles}
                togglePublishProject={togglePublishProject}
              />
            </>
          )}
        </WidgetContext>
      </ProjectProvider>{" "}
    </>
  );
}
