// src/components/dataGrid/CustomFooter.js

import {
  GridFooter,
  GridFooterContainer,
  GridPagination,
  useGridApiContext,
  useGridSelector,
} from "@mui/x-data-grid";
import { Typography, Box } from "@mui/material";

export default function CustomFooter(props) {
  // props.rowCount and props.selectedRowCount are passed in automatically

  return (
    <GridFooterContainer
      sx={{
        width: "100%",
        display: "flex",
        justifyContent: "space-between", // Better for layout
        alignItems: "center",
        backgroundColor: "background.alpha",
      }}
    >
      {/* This renders the "X rows selected" text */}
      <GridFooter {...props} sx={{ border: "none" }} />

      {/* This renders the "1-5 of X" and page controls */}
      {/* <GridPagination {...props} /> */}
    </GridFooterContainer>
  );
}
