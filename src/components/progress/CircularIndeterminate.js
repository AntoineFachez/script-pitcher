import * as React from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

export default function CircularIndeterminate({
  color,
  thickness = 1,
  size = 56,
  value = 100,
}) {
  return (
    <CircularProgress
      value={value}
      color={color}
      enableTrackSlot
      thickness={1}
      size={56}
    />
  );
}
