// file path: ~/DEVFOLD/SCRIPT-PITCHER/SRC/WIDGETS/FILEPROFILE/INDEX.JS

"use client";
import React from "react";

import { FileProvider } from "@/context/FileContext";
import { WidgetLayout } from "../shared/WidgetLayout";

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
          <WidgetLayout
            layoutContext={layoutContext}
            onNavBarClick={handleSetNewAppContext}
            iconName="Article"
            href="/projects"
          >
            <Widget togglePublishProject={togglePublishProject} />
          </WidgetLayout>
        </WidgetContext>
      </FileProvider>
    </>
  );
}
