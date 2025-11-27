import React, { useState } from "react";
import { useRouter } from "next/navigation";

import { useInFocus } from "@/context/InFocusContext";
import { useUi } from "@/context/UiContext";
import { useAuth } from "@/context/AuthContext";

import MultiItems from "@/components/multiItems/MultiItems";
import SectionHeader from "@/components/sectionHeader/SectionHeader";

import config from "@/lib/widgetConfigs/characters.widgetConfig.json";
import { useCharacterConfig } from "./useCharacterConfig";
import { useWidgetHandlers } from "../shared/useWidgetHandlers";

const { widgetConfig, schemeDefinition } = config;

export default function CharactersList({ data, containerRef, isLoading }) {
  const router = useRouter();
  const { firebaseUser } = useAuth();
  const { showDataGrid, setShowDataGrid, showCardMedia, isMobile } = useUi();
  const { projectInFocus, setCharacterInFocus, setItemInFocus } = useInFocus();

  // Determine current user's role
  const currentUserMember = projectInFocus?.members?.[firebaseUser?.uid];
  const userRole = currentUserMember?.role?.role || currentUserMember?.role;
  const isViewer = userRole === "viewer";

  const { handleAddItem, handleClickEdit, handleItemClick, handleRowClick } =
    useWidgetHandlers({
      widgetConfig,
      setEditInFocus: setCharacterInFocus,
      setSelectInFocus: setItemInFocus,
    });

  const { getCardActions, columns, rowActions } = useCharacterConfig({
    handleClickEdit,
    onItemClick: handleItemClick,
    schemeDefinition,
    showCardMedia,
    isMobile,
    userRole, // Pass the role
  });

  const bra = [{ sx: { sx: { sx: {} } } }];
  return (
    <>
      <SectionHeader
        widgetConfig={widgetConfig}
        showDataGrid={showDataGrid}
        setShowDataGrid={setShowDataGrid}
        handleAddItem={isViewer ? null : handleAddItem}
      />
      <MultiItems
        data={data}
        showDataGrid={showDataGrid}
        isLoading={isLoading}
        columns={columns}
        rowActions={rowActions}
        collectionName="users" // Should this be "characters"? Original was "users" (likely copy-paste error)
        widgetConfig={widgetConfig}
        schemeDefinition={schemeDefinition}
        getCardActions={getCardActions}
        handleRowClick={handleRowClick}
      />
    </>
  );
}
