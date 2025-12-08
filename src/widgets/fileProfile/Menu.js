import React from "react";
import { Box, Button, Paper, Typography } from "@mui/material";

export default function Menu({ viewMode, setViewMode }) {
  return (
    <Paper style={{ padding: 20, width: "100%" }}>
      <Typography variant="h5">File Processing View Options</Typography>
      <Box sx={{ my: 2, display: "flex", gap: 1 }}>
        <Button
          variant={viewMode === "hybrid" ? "contained" : "outlined"}
          onClick={() => setViewMode("hybrid")}
        >
          Hybrid
        </Button>
        <Button
          variant={viewMode === "extracted" ? "contained" : "outlined"}
          onClick={() => setViewMode("extracted")}
        >
          Extracted
        </Button>
        <Button
          variant={viewMode === "original" ? "contained" : "outlined"}
          onClick={() => setViewMode("original")}
        >
          Original
        </Button>
      </Box>
    </Paper>
  );
}
