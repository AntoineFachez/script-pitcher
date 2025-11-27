import React, { useState } from "react";
import { useRouter } from "next/navigation";

import { useInFocus } from "@/context/InFocusContext";

import MultiItems from "@/components/multiItems/MultiItems";
import SectionHeader from "@/components/sectionHeader/SectionHeader";
import config from "@/lib/widgetConfigs/projects.widgetConfig.json";
import { useProjectConfig } from "./useProjectConfig";
import { useWidgetHandlers } from "../shared/useWidgetHandlers";

const { widgetConfig, schemeDefinition } = config;

export default function ProjectsList({
  data,
  isLoading,
  onEditProject,
  onSetGenreFocus,
}) {
  const router = useRouter();
  const { setProjectInFocus } = useInFocus();
  const [showDataGrid, setShowDataGrid] = useState(true);

  const { handleItemClick, handleRowClick } = useWidgetHandlers({
    widgetConfig,
    setItemInFocus: setProjectInFocus,
    navigateTo: (item) => {
      if (item?.id) {
        router.push(`/projects/${item.id}`);
      }
    },
  });

  const { getCardActions, columns, rowActions } = useProjectConfig({
    onEditProject,
    onSetGenreFocus,
    onItemClick: handleItemClick,
    schemeDefinition,
  });

  return (
    <>
      <SectionHeader
        widgetConfig={widgetConfig}
        showDataGrid={showDataGrid}
        setShowDataGrid={setShowDataGrid}
        handleAddItem={null}
      />
      <MultiItems
        data={data}
        showDataGrid={showDataGrid}
        isLoading={isLoading}
        columns={columns}
        rowActions={rowActions}
        collectionName="projects"
        widgetConfig={widgetConfig}
        schemeDefinition={schemeDefinition}
        getCardActions={getCardActions}
        handleRowClick={handleRowClick}
      />
    </>
  );
}
