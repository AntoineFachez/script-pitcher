// file path: ~/DEVFOLD/SCRIPT-PITCHER/SRC/WIDGETS/EPISODES/INDEX.JS

"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useInFocus } from "@/context/InFocusContext";
import { useUi } from "@/context/UiContext";
import { useAuth } from "@/context/AuthContext";
import SectionHeader from "@/components/sectionHeader/SectionHeader";
import MultiItems from "@/components/multiItems/MultiItems";
import { useEpisodeConfig } from "./useEpisodeConfig";
import { useWidgetHandlers } from "../shared/useWidgetHandlers";

import config from "@/lib/widgetConfigs/episodes.widgetConfig.json";
const { widgetConfig, schemeDefinition } = config;

export default function EpisodesList({
  data, // Comes from parent page
  isLoading,
  // ... any other handlers passed from parent page
}) {
  const router = useRouter();
  const { setEpisodeInFocus, setItemInFocus, itemInFocus } = useInFocus(); // Use generic focus
  const { isMobile, showCardMedia, modalContent, openModal } = useUi();

  const [showDataGrid, setShowDataGrid] = useState(false);

  const { firebaseUser } = useAuth();
  const { projectInFocus } = useInFocus();

  // Determine current user's role
  const currentUserMember = projectInFocus?.members?.[firebaseUser?.uid];
  const userRole = currentUserMember?.role?.role || currentUserMember?.role;
  const isViewer = userRole === "viewer";

  const { handleAddItem, handleClickEdit, handleItemClick, handleRowClick } =
    useWidgetHandlers({
      widgetConfig,
      setEditInFocus: setEpisodeInFocus,
      setSelectInFocus: setItemInFocus,
    });

  const { getCardActions, columns, rowActions, expandedCardContent } =
    useEpisodeConfig({
      handleClickEdit,
      onItemClick: handleItemClick,
      schemeDefinition,
      showCardMedia,
      isMobile,
      userRole, // Pass the role
    });
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
        collectionName="users"
        widgetConfig={widgetConfig}
        schemeDefinition={schemeDefinition}
        getCardActions={getCardActions}
        expandedCardContent={expandedCardContent}
        handleRowClick={handleRowClick}
      />
    </>
  );
}
