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
import {
  Favorite,
  Share,
  Person,
  PersonOff,
  Edit,
  Check,
  Close,
} from "@mui/icons-material";

import {
  acceptInvitationAction,
  rejectInvitationAction,
} from "@/lib/actions/projectActions";

import KebabMenu from "@/components/menus/KebabMenu";

import ShareButton from "@/components/share/ShareButton";

import CrudItem from "../crudItem";

import ProcessingTimeCell from "@/components/timeCells/ProcessingTimeCell";

const subtitleProps = {
  variant: "body1",
  sx: {
    width: "100%",
    display: "flex",
    flexFlow: "row wrap",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 1,
  },
};
import config from "@/lib/widgetConfigs/receivedInvitations.widgetConfig.json";
import MultiItems from "@/components/multiItems/MultiItems";
import SectionHeader from "@/components/sectionHeader/SectionHeader";
import { EMAIL_CONTENT } from "@/lib/constants/notifications";
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
  const emailSubject = EMAIL_CONTENT.USER.SUBJECT;
  const emailBody = EMAIL_CONTENT.USER.BODY;

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

  const handleAccept = async (invite) => {
    try {
      if (!invite.projectId || !invite.id) {
        console.error("Invalid invitation data", invite);
        return;
      }
      const res = await acceptInvitationAction(invite.projectId, invite.id);
      if (res.error) {
        console.error("Failed to accept invitation:", res.error);
        alert(res.error);
      } else {
        console.log("Invitation accepted successfully!");
        // UI should update automatically due to real-time listeners
      }
    } catch (err) {
      console.error("Error accepting invitation:", err);
    }
  };

  const handleReject = async (invite) => {
    if (!global.confirm("Are you sure you want to decline this invitation?")) {
      return;
    }
    try {
      if (!invite.projectId || !invite.id) {
        console.error("Invalid invitation data", invite);
        return;
      }
      const res = await rejectInvitationAction(invite.projectId, invite.id);
      if (res.error) {
        console.error("Failed to reject invitation:", res.error);
        alert(res.error);
      } else {
        console.log("Invitation rejected successfully!");
        // UI should update automatically due to real-time listeners
      }
    } catch (err) {
      console.error("Error rejecting invitation:", err);
    }
  };

  const rowActions = {
    header: "",
    menu: (params) => {
      const invite = params.row;
      const actions = [
        {
          id: "acceptInvitation",
          name: "Accept",
          icon: <Check color="success" />, // Or just "Check" if string map is used, but passing element is usually supported
          action: () => handleAccept(invite),
        },
        {
          id: "rejectInvitation",
          name: "Decline",
          icon: <Close color="error" />,
          action: () => handleReject(invite),
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
