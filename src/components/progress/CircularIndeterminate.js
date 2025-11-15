import * as React from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

export default function CircularIndeterminate({ value }) {
  return (
    <Box sx={{ display: "flex" }}>
      <CircularProgress value={value} />
    </Box>
  );
}
