// file path: ~/DEVFOLD/SCRIPT-PITCHER/SRC/WIDGETS/EPISODES/INDEX.JS
// NEW WIDGET IMPLEMENTATION

"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useInFocus } from "@/context/InFocusContext";
import { useApp } from "@/context/AppContext";
import { useUi } from "@/context/UiContext";
import { Box, IconButton, ImageListItem, Typography } from "@mui/material";
import { Favorite, Share, Edit } from "@mui/icons-material";

import ImageCell from "@/components/dataGridElements/ImageCell";
import KebabMenu from "@/components/menus/KebabMenu";
import MultiItems from "@/components/multiItems/MultiItems";
import ShareButton from "@/components/share/ShareButton";
import SectionMenu from "@/components/menus/SectionMenu";

import CrudItem from "../crudItem";

import config from "@/lib/widgetConfigs/episodes.widgetConfig.json";
const { widgetConfig, schemeDefinition } = config;
import {
  dataGridImageCellStyles,
  sectionHeaderStyles,
  subtitleStyles,
} from "@/theme/muiProps";

export default function EpisodesList({
  data, // Comes from parent page
  isLoading,
  // ... any other handlers passed from parent page
}) {
  const router = useRouter();
  const { setEpisodeInFocus, setItemInFocus, itemInFocus } = useInFocus(); // Use generic focus
  const { setAppContext } = useApp();
  const {
    isMobile,
    showCardMedia,
    modalContent,
    openModal,
    setOpenModal,
    setModalContent,
  } = useUi();

  const [showDataGrid, setShowDataGrid] = useState(true);

  const handleAddItem = () => {
    setModalContent(
      <CrudItem context={widgetConfig.collection} crud="create" />
    );
    setOpenModal(true);
  };
  const handleClickEdit = (item) => {
    setEpisodeInFocus(item);
    setModalContent(
      <CrudItem context={widgetConfig.collection} crud="update" />
    );
    setOpenModal(true);
  };

  const handleRowClick = (params, event) => {
    event.defaultMuiPrevented = true;
    const item = params.row;
    setAppContext(widgetConfig.context);
    setItemInFocus(item);
  };

  // --- Define click handlers for cards ---
  const handleClickAvatar = (item) => {
    console.log("Avatar clicked:", item);
    setItemInFocus(item);
  };

  const handleClickTitle = (item) => {
    console.log("Title clicked:", item);
    setItemInFocus(item);
  };

  const handleClickSubTitle = (item) => {
    console.log("Subtitle clicked:", item);
  };

  // Example email content
  const emailSubject = `Check out this episode`;
  const emailBody = `Hey, I wanted you to see this episode.`;

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
      disableColumnMenu: true,
    },
    {
      field: "title",
      headerName: "Title",
      width: 150,
      disableColumnMenu: isMobile && true,
    },
    {
      field: "description",
      headerName: "Description",
      flex: 1,
      minWidth: 200,
      disableColumnMenu: isMobile && true,
    },
  ];
  const visibleColumns = columns.filter(Boolean);
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

  // --- RowActions for DataTable ---
  const rowActions = {
    header: "",
    width: 40,
    disableColumnMenu: true,
    menu: (param) => {
      const episode = param.row;
      const actions = [
        {
          id: "edit",
          name: "Edit Character",
          icon: "Edit",
          action: () => handleClickEdit(param),
        },
      ];
      return <KebabMenu actions={actions} />;
    },
  };
  return (
    <>
      <Box
        className={`${sectionHeaderStyles.className}__${widgetConfig.context}`}
      >
        <SectionMenu
          showDataGrid={showDataGrid}
          setShowDataGrid={setShowDataGrid}
          handleAddItem={handleAddItem}
        />
      </Box>
      <MultiItems
        data={data}
        showDataGrid={showDataGrid}
        isLoading={isLoading}
        columns={visibleColumns}
        rowActions={rowActions}
        collectionName="users"
        widgetConfig={widgetConfig}
        schemeDefinition={schemeDefinition}
        getCardProps={getCardProps}
        handleRowClick={handleRowClick}
      />
    </>
  );
}
