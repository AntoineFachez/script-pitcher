// file path: ~/DEVFOLD/SCRIPT-PITCHER/SRC/WIDGETS/USERS/INDEX.JS

"use client";
import React, { useState } from "react";
import { IconButton, Chip, Typography, Box } from "@mui/material";
import { Favorite, Share, Person, PersonOff, Edit } from "@mui/icons-material";
import { useRouter } from "next/navigation";

import { useInFocus } from "@/context/InFocusContext";
import { useApp } from "@/context/AppContext";
import { useUi } from "@/context/UiContext";
import { useAuth } from "@/context/AuthContext";

import KebabMenu from "@/components/menus/KebabMenu";
import MultiItems from "@/components/multiItems/MultiItems";
import ShareButton from "@/components/share/ShareButton";

import CrudItem from "../crudItem";

import { dataGridImageCellStyles, subtitleStyles } from "@/theme/muiProps";
import ImageCell from "@/components/dataGridElements/ImageCell";
import RelativeTimeCell from "@/components/timeCells/RelativeTimeCell";

import config from "@/lib/widgetConfigs/users.widgetConfig.json";
import SectionHeader from "@/components/sectionHeader/SectionHeader";
const { widgetConfig, schemeDefinition } = config;

export default function UsersList({
  data,
  isLoading,
  // ... any other handlers passed from parent page
}) {
  const router = useRouter();
  const { setAppContext } = useApp();
  const { firebaseUser } = useAuth();
  const { setUserInFocus, roleInFocus, projectInFocus } = useInFocus();

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
    setModalContent(<CrudItem context="users" crud="inviteUser" />);
    setOpenModal(true);
  };

  const handleRowClick = (params, event) => {
    event.defaultMuiPrevented = true;
    const user = params.row;
    setAppContext("users");
    setUserInFocus(user);
    console.log("clicked row user", user.id, firebaseUser);
    if (user.id === firebaseUser.uid) {
      router.push(`/me`);
    } else if (user.id) {
      router.push(`/users/${user.id}`);
    }
  };

  // --- Define click handlers for cards ---
  const handleClickAvatar = (item) => {
    // Logic for clicking avatar
    console.log("Avatar clicked:", item);
  };

  const handleClickTitle = (item) => {
    // Logic for clicking title (navigation)
    setAppContext("users");
    setUserInFocus(item);
  };

  const handleClickSubTitle = (item) => {
    // Logic for clicking subtitle (e.g., filter by role)
    console.log("Subtitle clicked:", item);
  };

  const handleClickEdit = (item) => {
    // Logic for editing
    console.log("Edit clicked:", item);
  };

  const handleToggleActiveUser = (item) => {
    // Logic for toggling active status
    console.log("Toggle active clicked:", item);
  };

  // Example email content
  const emailSubject = `Check out this user`;
  const emailBody = `Hey, I wanted you to see this user profile.`;

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
      field: "userActive",
      headerName: "Active",
      align: "center",
      width: isMobile ? 40 : 80,
      disableColumnMenu: isMobile && true,
    },
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
      // 4. Add a renderCell to make the icon clickable
      renderCell: (params) => {
        const { role } = params.row;
        return <>{role?.role}</>;
      },
      disableColumnMenu: isMobile && true,
    },
    !isMobile && {
      field: "joinedAt",
      headerName: "joined Team", // Change header name for clarity
      align: "center",
      // Increased width slightly to accommodate longer strings like "1y" or "10mo"
      width: isMobile ? 40 : 80,

      renderCell: (params) => {
        const { role } = params.row;
        return (
          <>
            <RelativeTimeCell value={role?.joinedAt} /> ago
          </>
        );
      },
      disableColumnMenu: isMobile && true,
    },
    !isMobile && {
      field: "topReadDocIds",
      headerName: "topReadDocIds",
      align: "right",
      width: 80,
    },
  ];
  const visibleColumns = columns.filter(Boolean);
  // --- This is the key refactoring ---
  // This function builds the props for each BasicCard
  const getCardProps = (user) => {
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
          aria-label="toggle active"
          onClick={() => handleToggleActiveUser(user)}
          sx={{
            color: user?.userActive ? "success.main" : "warning.main",
          }}
        >
          {user?.userActive ? <Person /> : <PersonOff />}
        </IconButton>
      </>
    );

    const customSubTitleItem = user.roles?.map((role) => (
      <Chip
        key={role.role} // Assuming role is an object { role: '...' }
        sx={subtitleStyles.sx}
        variant="body1"
        label={role.role}
        onClick={() => handleClickSubTitle(role)}
      />
    ));

    return {
      showCardMedia: false, // Users don't have media
      schemeDefinition,
      handleClickAvatar,
      handleClickTitle,
      handleClickSubTitle,
      subTitleInFocus: roleInFocus,
      customSubTitleItem, // Pass the generated chips
      headerActions: <KebabMenu actions={kebabActions} />,
      actions: footerActions,
    };
  };

  const rowActions = {
    header: "",
    width: 40,
    disableColumnMenu: true,
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
      ];
      // Render the KebabMenu component with the actions
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
        getCardProps={getCardProps}
        handleRowClick={handleRowClick}
      />
    </>
  );
}
