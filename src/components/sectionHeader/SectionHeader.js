import React from "react";
import SectionMenu from "./SectionMenu";
import { Box } from "@mui/material";

export default function SectionHeader({
  widgetConfig,
  showDataGrid,
  setShowDataGrid,
  handleAddItem,
}) {
  return (
    <Box
      {...sectionHeaderProps}
      className={`${sectionHeaderProps.className}__${widgetConfig.context}`}
    >
      <SectionMenu
        showDataGrid={showDataGrid}
        setShowDataGrid={setShowDataGrid}
        handleAddItem={handleAddItem}
      />
    </Box>
  );
}
const sectionHeaderProps = {
  className: "section--header",
  component: "",
  sx: { position: "", top: 0, padding: "0.5rem 0 0 0.5rem" },
};
