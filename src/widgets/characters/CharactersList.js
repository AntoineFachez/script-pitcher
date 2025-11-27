import React, { useState } from "react";
import { useRouter } from "next/navigation";

import { useInFocus } from "@/context/InFocusContext";
import { useUi } from "@/context/UiContext";

import MultiItems from "@/components/multiItems/MultiItems";
import SectionHeader from "@/components/sectionHeader/SectionHeader";

import config from "@/lib/widgetConfigs/characters.widgetConfig.json";
import { useCharacterConfig } from "./useCharacterConfig";
import { useWidgetHandlers } from "../shared/useWidgetHandlers";

const { widgetConfig, schemeDefinition } = config;
// I am a comment
export default function CharactersList({ data, containerRef, isLoading }) {
  const router = useRouter();
  const { setCharacterInFocus, setItemInFocus } = useInFocus();
  const { isMobile, showCardMedia } = useUi();
  const [showDataGrid, setShowDataGrid] = useState(true);

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
  });

  const bra = [{ sx: { sx: { sx: {} } } }];
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
        collectionName="users" // Should this be "characters"? Original was "users" (likely copy-paste error)
        widgetConfig={widgetConfig}
        schemeDefinition={schemeDefinition}
        getCardActions={getCardActions}
        handleRowClick={handleRowClick}
      />
    </>
  );
}
