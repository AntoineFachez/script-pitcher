import { Add, CreditCard, TableChart } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import React from "react";
import { ActionIcon } from "../buttons/ActionIcon";

export default function SectionMenu({
  widgetConfig,
  showDataGrid,
  setShowDataGrid,
  handleAddItem,
}) {
  return (
    <>
      {" "}
      <ActionIcon
        iconName={showDataGrid ? "CreditCard" : "TableChart"}
        onClick={() => setShowDataGrid((prev) => !prev)}
        variant="outlined"
      />
      <ActionIcon
        iconName={"Add"}
        onClick={() => handleAddItem()}
        variant="outlined"
      />
    </>
  );
}
