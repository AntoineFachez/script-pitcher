// file path: ~/DEVFOLD/SCRIPT-PITCHER/SRC/COMPONENTS/DATAGRIDELEMENTS/DATATABLE.JS

import { useState, useEffect, useMemo, useCallback } from "react";
import {
  DataGrid,
  useGridApiContext,
  useGridSelector,
  gridPageCountSelector,
} from "@mui/x-data-grid";
import MuiPagination from "@mui/material/Pagination";

import { useDataGridRowsAndColumns } from "./dataGridUtils";

import GridCustomToolbar from "./GridCustomToolbar";
import CustomFooter from "./CustomFooter";

const initialState = {
  pagination: {
    paginationModel: {
      pageSize: 5,
    },
  },
  scroll: {
    left: 0, // Start at the leftmost position
  },
};
export default function DataTable({
  loading,
  data,
  columns,
  rowActions,
  handleRowClick,
  handleCellClick,
}) {
  const { rows, columnsWithActions } = useDataGridRowsAndColumns(
    data,
    columns,
    rowActions
  );

  const [isExpandedTable, setIsExpandedTable] = useState(false);
  const [density, setDensity] = useState(
    isExpandedTable ? "comfortable" : "compact"
  );
  const [paginationModel, setPaginationModel] = useState({
    pageSize: 5,
    page: 0,
  });
  const [savedState, setSavedState] = useState({
    count: 0,
    initialState: data?.initialState,
    density: "compact",
  });
  const syncState = useCallback((newInitialState) => {
    setSavedState((prev) => ({
      count: prev.count + 1,
      initialState: newInitialState,
    }));
  }, []);

  useEffect(() => {
    setDensity(isExpandedTable ? "comfortable" : "compact");
  }, [isExpandedTable]);

  const Pagination = ({ page, onPageChange, className }) => {
    const apiRef = useGridApiContext();
    const pageCount = useGridSelector(apiRef, gridPageCountSelector);

    return (
      <MuiPagination
        color="primary"
        className={className}
        count={pageCount}
        page={page + 1}
        onChange={(event, newPage) => {
          onPageChange(event, newPage - 1);
        }}
      />
    );
  };

  return (
    <DataGrid
      sx={{
        width: "100%",
        height: "100%",
        backgroundColor: "background.primary",
      }}
      columnBuffer={1}
      columnThreshold={1}
      key={savedState.count}
      loading={loading}
      rows={rows}
      // rowCount={rows.length}
      columns={columnsWithActions}
      onRowClick={handleRowClick}
      // onCellClick={handleCellClick}
      // isCellEditable={() => "collection"}
      checkboxSelection
      disableRowSelectionOnClick={true}
      initialState={{
        ...data?.initialState,
        // filter: {
        //   filterModel: {
        //     items: [{ field: "docCount", operator: ">", value: 10 }],
        //   },
        // },
        pagination: { paginationModel: { pageSize: 5 } },
        // sorting: {
        //   sortModel: [{ field: "docCount", sort: "desc" }],
        // },
      }}
      // initialState={savedState.initialState}
      paginationModel={paginationModel}
      onPaginationModelChange={setPaginationModel}
      // pageSizeOptions={[5, 10, 25, 50, 100]}
      // autoPageSize={false}
      showToolbar
      slots={{
        toolbar: GridCustomToolbar,
        footer: CustomFooter,
      }}
      slotProps={{
        toolbar: {
          syncState,
          isExpandedTable: isExpandedTable,
          setIsExpandedTable: setIsExpandedTable,
        },
        basePagination: {
          material: {
            ActionsComponent: Pagination,
          },
        },
        pagination: {
          pageSizeOptions: [5, 10, 25, 50, 100],
          sx: {
            "& .MuiInputBase-root": {
              backgroundColor: "red",
            },
          },
        },
        footer: { customProp: "value" },
      }}
      // sx={{
      //   border: 0,
      //   // MuiPaper: { root: { width: "100%" } },
      //   MuiInputBase: { root: { width: "100%" } },
      //   "& .MuiInputBase-root MuiInputBase-colorPrimary MuiTablePagination-select":
      //     { root: { width: "fit-content" } },
      // }}
      density={density}
      // onDensityChange={handleDensityChange}
      onDensityChange={(newDensity) => setDensity(newDensity)}
      // showColumnVerticalBorder={true}
      // hideFooter={!isExpandedTable ? true : false}
      // hideFooterSelectedRowCount={!isExpandedTable ? true : false}
      // hideFooterSelectedRowCount={false}
      // hideFooterPagination={!isExpandedTable ? true : false}
      // labelRowsPerPage="Items per Page"
      // autoHeight
      // slots={{
      //   // toolbar: CustomToolbar,
      //   toolbar: CustomToolbar,
      //   // toolbar: ToolbarContainer,
      //   // noRowsOverlay: MyNoRowsOverlay,
      //   // toolbar: GridToolbar && Toolbar,
      //   // toolbar: (
      //   //   <>
      //   //     <Toolbar />
      //   //   </>
      //   // ),
      //   // rowReorderIcon: <SwapVert />,
      // }}
    />
  );
}
