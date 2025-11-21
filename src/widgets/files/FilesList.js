// file path: ~/DEVFOLD/SCRIPT-PITCHER/SRC/WIDGETS/PROJECTS/WIDGET.JS

"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Box, IconButton, Typography } from "@mui/material";
import {
  Add,
  Edit,
  Favorite,
  Public,
  PublicOff,
  Share,
} from "@mui/icons-material";

import { useApp } from "@/context/AppContext";
import { useData } from "@/context/DataContext";
import { useInFocus } from "@/context/InFocusContext";
import { useUi } from "@/context/UiContext";

import KebabMenu from "@/components/menus/KebabMenu";

import widgetData from "./widgetSpex.json";
const { widgetSpex, schemeDefinition } = widgetData;

import { formatShortTime, useRelativeTime } from "@/hooks/useRelativeTime";
import CardGrid from "@/components/cardGrid/CardGrid";
import ShareButton from "@/components/share/ShareButton";
import CrudItem from "../crudItem";
import SectionMenu from "@/components/menus/SectionMenu";
import { sectionHeaderStyles } from "@/theme/muiProps";

// Receive handlers as props
export default function Widget({
  data,
  projectId,
  setFilteredData,
  isLoading,
}) {
  const router = useRouter();
  const { projectInFocus, setFileInFocus, genreInFocus } = useInFocus();
  const { setAppContext } = useApp();
  const { showCardMedia, setOpenModal, setModalContent } = useUi();
  const { handleTogglePublishProject } = useData();

  const [showDataGrid, setShowDataGrid] = useState(false);

  const handleAddFile = () => {
    setModalContent(<CrudItem context="newFile" crud="add" />);
    setOpenModal(true);
  };

  const handleRowClick = (params, event) => {
    event.defaultMuiPrevented = true;
    setAppContext("files");
    setFileInFocus(params.row);
    if (params.row?.id) {
      router.push(`/projects/${projectInFocus.id}/files/${params.row.id}`);
    }
  };

  const handleClickAvatar = (item) => {
    console.log("item", item);

    // setAppContext("projects");
    // setFileInFocus(item);
    // if (item.id) {
    //   router.push(`/projects/${item.id}`);
    // }
  };
  const handleClickTitle = (item) => {
    console.log("projectInFocus", projectInFocus);
    event.defaultMuiPrevented = true;
    setAppContext("files");
    setFileInFocus(item);
    if (item?.id) {
      router.push(`/projects/${projectInFocus.id}/files/${item.id}`);
    }
  };
  const handleCellClick = (params, event) => {
    if (params.field === "actions") {
      event.defaultMuiPrevented = true;
    }
  };
  const handleClickSubTitle = (item) => {
    const filtered = data.filter((project) =>
      project.genres.some((g) => g.genre === item.genre)
    );
    setFilteredData(filtered);
    setGenreInFocus(item.genre);
  };
  const article = {
    title: "How to Build a Share Button in Next.js",
    url: "https://yourawesomeblog.com/posts/share-button",
    author: "Alex",
  };

  const emailSubject = `Check out this article: ${article.title}`;
  const emailBody = `Hey,

I thought you would find this article interesting:
"${article.title}"

You can read it here: ${article.url}

Best,
${article.author}
`;
  // --- getCardProps function ---
  const getCardProps = (episode) => {
    const kebabActions = [
      {
        id: "edit",
        name: "Edit Episode",
        icon: <Edit />,
        action: () => handleClickEdit(episode),
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
      </>
    );

    return {
      showCardMedia: showCardMedia,
      schemeDefinition,
      handleClickAvatar,
      handleClickTitle,
      handleClickSubTitle,
      subTitleInFocus: null, // No subtitle focus for episodes
      headerActions: <KebabMenu actions={kebabActions} />,
      actions: footerActions,
    };
  };
  const columns = [
    { field: "imageUrl", headerName: "Image", align: "right", width: 60 },
    { field: "fileName", headerName: "Title", width: 300 },
    {
      field: "filePurpose",
      headerName: "Purpose",
      align: "center",
      width: 100,
    },
    {
      field: "status",
      headerName: "Status",
      // align: "center",
      width: 100,
    },
    {
      field: "createdAt",
      headerName: "Uploaded",
      align: "center",
      width: 100,
      renderCell: (params) => {
        const relativeCreatedTime = formatShortTime(params.row.createdAt);
        return <>{relativeCreatedTime} ago</>;
      },
    },
    {
      field: "published",
      headerName: "PublishedWithAction",
      align: "center",
      width: 100,
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
      <Box className="sectionHeader" sx={sectionHeaderStyles.sx}>
        {/* <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
          {widgetSpex?.title}
        </Typography>{" "} */}
        <SectionMenu
          showDataGrid={showDataGrid}
          setShowDataGrid={setShowDataGrid}
          handleAddItem={handleAddFile}
        />{" "}
      </Box>
      <CardGrid
        data={data}
        showDataGrid={showDataGrid}
        isLoading={isLoading}
        columns={columns}
        rowActions={rowActions}
        collectionName={"files"}
        widgetSpex={widgetSpex}
        schemeDefinition={schemeDefinition}
        getCardProps={getCardProps}
        handleRowClick={handleRowClick}
      />
    </>
  );
}
