// file path: ~/DEVFOLD/SCRIPT-PITCHER/SRC/COMPONENTS/CARDGRID/CARDGRID.JS
// REFACTORED to be generic

import React from "react";
import { Box, Grid, Typography } from "@mui/material";
import BasicCard from "../card/BasicCard";
import { useUi } from "@/context/UiContext";
import { flexListItemStyles } from "@/theme/muiProps";
import { useInFocus } from "@/context/InFocusContext"; // Assuming a generic itemInFocus
import DataTable from "../dataGridElements/DataTable";

export default function CardGrid({
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
          container
          spacing={0}
          sx={{
            height: "fit-content",
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
