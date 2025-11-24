// file path: ~/DEVFOLD/SCRIPT-PITCHER/SRC/COMPONENTS/CHARTS/BASICGAUGE.JS

import { Box, Typography, Stack } from "@mui/material";
import { Gauge } from "@mui/x-charts/Gauge";

export default function BasicGauges({ gaugeData }) {
  return (
    <Stack direction={{ xs: "column", md: "row" }} spacing={{ xs: 1, md: 3 }}>
      {gaugeData.map((dataPoint, i) => (
        // Use a Box to group the chart and the label vertically
        <Box key={i} sx={{ textAlign: "center", minWidth: 100 }}>
          <Gauge
            width={100}
            height={100}
            value={dataPoint.value}
            valueMin={dataPoint.valueMin}
            valueMax={dataPoint.valueMax}
          />

          {/* Add the label below the gauge using Typography */}
          <Typography variant="body2" sx={{ mt: 0.5 }}>
            **{dataPoint.label}**
          </Typography>
          <Typography variant="caption" color="text.secondary">
            ({dataPoint.value} / {dataPoint.valueMax})
          </Typography>
        </Box>
      ))}
    </Stack>
  );
}
