// file path: ~/DEVFOLD/SCRIPT-PITCHER/SRC/WIDGETS/CHARACTERS/INDEX.JS

"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Box, IconButton, ImageListItem, Typography } from "@mui/material";
import { Favorite, Share, Edit } from "@mui/icons-material";

import { useInFocus } from "@/context/InFocusContext";
import { useApp } from "@/context/AppContext";
import { useUi } from "@/context/UiContext";

import BasicModal from "@/components/modal/Modal";
import ImageCell from "@/components/dataGridElements/ImageCell";
import KebabMenu from "@/components/menus/KebabMenu";
import MultiItems from "@/components/multiItems/MultiItems";
import ShareButton from "@/components/share/ShareButton";
import SectionMenu from "@/components/sectionHeader/SectionMenu";

import CrudItem from "../crudItem";

import { dataGridImageCellStyles } from "@/theme/muiProps";

import config from "@/lib/widgetConfigs/characters.widgetConfig.json";
import SectionHeader from "@/components/sectionHeader/SectionHeader";
const { widgetConfig, schemeDefinition } = config;

export default function CharactersList({
  data, // Comes from parent page
  containerRef,
  isLoading,
  // ... any other handlers passed from parent page
}) {
  const router = useRouter();
  const { setCharacterInFocus, itemInFocus, setItemInFocus } = useInFocus(); // Use generic focus
  const { appContext, setAppContext } = useApp();
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
    setCharacterInFocus(item);
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
  const emailSubject = `Check out this character`;
  const emailBody = `Hey, I wanted you to see this character.`;

  // Define DataTable columns (not in widgetConfig.json)
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
            url={avatarUrl}
            dataGridImageCellStyles={dataGridImageCellStyles}
          />
        );
      },
      disableColumnMenu: true,
    },
    {
      field: "name",
      headerName: "Name",
      width: 150,
      flex: 1,
      disableColumnMenu: isMobile && true,
    },
    {
      field: "archetype",
      headerName: "Archetype",
      width: 120,
      flex: 2,
      disableColumnMenu: isMobile && true,
    },
    {
      field: "description",
      headerName: "Description",
      flex: 2,
      minWidth: 200,
      disableColumnMenu: isMobile && true,
    },
  ];
  const visibleColumns = columns.filter(Boolean);
  // --- getCardActions function ---
  const getCardActions = (character) => {
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
    header: "",
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
      <SectionHeader
        widgetConfig={widgetConfig}
        showDataGrid={showDataGrid}
        setShowDataGrid={setShowDataGrid}
        handleAddItem={handleAddItem}
      />

      <MultiItems
        data={data}
        showDataGrid={showDataGrid}
        isLoading={isLoading}
        columns={visibleColumns}
        rowActions={rowActions}
        collectionName="users"
        widgetConfig={widgetConfig}
        schemeDefinition={schemeDefinition}
        getCardActions={getCardActions}
        handleRowClick={handleRowClick}
      />

      {/* <BasicModal
        content={modalContent}
        open={openModal}
        setOpen={setOpenModal}
      /> */}
    </>
  );
}
