import React, { useState } from "react";
import { useRouter } from "next/navigation";

import { useInFocus } from "@/context/InFocusContext";
import { useApp } from "@/context/AppContext";
import { useUi } from "@/context/UiContext";

import MultiItems from "@/components/multiItems/MultiItems";
import CrudItem from "../crudItem";
import SectionHeader from "@/components/sectionHeader/SectionHeader";

import config from "@/lib/widgetConfigs/characters.widgetConfig.json";
import { useCharacterConfig } from "./useCharacterConfig";

const { widgetConfig, schemeDefinition } = config;
// I am a comment
export default function CharactersList({ data, containerRef, isLoading }) {
  const router = useRouter();
  const { setCharacterInFocus, setItemInFocus } = useInFocus();
  const { setAppContext } = useApp();
  const { isMobile, showCardMedia, setOpenModal, setModalContent } = useUi();
  const [showDataGrid, setShowDataGrid] = useState(true);

  const handleAddItem = () => {
    setModalContent(
      <CrudItem context={widgetConfig.collection} crud="create" />
    );
    setOpenModal(true);
  };

  const handleClickEdit = (item) => {
    setCharacterInFocus(item);
    setModalContent(
      <CrudItem context={widgetConfig.collection} crud="update" />
    );
    setOpenModal(true);
  };

  const handleItemClick = (item) => {
    setAppContext(widgetConfig.context);
    setItemInFocus(item);
  };

  const { getCardActions, columns, rowActions } = useCharacterConfig({
    handleClickEdit,
    onItemClick: handleItemClick,
    schemeDefinition,
    showCardMedia,
    isMobile,
  });

  const handleRowClick = (params, event) => {
    event.defaultMuiPrevented = true;
    handleItemClick(params.row);
  };

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
