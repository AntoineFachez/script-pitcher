import React, { useState } from "react";
import { useRouter } from "next/navigation";

import { useApp } from "@/context/AppContext";
import { useInFocus } from "@/context/InFocusContext";
import { useUi } from "@/context/UiContext";

import MultiItems from "@/components/multiItems/MultiItems";
import CrudItem from "../crudItem";
import config from "@/lib/widgetConfigs/files.widgetConfig.json";
import SectionHeader from "@/components/sectionHeader/SectionHeader";
import { useFileConfig } from "./useFileConfig";

const { widgetConfig, schemeDefinition } = config;

export default function FilesList({
  data,
  projectId,
  setFilteredData,
  isLoading,
}) {
  const router = useRouter();
  const { projectInFocus, setFileInFocus, setGenreInFocus } = useInFocus();
  const { setAppContext } = useApp();
  const { setOpenModal, setModalContent } = useUi();

  const [showDataGrid, setShowDataGrid] = useState(false);

  const handleAddItem = () => {
    setModalContent(<CrudItem context={widgetConfig.collection} crud="add" />);
    setOpenModal(true);
  };

  const handleClickEdit = (item) => {
    // setCharacterInFocus(item); // Was this intended? FilesList usually deals with files.
    // Assuming we want to edit the file/episode
    setFileInFocus(item);
    setModalContent(
      <CrudItem context={widgetConfig.collection} crud="update" />
    );
    setOpenModal(true);
  };

  const handleItemClick = (item) => {
    setAppContext(widgetConfig.context);
    setFileInFocus(item);
    if (item?.id) {
      router.push(`/projects/${projectInFocus.id}/files/${item.id}`);
    }
  };

  const { getCardActions, columns, rowActions } = useFileConfig({
    handleClickEdit,
    setFilteredData,
    setGenreInFocus,
    onItemClick: handleItemClick,
    schemeDefinition,
    data,
  });

  const handleRowClick = (params, event) => {
    event.defaultMuiPrevented = true;
    handleItemClick(params.row);
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
        collectionName="files"
        widgetConfig={widgetConfig}
        schemeDefinition={schemeDefinition}
        getCardActions={getCardActions}
        handleRowClick={handleRowClick}
      />
    </>
  );
}

