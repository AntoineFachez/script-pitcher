// file path: ~/DEVFOLD/SCRIPT-PITCHER/SRC/WIDGETS/USERS/INDEX.JS
// REFACTORED

"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useInFocus } from "@/context/InFocusContext";
import { useApp } from "@/context/AppContext";
import { useUi } from "@/context/UiContext";
import { useAuth } from "@/context/AuthContext";
import { IconButton, Chip, Typography, Box } from "@mui/material";
import { Favorite, Share, Person, PersonOff, Edit } from "@mui/icons-material";

import KebabMenu from "@/components/menus/KebabMenu";

import ShareButton from "@/components/share/ShareButton";

import CrudItem from "../crudItem";

import ProcessingTimeCell from "@/components/timeCells/ProcessingTimeCell";

import { subtitleProps } from "@/theme/muiProps";
import config from "@/lib/widgetConfigs/receivedInvitations.widgetConfig.json";
import MultiItems from "@/components/multiItems/MultiItems";
import SectionHeader from "@/components/sectionHeader/SectionHeader";
const { widgetConfig, schemeDefinition } = config;

const columns = [
  {
    field: "sentAt",
    headerName: "sentAt", // Change header name for clarity
    align: "center",
    // Increased width slightly to accommodate longer strings like "1y" or "10mo"
    width: 80,

    renderCell: (params) => {
      return <ProcessingTimeCell value={params.value} />;
    },
  },

  {
    field: "invitedByName",
    headerName: "invited By",
    align: "center",
    flex: 1,
    width: 200,
  },
  {
    field: "projectId",
    headerName: "projectId",
    align: "center",
    flex: 1,
    width: 130,
  },
  { field: "role", headerName: "role", align: "center", width: 130 },
  {
    field: "invitationPart",
    headerName: "invitationPart",
    align: "center",
    width: 130,
  },
];

export default function Widget({
  data,
  isLoading,
  // ... any other handlers passed from parent page
}) {
  const router = useRouter();
  const { firebaseUser } = useAuth();
  const { setUserInFocus, roleInFocus, projectInFocus } = useInFocus();
  const { setAppContext } = useApp();
  const {
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
    const token = params.row.invitationPart;

    if (token) {
      router.push(`${token}`);
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

  // --- This is the key refactoring ---
  // This function builds the props for each BasicCard
  const getCardActions = (user) => {
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
        {...subtitleProps}
        key={role.role} // Assuming role is an object { role: '...' }
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
        columns={columns}
        rowActions={rowActions}
        collectionName="users"
        widgetConfig={widgetConfig}
        schemeDefinition={schemeDefinition}
        getCardActions={getCardActions}
        handleRowClick={handleRowClick}
      />
    </>
  );
}
