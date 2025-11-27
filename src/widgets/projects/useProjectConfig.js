import React from "react";
import { Public, PublicOff, Edit } from "@mui/icons-material";

import { useData } from "@/context/DataContext";
import { useUi } from "@/context/UiContext";
import { useAuth } from "@/context/AuthContext";
import { useUser } from "@/context/UserContext";
import KebabMenu from "@/components/menus/KebabMenu";
import {
  createImageColumn,
  createStatusColumn,
} from "../shared/columnFactories";
import { useStandardConfig } from "../shared/useStandardConfig";
import { EMAIL_CONTENT } from "@/lib/constants/notifications";

export function useProjectConfig({
  onEditProject,
  onSetGenreFocus,
  onItemClick,
  schemeDefinition,
}) {
  const { handleTogglePublishProject } = useData();
  const { isMobile, showCardMedia } = useUi();
  const { createRowActions, StandardCardFooter } = useStandardConfig();

  const { firebaseUser } = useAuth();
  const { myProjects } = useUser();

  // --- Card Actions ---
  const getCardActions = (project) => {
    const emailSubject = EMAIL_CONTENT.PROJECT.SUBJECT;
    const emailBody = EMAIL_CONTENT.PROJECT.BODY;

    // Determine role from UserContext (myProjects map)
    const userRole = myProjects?.[project.id]?.role;
    const isViewer = userRole === "viewer";

    const kebabActions = [
      {
        id: "edit",
        name: "Edit Project",
        icon: <Edit />,
        action: () => onEditProject(project),
      },
      {
        id: "publishProject",
        name: project.published ? "Hide Project" : "Publish Project",
        icon: project.published ? <Public /> : <PublicOff />,
        sx: project.published ? { color: "success.main" } : { color: "#aaa" },
        action: () => handleTogglePublishProject(project.id, project.published),
      },
    ];

    // Filter actions for viewers
    const visibleKebabActions = isViewer ? [] : kebabActions;

    const footerActions = (
      <StandardCardFooter
        emailSubject={emailSubject}
        emailBody={emailBody}
        onToggle={() =>
          handleTogglePublishProject(project.id, project.published)
        }
        toggleIcon={project?.published ? <Public /> : <PublicOff />}
        toggleColor={project?.published ? "success.main" : "inactive.main"}
        // Disable toggle for viewers
        disabled={isViewer}
      />
    );

    return {
      showCardMedia: showCardMedia,
      schemeDefinition,
      handleClickAvatar: (item) => console.log("Avatar clicked:", item),
      handleClickTitle: (item) => onItemClick(item),
      handleClickSubTitle: (item) => onSetGenreFocus(item.genre),
      subTitleInFocus: null, // Passed from parent if needed
      headerActions: <KebabMenu actions={visibleKebabActions} />,
      actions: footerActions,
    };
  };

  // --- DataGrid Columns ---
  const columns = [
    createImageColumn("bannerUrl"),
    createStatusColumn(
      "published",
      "Published",
      isMobile,
      handleTogglePublishProject
    ),
    {
      field: "title",
      headerName: "Title",
      flex: 1,
      width: 130,
      disableColumnMenu: isMobile && true,
    },
    {
      field: "genres",
      headerName: "Genres",
      align: "center",
      width: 100,
      disableColumnMenu: isMobile && true,
    },
  ];

  const visibleColumns = columns.filter(Boolean);

  // --- Row Actions ---
  const rowActions = createRowActions({
    onAdd: () => console.log("handleOpenForm(param.collection)"),
    onDelete: () => console.log("handleDeleteCollection(param.collection)"),
    onToggle: (param) => {
      // Check role for this specific project
      const role = myProjects?.[param.id]?.role;
      if (role === "viewer") return; // Block action

      return handleTogglePublishProject(param.id, param.published).catch(
        (err) => {
          console.error("Failed to toggle from widget", err);
        }
      );
    },
  });

  return {
    getCardActions,
    columns: visibleColumns,
    rowActions,
  };
}
