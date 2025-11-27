import React from "react";
import { IconButton } from "@mui/material";
import { Favorite, Share, Edit } from "@mui/icons-material";

import KebabMenu from "@/components/menus/KebabMenu";
import ShareButton from "@/components/share/ShareButton";
import ImageCell from "@/components/dataGridElements/ImageCell";
import { dataGridImageCellStyles } from "../shared/constants";

export function useEpisodeConfig({
  handleClickEdit,
  onItemClick,
  schemeDefinition,
  showCardMedia,
  isMobile,
}) {
  // Example email content
  const emailSubject = `Check out this episode`;
  const emailBody = `Hey, I wanted you to see this episode.`;

  // --- Card Actions ---
  const getCardActions = (episode) => {
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
      handleClickAvatar: (item) => onItemClick(item),
      handleClickTitle: (item) => onItemClick(item),
      handleClickSubTitle: (item) => console.log("Subtitle clicked:", item),
      subTitleInFocus: null, // No subtitle focus for episodes
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

  // --- Row Actions ---
  const rowActions = {
    header: "",
    width: 40,
    disableColumnMenu: true,
    menu: (param) => {
      const episode = param.row;
      const actions = [
        {
          id: "edit",
          name: "Edit Episode",
          icon: "Edit",
          action: () => handleClickEdit(episode),
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
