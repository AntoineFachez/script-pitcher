// file path: ~/DEVFOLD/SCRIPT-PITCHER/SRC/COMPONENTS/CARDGRID/CARDGRID.JS
// REFACTORED to be generic

import React from "react";
import { Box, Grid, Typography } from "@mui/material";

import { useInFocus } from "@/context/InFocusContext"; // Assuming a generic itemInFocus
import { useUi } from "@/context/UiContext";

import BasicCard from "../card/BasicCard";
import DataTable from "../dataGridElements/DataTable";

export default function CardGrid({
  containerRef,
  data,
  showDataGrid,
  isLoading,
  columns,
  rowActions,
  collectionName,
  widgetSpex,
  schemeDefinition,
  getCardActions, // Function from parent to get item-specific props
  expandedCardContent,
  handleRowClick,
}) {
  const { toggleDetails, showCardMedia } = useUi();
  const { itemInFocus } = useInFocus(); // Using a generic itemInFocus

  if (!data || data.length === 0) {
    return null; // Or some placeholder
  }

  return (
    <>
      {" "}
      {showDataGrid ? (
        <Box sx={{ height: "100%" }}>
          <DataTable
            loading={isLoading}
            data={data}
            columns={columns} // From widgetSpex.json
            rowActions={rowActions}
            handleRowClick={handleRowClick}
            handleCellClick={null}
          />
        </Box>
      ) : (
        <Grid
          className="grid--container"
          ref={containerRef}
          container
          spacing={isMobile ? 2 : 5}
          sx={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            p: isMobile ? 2 : 5,
            overflow: "auto",
          }}
        >
          {data.map((item, index) => {
            // Get all item-specific props from the parent widget
            const cardActions = getCardActions(item);

            return (
              <BasicCard
                key={index}
                item={item}
                itemInFocus={itemInFocus} // Use generic itemInFocus
                collection={collectionName}
                schemeDefinition={schemeDefinition}
                cardActions={cardActions} // Pass all props (actions, handlers, etc.)
                toggleDetails={toggleDetails}
                disablePadding
                expandedCardContent={expandedCardContent}
              />
            );
          })}
        </Grid>
      )}
    </>
  );
}
