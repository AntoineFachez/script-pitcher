// src/components/DataGrid/DetailPanelContent.jsx
import * as React from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

export default function DetailPanelContent({ row }) {
  // You can access row data here, for example, sub-sections
  return (
    <Accordion sx={{ width: "100%", my: 1 }}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="h6">Details for {row.collection}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        {/* Render your data here */}
        <Typography variant="body1">Doc Count: {row.docCount}</Typography>
        <Typography variant="body1">
          Last Updated: {row.lastUpdated.toLocaleString()}
        </Typography>
        {/* You can map over a sub-array from the row data if needed */}
      </AccordionDetails>
    </Accordion>
  );
}
