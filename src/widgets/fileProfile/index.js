// file path: ~/DEVFOLD/SCRIPT-PITCHER/SRC/WIDGETS/FILEPROFILE/INDEX.JS

"use client";
import React from "react";

import NavBarButton from "@/components/appBar/navBarButton/NavBarButton";
import { FileProvider } from "@/context/FileContext";

import { WidgetContext } from "./Context";
import Widget from "./Widget";

export default function FileIndex({
  projectId,
  fileId,
  layoutContext,
  handleSetNewAppContext,
  togglePublishProject,
}) {
  return (
    <>
      <FileProvider projectId={projectId} fileId={fileId}>
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
              <Widget togglePublishProject={togglePublishProject} />
            </>
          )}
        </WidgetContext>
      </FileProvider>
    </>
  );
}
