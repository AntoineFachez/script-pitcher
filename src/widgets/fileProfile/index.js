// file path: ~/DEVFOLD/SCRIPT-PITCHER/SRC/WIDGETS/FILEPROFILE/INDEX.JS

"use client";
import React from "react";

import widgetConfig from "@/lib/widgetConfigs/files.widgetConfig.json";

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
            widgetConfig={widgetConfig}
            layoutContext={layoutContext}
            onNavBarClick={handleSetNewAppContext}
          >
            <Widget togglePublishProject={togglePublishProject} />
          </WidgetLayout>
        </WidgetContext>
      </FileProvider>
    </>
  );
}
