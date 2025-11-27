import React from "react";
import { IconButton } from "@mui/material";
import { Favorite, Share, Edit } from "@mui/icons-material";

import KebabMenu from "@/components/menus/KebabMenu";
import ShareButton from "@/components/share/ShareButton";
import ImageCell from "@/components/dataGridElements/ImageCell";
import { dataGridImageCellStyles } from "../shared/constants";

export function useCharacterConfig({
  handleClickEdit,
  onItemClick,
  schemeDefinition,
  showCardMedia,
  isMobile,
}) {
  // --- Card Actions ---
  const getCardActions = (character) => {
    const emailSubject = `Check out this character`;
    const emailBody = `Hey, I wanted you to see this character.`;

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
      handleClickAvatar: (item) => onItemClick(item),
      handleClickTitle: (item) => onItemClick(item),
      handleClickSubTitle: (item) => console.log("Subtitle clicked:", item),
      subTitleInFocus: null,
      headerActions: <KebabMenu actions={kebabActions} />,
      actions: footerActions,
    };
  };

  // --- DataGrid Columns ---
  const columns = [
    {
      field: "avatarUrl",
      headerName: "",
      align: dataGridImageCellStyles.column.align,
      width: dataGridImageCellStyles.column.width,
      renderCell: (params) => {
        const { avatarUrl } = params.row;
        return <ImageCell url={avatarUrl} sx={dataGridImageCellStyles.sx} />;
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

  // --- Row Actions ---
  const rowActions = {
    header: "",
    menu: (param) => {
      const actions = [
        {
          id: "edit",
          name: "Edit Character",
          icon: "Edit",
          action: () => handleClickEdit(param.row),
        },
      ];
      return <KebabMenu actions={actions} />;
    },
  };

  return {
    getCardActions,
    columns: visibleColumns,
    rowActions,
  };
}
