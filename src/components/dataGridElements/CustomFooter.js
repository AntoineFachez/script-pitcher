// src/components/dataGrid/CustomFooter.js

import {
  GridFooter,
  GridFooterContainer,
  GridPagination,
  useGridApiContext,
  useGridSelector,
} from "@mui/x-data-grid";

export default function CustomFooter(props) {
  // props.rowCount and props.selectedRowCount are passed in automatically

  return (
    <GridFooterContainer {...dataGridFooterContainerProps}>
      {/* This renders the "X rows selected" text */}
      <GridFooter {...props} sx={{ border: "none" }} />

      {/* This renders the "1-5 of X" and page controls */}
      {/* <GridPagination {...props} /> */}
    </GridFooterContainer>
  );
}
const dataGridFooterContainerProps = {
  className: "datagrid",
  component: "",
  sx: {
    width: "100%",
    display: "flex",
    justifyContent: "space-between", // Better for layout
    alignItems: "center",
    backgroundColor: "bars.tool",
  },
};
