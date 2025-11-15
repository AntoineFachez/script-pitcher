// file path: ~/DEVFOLD/SCRIPT-PITCHER/SRC/WIDGETS/USERS/INDEX.JS
// REFACTORED

"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useInFocus } from "@/context/InFocusContext";
import { useApp } from "@/context/AppContext";
import { useUi } from "@/context/UiContext";
import { useAuth } from "@/context/AuthContext";
import { IconButton, Chip, Typography } from "@mui/material";
import { Favorite, Share, Person, PersonOff, Edit } from "@mui/icons-material";

import DataTable from "@/components/dataGridElements/DataTable";
import KebabMenu from "@/components/menus/KebabMenu";
import CardGrid from "@/components/cardGrid/CardGrid"; // Import generic CardGrid
import ShareButton from "@/components/share/ShareButton";
import { subtitleStyles } from "@/theme/muiProps";

// Assuming columns are in widgetSpex.json or defined here
import { widgetSpex, schemeDefinition, columns } from "./widgetSpex.json";
import SectionMenu from "@/components/menus/SectionMenu";
import CrudItem from "../crudItem";

export default function Widget({
  data,
  isLoading,
  // ... any other handlers passed from parent page
}) {
  const router = useRouter();
  const { firebaseUser } = useAuth();
  const { setUserInFocus, roleInFocus } = useInFocus();
  const { setAppContext } = useApp();
  const {
    showCardMedia,
    modalContent,
    openModal,
    setOpenModal,
    setModalContent,
  } = useUi();
  const [showDataGrid, setShowDataGrid] = useState(true);

  const handleAddUser = () => {
    setModalContent(<CrudItem context="users" crud="inviteUser" />);
    setOpenModal(true);
  };

  const handleRowClick = (params, event) => {
    event.defaultMuiPrevented = true;
    const user = params.row;
    setAppContext("users");
    setUserInFocus(user);
    if (user.uid) {
      router.push(`/users/${user.uid}`);
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
      {" "}
      <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
        {widgetSpex?.title}
      </Typography>
      <SectionMenu
        showDataGrid={showDataGrid}
        setShowDataGrid={setShowDataGrid}
        handleAddItem={handleAddUser}
      />
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
