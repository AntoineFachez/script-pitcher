// file path: ~/DEVFOLD/SCRIPT-PITCHER/SRC/APP/(APP-DATA)/USERS/USERSCLIENTPAGE.JS

"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Box, Divider, Typography } from "@mui/material";

import { useApp } from "@/context/AppContext";
import { useUi } from "@/context/UiContext";
import { useData } from "@/context/DataContext";
import { useInFocus } from "@/context/InFocusContext";

import BasicModal from "@/components/modal/Modal";
import UsersWidget from "@/widgets/users";
import CrudItem from "@/widgets/crudItem";

import Menu from "./elements/Menu";

import {
  pageHeaderStyles,
  pageMainStyles,
  pageStyles,
  titleStyle,
  widgetContainerStyles,
} from "@/theme/muiProps";
import RolesList from "./elements/RolesList";

export default function Page() {
  const { appContext, setAppContext } = useApp();
  const {
    modalContent,
    setModalContent,
    openModal,
    setOpenModal,
    toggleDetails,
    showPublished,
    showActiveUsers,
    setShowActiveUsers,
  } = useUi();

  const { roleInFocus, setRoleInFocus } = useInFocus();
  const { users, rolesInProjects } = useData();
  const [filteredData, setFilteredData] = useState([]);

  const handleRoleClick = (role) => {
    const rolesForSelectedRole = rolesInProjects.filter(
      (item) => item.role === role
    );
    const userIdsWithRole = new Set(
      rolesForSelectedRole.map((item) => item.userId)
    );
    const filteredUsers = users.filter((user) =>
      userIdsWithRole.has(user.userId)
    );

    setFilteredData(filteredUsers);
    setRoleInFocus(role);
  };

  const usersList = useMemo(
    () =>
      Object.entries(users || {}).map(([id, data]) => ({
        ...data,
      })),
    [users]
  );

  const uniqueRoles = useMemo(() => {
    const allRoles = rolesInProjects?.map((r) => {
      return r.role;
    });
    return [...new Set(allRoles)];
  }, [rolesInProjects]);

  const displayedData = useMemo(() => {
    let data = usersList;
    if (showActiveUsers) {
      data = data.filter((user) => user.active === true);
    }
    if (roleInFocus) {
      data = data.filter((project) =>
        project.genres?.some((g) => g.genre === roleInFocus)
      );
    }
    return data;
  }, [usersList, showActiveUsers, roleInFocus]);

  const handleFilterByActive = () => {
    setShowActiveUsers((prev) => !prev);
  };
  const menuActions = [
    {
      action: handleFilterByActive,
      label: showActiveUsers ? "show all" : "Only Active",
      startIcon: showActiveUsers ? null : "Person",
      sx: { color: "action.main", scale: 5 },
    },
  ];
  useEffect(() => {
    setAppContext("users");
    setModalContent(<CrudItem context={appContext} crud="create" />);

    return () => {};
  }, [appContext, setModalContent]);
  return (
    <>
      <Box className="pageHeader" sx={pageHeaderStyles.sx}>
        {toggleDetails && (
          <RolesList
            uniqueRoles={uniqueRoles}
            roleInFocus={roleInFocus}
            // clearFilter={clearFilter}
            handleRoleClick={handleRoleClick}
          />
        )}
      </Box>

      <Box className="pageMain" sx={{ ...pageMainStyles.sx }}>
        <UsersWidget data={displayedData} />
      </Box>
      <BasicModal
        content={modalContent}
        open={openModal}
        setOpen={setOpenModal}
      />
    </>
  );
}
