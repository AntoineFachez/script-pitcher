// src/components/dataGrid/CustomFooter.js

import {
  GridFooter,
  GridFooterContainer,
  GridPagination,
  useGridApiContext,
  useGridSelector,
} from "@mui/x-data-grid";
import { Typography, Box } from "@mui/material";
import { dataGridFooterContainerStyles } from "@/theme/muiProps";

export default function CustomFooter(props) {
  // props.rowCount and props.selectedRowCount are passed in automatically

  return (
    <GridFooterContainer sx={dataGridFooterContainerStyles.sx}>
      {/* This renders the "X rows selected" text */}
      <GridFooter {...props} sx={{ border: "none" }} />

      {/* This renders the "1-5 of X" and page controls */}
      {/* <GridPagination {...props} /> */}
    </GridFooterContainer>
  );
}
