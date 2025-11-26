// file path: ~/DEVFOLD/SCRIPT-PITCHER/SRC/COMPONENTS/DATAGRIDELEMENTS/DATATABLE.JS

import { useState, useEffect, useCallback } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { useUi } from "@/context/UiContext";
import { useDataGridRowsAndColumns } from "./dataGridUtils";
import GridCustomToolbar from "./GridCustomToolbar";

// 1. Define constants outside to prevent re-creation
const PAGE_SIZE_OPTIONS = [5, 10, 25, 50, 100];

export default function DataTable({
  loading,
  data,
  columns,
  rowActions,
  handleRowClick,
}) {
  const {
    isDesktop,
    isMobile,
    isExpandedTable,
    setIsExpandedTable,
    densityDataGrid,
    setDensityDataGrid,
  } = useUi();

  const { rows, columnsWithActions } = useDataGridRowsAndColumns(
    data,
    columns,
    rowActions
  );

  // 2. Controlled Pagination State
  // This is the "Single Source of Truth" for your pagination.
  const [paginationModel, setPaginationModel] = useState({
    pageSize: 10,
    page: 0,
  });

  // 3. Simplified Density Logic
  // Combine your effects to avoid race conditions
  useEffect(() => {
    if (isExpandedTable) {
      setDensityDataGrid("comfortable");
    } else {
      setDensityDataGrid(isDesktop ? "compact" : "comfortable");
    }
  }, [isExpandedTable, isDesktop, setDensityDataGrid]);

  return (
    <DataGrid
      // --- DATA ---
      loading={loading}
      rows={rows}
      columns={columnsWithActions}
      // --- EVENTS ---
      onRowClick={handleRowClick}
      disableRowSelectionOnClick
      // --- PAGINATION (Controlled) ---
      // We use paginationModel instead of initialState.pagination
      paginationModel={paginationModel}
      onPaginationModelChange={setPaginationModel}
      pageSizeOptions={PAGE_SIZE_OPTIONS}
      // --- LAYOUT & UI ---
      density={densityDataGrid}
      onDensityChange={(newDensity) => setDensityDataGrid(newDensity)}
      showColumnVerticalBorder={true}
      checkboxSelection={!isMobile}
      // --- SLOTS (Injecting Custom Components) ---
      slots={{
        toolbar: GridCustomToolbar,
        // If you want a custom footer, uncomment this:
        // footer: CustomFooter,
      }}
      // --- SLOT PROPS (Configuring those Components) ---
      slotProps={{
        toolbar: {
          isExpandedTable,
          setIsExpandedTable,
        },
        // This targets the default Pagination component to style the "Rows per page" dropdown
        pagination: {
          SelectProps: {
            MenuProps: {
              sx: {
                "& .MuiList-root": {
                  backgroundColor: "steelblue",
                },
              },
            },
          },
        },
      }}
    />
  );
}
