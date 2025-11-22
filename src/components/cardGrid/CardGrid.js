// file path: ~/DEVFOLD/SCRIPT-PITCHER/SRC/COMPONENTS/CARDGRID/CARDGRID.JS
// REFACTORED to be generic

import React from "react";
import { Box, Grid, Typography } from "@mui/material";

import { useInFocus } from "@/context/InFocusContext"; // Assuming a generic itemInFocus
import { useUi } from "@/context/UiContext";

import BasicCard from "../card/BasicCard";
import DataTable from "../dataGridElements/DataTable";

import { flexListItemStyles } from "@/theme/muiProps";

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
  getCardProps, // Function from parent to get item-specific props
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
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            // height: "100%",
            // minHeight: "20rem",
          }}
        >
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
          spacing={0}
          sx={{
            width: "100%",
            height: "100%",
            p: 0,
          }}
        >
          {data.map((item, index) => {
            // Get all item-specific props from the parent widget
            const cardProps = getCardProps(item);

            return (
              <BasicCard
                key={index}
                item={item}
                itemInFocus={itemInFocus} // Use generic itemInFocus
                collection={collectionName}
                schemeDefinition={schemeDefinition}
                cardProps={cardProps} // Pass all props (actions, handlers, etc.)
                toggleDetails={toggleDetails}
                disablePadding

                // customItem prop can still be passed via cardProps if needed
              />
            );
          })}
        </Grid>
      )}
    </>
  );
}
