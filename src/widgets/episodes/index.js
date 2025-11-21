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

import DataTable from "@/components/dataGridElements/DataTable";
import KebabMenu from "@/components/menus/KebabMenu";
import CardGrid from "@/components/cardGrid/CardGrid";
import ShareButton from "@/components/share/ShareButton";

import widgetData from "./widgetSpex.json";
const { widgetSpex, schemeDefinition } = widgetData;
import Image from "next/image";
import CrudItem from "../crudItem";
import SectionMenu from "@/components/menus/SectionMenu";
import { sectionHeaderStyles } from "@/theme/muiProps";

const columns = [
  {
    field: "avatarUrl",
    headerName: "Image",
    align: "center",
    width: 100,
    // 4. Add a renderCell to make the icon clickable
    renderCell: (params) => {
      const { avatarUrl } = params.row;
      return (
        <ImageListItem
          key={avatarUrl}
          sx={{
            display: "block",
            // position: 'relative' is not needed here
          }}
        >
          <Image
            width={500}
            height={500}
            src={avatarUrl}
            alt={avatarUrl}
            // 3. Add responsive styles
            style={{
              width: "100%", // This makes it fit the column
              height: "auto", // This makes it scale with the correct aspect ratio
              objectFit: "cover",
            }}
          />
        </ImageListItem>
      );
    },
  },
  { field: "title", headerName: "Title", width: 150 },
  {
    field: "description",
    headerName: "Description",
    flex: 1,
    minWidth: 200,
  },
];

export default function Widget({
  data, // Comes from parent page
  isLoading,
  // ... any other handlers passed from parent page
}) {
  const router = useRouter();
  const { setEpisodeInFocus, setItemInFocus, itemInFocus } = useInFocus(); // Use generic focus
  const { setAppContext } = useApp();
  const {
    showCardMedia,
    modalContent,
    openModal,
    setOpenModal,
    setModalContent,
  } = useUi();

  const [showDataGrid, setShowDataGrid] = useState(true);

  const handleAddEpisode = () => {
    setModalContent(<CrudItem context="episodes" crud="add" />);
    setOpenModal(true);
  };

  const handleRowClick = (params, event) => {
    event.defaultMuiPrevented = true;
    const episode = params.row;
    setAppContext("episodes");
    setItemInFocus(episode);
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
  const handleClickEdit = (item) => {
    setEpisodeInFocus(item);
    setModalContent(<CrudItem context="episodes" crud="update" />);
    setOpenModal(true);
  };

  // Example email content
  const emailSubject = `Check out this episode`;
  const emailBody = `Hey, I wanted you to see this episode.`;

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
    header: "Actions",
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
      <Box className="sectionHeader" sx={sectionHeaderStyles.sx}>
        {/* <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
          {widgetSpex?.title}
        </Typography> */}
        <SectionMenu
          showDataGrid={showDataGrid}
          setShowDataGrid={setShowDataGrid}
          handleAddItem={handleAddEpisode}
        />{" "}
      </Box>
      <CardGrid
        data={data}
        showDataGrid={showDataGrid}
        isLoading={isLoading}
        columns={columns}
        rowActions={rowActions}
        collectionName="users"
        widgetSpex={widgetSpex}
        schemeDefinition={schemeDefinition}
        getCardProps={getCardProps}
        handleRowClick={handleRowClick}
      />
    </>
  );
}
