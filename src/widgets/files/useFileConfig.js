import React from "react";
import { Edit } from "@mui/icons-material";

import { useData } from "@/context/DataContext";
import { useUi } from "@/context/UiContext";
import KebabMenu from "@/components/menus/KebabMenu";
import {
  createImageColumn,
  createStatusColumn,
  createRelativeTimeColumn,
} from "../shared/columnFactories";
import { useStandardConfig } from "../shared/useStandardConfig";

export function useFileConfig({
  handleClickEdit,
  setFilteredData,
  setGenreInFocus,
  onItemClick,
  schemeDefinition,
  data,
}) {
  const { handleTogglePublishProject } = useData(); // Assuming files use the same toggle or similar
  const { isMobile, showCardMedia } = useUi();
  const { createRowActions, StandardCardFooter } = useStandardConfig();

  // --- Card Actions ---
  const getCardActions = (episode) => {
    const emailSubject = `Check out this article: ${episode.title || "File"}`;
    const emailBody = `Hey, check this out.`;

    const kebabActions = [
      {
        id: "edit",
        name: "Edit Episode",
        icon: <Edit />,
        action: () => handleClickEdit(episode),
      },
    ];

    const footerActions = (
      <StandardCardFooter
        emailSubject={emailSubject}
        emailBody={emailBody}
        showToggle={false}
      />
    );

    return {
      showCardMedia: showCardMedia,
      schemeDefinition,
      handleClickAvatar: (item) => console.log("item", item),
      handleClickTitle: (item) => onItemClick(item),
      handleClickSubTitle: (item) => {
        const filtered = data.filter((project) =>
          project.genres.some((g) => g.genre === item.genre)
        );
        setFilteredData(filtered);
        setGenreInFocus(item.genre);
      },
      subTitleInFocus: null,
      headerActions: <KebabMenu actions={kebabActions} />,
      actions: footerActions,
    };
  };

  // --- DataGrid Columns ---
  const columns = [
    createImageColumn("avatarUrl"),
    createStatusColumn(
      "published",
      "Published",
      isMobile,
      handleTogglePublishProject
    ),
    {
      field: "fileName",
      headerName: "Title",
      width: 300,
      flex: 1,
      disableColumnMenu: isMobile && true,
    },
    {
      field: "filePurpose",
      headerName: "Purpose",
      align: "left",
      width: 100,
      flex: 1,
      disableColumnMenu: isMobile && true,
    },
    {
      field: "status",
      headerName: "Status",
      align: "center",
      width: 100,
      disableColumnMenu: isMobile && true,
    },
    createRelativeTimeColumn("createdAt", "Uploaded", isMobile),
  ];

  // --- Row Actions ---
  const rowActions = createRowActions({
    onAdd: () => console.log("handleOpenForm(param.collection)"),
    onDelete: () => console.log("handleDeleteCollection(param.collection)"),
    onToggle: (param) =>
      handleTogglePublishProject(param.id, param.published).catch((err) => {
        console.error("Failed to toggle from widget", err);
      }),
  });

  return {
    getCardActions,
    columns,
    rowActions,
  };
}
