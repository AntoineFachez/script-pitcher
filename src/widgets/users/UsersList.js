import React, { useState } from "react";
import { useRouter } from "next/navigation";

import { useInFocus } from "@/context/InFocusContext";
import { useUi } from "@/context/UiContext";
import { useAuth } from "@/context/AuthContext";

import MultiItems from "@/components/multiItems/MultiItems";
import CrudItem from "../crudItem";
import config from "@/lib/widgetConfigs/users.widgetConfig.json";
import SectionHeader from "@/components/sectionHeader/SectionHeader";
import { useUserConfig } from "./useUserConfig";
import { useWidgetHandlers } from "../shared/useWidgetHandlers";

const { widgetConfig, schemeDefinition } = config;

export default function UsersList({ context, data, isLoading }) {
  const router = useRouter();
  const { setAppContext } = useApp();
  const { firebaseUser } = useAuth();
  const { setUserInFocus, roleInFocus } = useInFocus();

  const { isMobile, setOpenModal, setModalContent } = useUi();
  const [showDataGrid, setShowDataGrid] = useState(true);

  const handleAddItem = () => {
    setModalContent(<CrudItem context="users" crud="inviteUser" />);
    setOpenModal(true);
  };

  const { handleItemClick, handleRowClick } = useWidgetHandlers({
    widgetConfig,
    setItemInFocus: setUserInFocus,
    navigateTo: (user) => {
      if (user.uid === firebaseUser.uid) {
        router.push(`/me`);
      } else if (user.uid) {
        router.push(`/users/${user.uid}`);
      }
    },
  });

  const handleClickEdit = (item) => {
    console.log("Edit clicked:", item);
  };

  const handleToggleActiveUser = (item) => {
    console.log("Toggle active clicked:", item);
  };

  const handleClickSubTitle = (item) => {
    console.log("Subtitle clicked:", item);
  };

  const { getCardActions, columns, rowActions } = useUserConfig({
    handleClickEdit,
    handleToggleActiveUser,
    handleClickSubTitle,
    onItemClick: handleItemClick,
    roleInFocus,
    schemeDefinition,
    isMobile,
  });

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
