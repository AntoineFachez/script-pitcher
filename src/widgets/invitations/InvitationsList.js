// file path: ~/DEVFOLD/SCRIPT-PITCHER/SRC/WIDGETS/INVITATIONS/INVITATIONSLIST.JS

"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { IconButton, Chip, Typography, Box } from "@mui/material";
import { Favorite, Share, Person, PersonOff, Edit } from "@mui/icons-material";

import { useInFocus } from "@/context/InFocusContext";
import { useApp } from "@/context/AppContext";
import { useUi } from "@/context/UiContext";
import { useAuth } from "@/context/AuthContext";

import ExpirationTimeCell from "@/components/timeCells/ExpirationTimeCell";
import KebabMenu from "@/components/menus/KebabMenu";
import MultiItems from "@/components/multiItems/MultiItems";
import ShareButton from "@/components/share/ShareButton";
import SectionHeader from "@/components/sectionHeader/SectionHeader";

import CrudItem from "../crudItem";

import config from "@/lib/widgetConfigs/invitations.widgetConfig.json";
import InfoPanel from "@/components/infoPanel/InfoPanel";
import { EMAIL_CONTENT } from "@/lib/constants/notifications";
const { widgetConfig, schemeDefinition } = config;

export default function InvitationsList({
  data,
  isLoading,
  // ... any other handlers passed from parent page
}) {
  const router = useRouter();
  const { firebaseUser } = useAuth();
  const { setUserInFocus, roleInFocus, projectInFocus } = useInFocus();
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
  const [filteredData, setFilteredData] = useState(true);
  const [filterBy, setFilterBy] = useState("pending");

  useEffect(() => {
    const filterByStatus = data.filter((item) => item.status === filterBy);
    setFilteredData(filterByStatus);
    return () => {};
  }, [data]);

  const handleAddItem = () => {
    setModalContent(
      <CrudItem context={widgetConfig.collection} crud="inviteUser" />
    );
    setOpenModal(true);
  };

  const handleRowClick = (params, event) => {
    event.defaultMuiPrevented = true;
    const item = params.row;
    setAppContext(widgetConfig.context);
    setUserInFocus(item);
    if (user.uid) {
      router.push(`/users/${user.uid}`);
    }
  };

  const handleClickEdit = (item) => {
    setCharacterInFocus(item);
    setModalContent(
      <CrudItem context={widgetConfig.collection} crud="update" />
    );
    setOpenModal(true);
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

  const handleToggleActiveUser = (item) => {
    // Logic for toggling active status
    console.log("Toggle active clicked:", item);
  };

  // Example email content
  const emailSubject = EMAIL_CONTENT.USER.SUBJECT;
  const emailBody = EMAIL_CONTENT.USER.BODY;

  const columns = [
    {
      field: "expiresAt",
      headerName: "Expires", // Change header name for clarity
      align: "center",
      // Increased width slightly to accommodate longer strings like "1y" or "10mo"
      width: 70,

      renderCell: (params) => {
        return <ExpirationTimeCell value={params.value} />;
      },
      disableColumnMenu: isMobile && true,
    },
    {
      field: "invitedEmail",
      headerName: "invitedEmail",
      align: "left",
      width: 200,
      flex: 2,
      disableColumnMenu: isMobile && true,
    },
    {
      field: "status",
      headerName: "status",
      align: "left",
      width: 70,
      flex: 1,
      disableColumnMenu: isMobile && true,
    },
    {
      field: "role",
      headerName: "role",
      align: "left",
      width: 70,
      flex: 1,
      disableColumnMenu: isMobile && true,
    },
  ];

  const visibleColumns = columns.filter(Boolean);

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
      {filteredData?.length > 0 ? (
        <MultiItems
          data={filteredData}
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
      ) : (
        <Box
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <InfoPanel message="no pending invitations" severity="info" />
        </Box>
      )}
    </>
  );
}
