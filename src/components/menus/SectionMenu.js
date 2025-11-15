import { Add, CreditCard, TableChart } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import React from "react";

export default function SectionMenu({
  showDataGrid,
  setShowDataGrid,
  handleAddItem,
}) {
  return (
    <>
      <IconButton onClick={() => setShowDataGrid((prev) => !prev)}>
        {showDataGrid ? <CreditCard /> : <TableChart />}
      </IconButton>
      <IconButton onClick={() => handleAddItem()}>
        <Add />
      </IconButton>
    </>
  );
}
