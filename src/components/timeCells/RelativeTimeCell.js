// file path: ~/DEVFOLD/SCRIPT-PITCHER/SRC/COMPONENTS/TIMECELLS/PROCESSINGTIMECELL.JS

import React from "react";
import { Typography } from "@mui/material";
import { useRelativeTime } from "@/hooks/useRelativeTime"; // Assuming your path to useRelativeTime.js
import { convertTimestampToDate } from "@/utils/convertTimestampToDate";

/**
 * DataGrid cell that displays the relative time remaining until a future date (Ready Date).
 * If the future date has passed, it displays "Ready" or "Processed".
 * @param {object} props - The DataGrid cell props.
 * @param {any} props.value - The future date/timestamp (e.g., 'processedAt').
 */
const RelativeTimeCell = ({ value }) => {
  // 1. Convert the Firestore timestamp to a usable JS Date object
  const readyDate = convertTimestampToDate(value);

  // 2. Calculate the relative time remaining
  const relativeTime = useRelativeTime(readyDate);

  return relativeTime;
};

export default RelativeTimeCell;
