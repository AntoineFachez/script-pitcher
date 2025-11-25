// file path: ~/DEVFOLD/SCRIPT-PITCHER/SRC/WIDGETS/PROJECTS/WIDGET.JS
// REFACTORED

"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Box, IconButton, ImageListItem, Typography } from "@mui/material";
import { Public, PublicOff, Favorite, Share, Edit } from "@mui/icons-material";

import { toggleProjectPublishState } from "@/lib/actions/projectActions";

import { useApp } from "@/context/AppContext";
import { useData } from "@/context/DataContext";
import { useInFocus } from "@/context/InFocusContext";
import { useUi } from "@/context/UiContext";

import KebabMenu from "@/components/menus/KebabMenu";
import MultiItems from "@/components/multiItems/MultiItems"; // Import generic MultiItems
import ShareButton from "@/components/share/ShareButton";
import ImageCell from "@/components/dataGridElements/ImageCell";

import { dataGridImageCellStyles, sectionHeaderStyles } from "@/theme/muiProps";
import SectionMenu from "@/components/menus/SectionMenu";

import config from "@/lib/widgetConfigs/projects.widgetConfig.json";
const { widgetConfig, schemeDefinition } = config;

// Receive handlers as props
export default function ProjectsList({
  data,
  isLoading,
  // Prop-drilled handlers from the parent page
  onEditProject,
  onSetGenreFocus,
}) {
  const router = useRouter();
  const { setProjectInFocus, genreInFocus } = useInFocus();
  const { setAppContext } = useApp();
  const { isDesktop, showCardMedia } = useUi();
  const [showDataGrid, setShowDataGrid] = useState(true);

  const handleRowClick = (params, event) => {
    event.defaultMuiPrevented = true;
    setAppContext("projects");
    setProjectInFocus(params.row);
    if (params.row?.id) {
      router.push(`/projects/${params.row.id}`);
    }
  };

  // --- Define click handlers for cards ---
  const handleClickAvatar = (item) => {
    console.log("Avatar clicked:", item);
  };

  const handleClickTitle = (item) => {
    setAppContext("projects");
    setProjectInFocus(item);
    if (item.id) {
      router.push(`/projects/${item.id}`);
    }
  };

  const handleClickSubTitle = (item) => {
    // This was the genre click
    onSetGenreFocus(item.genre); // Call parent handler
  };

  // Example email content
  const emailSubject = `Check out this project`;
  const emailBody = `Hey, I wanted you to see this project.`;

  // --- This is the key refactoring ---
  const getCardProps = (project) => {
    const kebabActions = [
      {
        id: "edit",
        name: "Edit Project",
        icon: <Edit />,
        action: () => onEditProject(project), // Use prop-drilled handler
      },
      {
        id: "publishProject",
        name: project.published ? "Hide Project" : "Publish Project",
        icon: project.published ? <Public /> : <PublicOff />,
        sx: project.published ? { color: "success.main" } : { color: "#aaa" },
        action: () => toggleProjectPublishState(project.id, project.published),
      },
    ];

    const footerActions = (
      <>
        <IconButton aria-label="add to favorites">
          <Favorite />
        </IconButton>
        <ShareButton
          recipient="friend@example.com"
          subject={emailSubject}
          body={emailBody}
        >
          <Share />
        </ShareButton>
        <IconButton
          aria-label="publish"
          onClick={() =>
            toggleProjectPublishState(project.id, project.published)
          }
          sx={{ color: project?.published ? "success.main" : "inactive.main" }}
        >
          {project?.published ? <Public /> : <PublicOff />}
        </IconButton>
      </>
    );

    return {
      showCardMedia: showCardMedia, // Use value from UiContext
      schemeDefinition,
      handleClickAvatar,
      handleClickTitle,
      handleClickSubTitle,
      subTitleInFocus: genreInFocus,
      headerActions: <KebabMenu actions={kebabActions} />,
      actions: footerActions,
    };
  };
  const avatarWidth = isDesktop ? 80 : 20;
  const columns = [
    {
      field: "avatarUrl",
      headerName: "",
      align: dataGridImageCellStyles.sx.align,
      width: dataGridImageCellStyles.sx.width,
      // 4. Add a renderCell to make the icon clickable
      renderCell: (params) => {
        const { avatarUrl } = params.row;
        return (
          <ImageCell
            avatarUrl={avatarUrl}
            dataGridImageCellStyles={dataGridImageCellStyles}
          />
        );
      },
    },
    { field: "title", headerName: "Title", flex: 1, width: 130 },
    // {
    //   field: "published",
    //   headerName: "Published",
    //   align: "center",
    //   width: 100,
    // },
    {
      field: "published",
      headerName: "Published",
      align: "center",
      width: 60,
      // 4. Add a renderCell to make the icon clickable
      renderCell: (params) => {
        const { id, published } = params.row;
        return (
          <IconButton
            aria-label="publish"
            onClick={(e) => {
              e.stopPropagation(); // Stop row click
              e.defaultMuiPrevented = true;
              // Call the context handler directly
              handleTogglePublishProject(id, published).catch((err) => {
                // Catch errors here to show a toast if needed
                console.error("Failed to toggle from widget", err);
              });
            }}
            color={published ? "success" : "default"}
          >
            {published ? <Public /> : <PublicOff />}
          </IconButton>
        );
      },
    },
    {
      field: "genres",
      headerName: "Genres",
      align: "center",
      width: 100,
    },
    // {
    //   field: "topReadDocIds",
    //   headerName: "topReadDocIds",
    //   align: "right",
    //   width: 80,
    // },
  ];

  const rowActions = {
    header: "",
    menu: (param) => {
      const actions = [
        {
          id: "addDocument",
          name: "Add Document",
          icon: "Add",
          action: () => console.log("handleOpenForm(param.collection)"),
        },
        {
          id: "deleteCollection",
          name: "Delete Collection",
          icon: "Delete",
          action: () => console.log("handleDeleteCollection(param.collection)"),
        },
        {
          id: "publishProject",
          name: param.published ? "Hide Project" : "Publish Project",
          icon: param.published ? "Public" : "PublicOff",
          sx: param.published ? { color: "success.main" } : { color: "#aaa" },
          action: () => {
            return handleTogglePublishProject(param.id, param.published).catch(
              (err) => {
                // Catch errors here to show a toast if needed
                console.error("Failed to toggle from widget", err);
              }
            );
          },
        },
      ];
      // Render the KebabMenu component with the actions
      return <KebabMenu actions={actions} />;
    },
  };

  return (
    <>
      <Box
        className={`${sectionHeaderStyles.className}__${widgetConfig.context}`}
        sx={sectionHeaderStyles.sx}
      >
        <SectionMenu
          showDataGrid={showDataGrid}
          setShowDataGrid={setShowDataGrid}
          handleAddItem={null}
        />{" "}
      </Box>
      <MultiItems
        data={data}
        showDataGrid={showDataGrid}
        isLoading={isLoading}
        columns={columns}
        rowActions={rowActions}
        collectionName="projects"
        widgetConfig={widgetConfig}
        schemeDefinition={schemeDefinition}
        getCardProps={getCardProps}
        handleRowClick={handleRowClick}
      />
    </>
  );
}
