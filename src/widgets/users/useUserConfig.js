import React from "react";
import { Chip } from "@mui/material";
import { Person, PersonOff, Edit } from "@mui/icons-material";

import KebabMenu from "@/components/menus/KebabMenu";
import {
  createImageColumn,
  createStatusColumn,
  createRelativeTimeColumn,
} from "../shared/columnFactories";
import { useStandardConfig } from "../shared/useStandardConfig";
import { EMAIL_CONTENT } from "@/lib/constants/notifications";
import { subtitleProps } from "../shared/constants";

export function useUserConfig({
  handleClickEdit,
  handleToggleActiveUser,
  handleClickSubTitle,
  onItemClick,
  roleInFocus,
  schemeDefinition,
  isMobile,
}) {
  const { createRowActions, StandardCardFooter } = useStandardConfig();

  // --- Card Actions ---
  const getCardActions = (user) => {
    const emailSubject = EMAIL_CONTENT.USER.SUBJECT;
    const emailBody = EMAIL_CONTENT.USER.BODY;

    const kebabActions = [
      {
        id: "edit",
        name: "Edit User",
        icon: <Edit />,
        action: () => handleClickEdit(user),
      },
      {
        id: "toggleActive",
        name: user.userActive ? "Deactivate" : "Activate",
        icon: user.userActive ? <Person /> : <PersonOff />,
        action: () => handleToggleActiveUser(user),
      },
    ];

    const footerActions = (
      <StandardCardFooter
        emailSubject={emailSubject}
        emailBody={emailBody}
        onToggle={() => handleToggleActiveUser(user)}
        toggleIcon={user?.userActive ? "Person" : "PersonOff"}
        toggleColor={user?.userActive ? "success.main" : "warning.main"}
      />
    );

    const customSubTitleItem = user.roles?.map((role) => (
      <Chip
        {...subtitleProps}
        key={role.role}
        label={role.role}
        onClick={() => handleClickSubTitle(role)}
      />
    ));

    return {
      showCardMedia: false, // Users don't have media
      schemeDefinition,
      handleClickAvatar: (item) => console.log("Avatar clicked:", item),
      handleClickTitle: (item) => onItemClick(item),
      handleClickSubTitle: (item) => console.log("Subtitle clicked:", item),
      subTitleInFocus: roleInFocus,
      customSubTitleItem,
      headerActions: <KebabMenu actions={kebabActions} />,
      actions: footerActions,
    };
  };

  // --- DataGrid Columns ---
  const columns = [
    createImageColumn("avatarUrl"),
    createStatusColumn(
      "userActive",
      "Active",
      isMobile,
      handleToggleActiveUser
    ),
    {
      field: "displayName",
      headerName: "user",
      align: "left",
      flex: 1,
      width: 100,
      disableColumnMenu: isMobile && true,
    },
    {
      field: "company",
      headerName: "Company",
      align: "left",
      flex: 1,
      width: 100,
      disableColumnMenu: isMobile && true,
    },
    {
      field: "role",
      headerName: "Role",
      align: "left",
      width: 60,
      flex: 1,
      renderCell: (params) => {
        const { role } = params.row;
        return <>{role?.role}</>;
      },
      disableColumnMenu: isMobile && true,
    },
    !isMobile && {
      ...createRelativeTimeColumn("joinedAt", "joined Team", isMobile),
      valueGetter: (params) => params?.row?.role?.joinedAt,
    },
  ];

  const visibleColumns = columns.filter(Boolean);

  // --- Row Actions ---
  const rowActions = createRowActions({
    canToggle: false, // Original didn't have toggle in row actions, keeping it that way for now or could enable it.
    onAdd: () => console.log("handleOpenForm(param.collection)"),
    onDelete: () => console.log("handleDeleteCollection(param.collection)"),
  });

  return {
    getCardActions,
    columns: visibleColumns,
    rowActions,
  };
}
