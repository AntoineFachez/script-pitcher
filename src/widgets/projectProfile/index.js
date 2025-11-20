// file path: ~/DEVFOLD/SCRIPT-PITCHER/SRC/WIDGETS/PROJECTPROFILE/INDEX.JS

"use client";
import React from "react";

import NavBarButton from "@/components/navBar/navBarButton/NavBarButton";
import { ProjectProvider, useProject } from "@/context/ProjectContext";

import Widget from "./Widget";
import { WidgetContext } from "./Context";

export default function ProjectIndex({
  handleSetNewAppContext,
  layoutContext,
  projectInFocus,
  initialProject,
  initialFiles,
}) {
  const projectId = initialProject?.id;
  console.log("initialProject", initialProject?.published);
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
                projectInFocus={projectInFocus}
              />
            </>
          )}
        </WidgetContext>
      </ProjectProvider>{" "}
    </>
  );
}
