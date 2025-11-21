// file path: ~/DEVFOLD/SCRIPT-PITCHER/SRC/WIDGETS/CHARACTERS/INDEX.JS
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
import CrudItem from "../crudItem";
import BasicModal from "@/components/modal/Modal";
import Image from "next/image";
import SectionMenu from "@/components/menus/SectionMenu";
import { sectionHeaderStyles } from "@/theme/muiProps";

// Define DataTable columns (not in widgetSpex.json)
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
  { field: "name", headerName: "Name", width: 150 },
  { field: "archetype", headerName: "Archetype", width: 120 },
  {
    field: "description",
    headerName: "Description",
    flex: 1,
    minWidth: 200,
  },
];

export default function Widget({
  data, // Comes from parent page
  containerRef,
  isLoading,
  // ... any other handlers passed from parent page
}) {
  const router = useRouter();
  const { setCharacterInFocus, itemInFocus, setItemInFocus } = useInFocus(); // Use generic focus
  const { appContext, setAppContext } = useApp();
  const {
    showCardMedia,
    modalContent,
    openModal,
    setOpenModal,
    setModalContent,
  } = useUi();
  const [showDataGrid, setShowDataGrid] = useState(true);

  const handleAddCharacter = () => {
    setModalContent(<CrudItem context="characters" crud="add" />);
    setOpenModal(true);
  };

  const handleRowClick = (params, event) => {
    event.defaultMuiPrevented = true;
    const character = params.row;
    setAppContext("characters");
    setItemInFocus(character);
    // Note: Characters might not have individual pages, so no navigation
    // if (character.id) {
    //   router.push(`/characters/${character.id}`);
    // }
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
    setCharacterInFocus(item);
    setModalContent(<CrudItem context="characters" crud="update" />);
    setOpenModal(true);
  };

  // Example email content
  const emailSubject = `Check out this character`;
  const emailBody = `Hey, I wanted you to see this character.`;

  // --- getCardProps function ---
  const getCardProps = (character) => {
    const kebabActions = [
      {
        id: "edit",
        name: "Edit Character",
        icon: <Edit />,
        action: () => handleClickEdit(character),
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
      subTitleInFocus: null, // No subtitle focus for characters
      headerActions: <KebabMenu actions={kebabActions} />,
      actions: footerActions,
    };
  };

  // --- RowActions for DataTable ---
  const rowActions = {
    header: "Actions",
    menu: (param) => {
      const character = param.row;
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
          handleAddItem={handleAddCharacter}
        />{" "}
      </Box>
      <CardGrid
        containerRef={containerRef}
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
      />{" "}
      <BasicModal
        content={modalContent}
        open={openModal}
        setOpen={setOpenModal}
      />
    </>
  );
}
