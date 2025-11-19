// File: src/components/dataGridElements/ProcessingTimeCell.js
import React from "react";
import { Typography } from "@mui/material";
import { useRelativeTime } from "@/hooks/useRelativeTime"; // Assuming your path to useRelativeTime.js

/**
 * Utility function to safely convert Firebase Timestamp (or serialized version) to JS Date.
 * @param {object | string} timestampOrDate The value from Firestore (e.g., expected processedAt date).
 * @returns {Date | null} A JavaScript Date object or null.
 */
const convertTimestampToDate = (timestampOrDate) => {
  if (!timestampOrDate) return null;

  // Check if it's a Firestore Timestamp object (Client SDK)
  if (typeof timestampOrDate.toDate === "function") {
    return timestampOrDate.toDate();
  }

  // Check if it's already a standard date string, ISO string, or number
  if (
    typeof timestampOrDate === "string" ||
    typeof timestampOrDate === "number"
  ) {
    return new Date(timestampOrDate);
  }

  // Handle serialized Firestore Timestamps (Server Component output: { _seconds, _nanoseconds })
  if (timestampOrDate._seconds) {
    return new Date(
      timestampOrDate._seconds * 1000 + timestampOrDate._nanoseconds / 1000000
    );
  }

  return null;
};

/**
 * DataGrid cell that displays the relative time remaining until a future date (Ready Date).
 * If the future date has passed, it displays "Ready" or "Processed".
 * @param {object} props - The DataGrid cell props.
 * @param {any} props.value - The future date/timestamp (e.g., 'processedAt').
 */
const ProcessingTimeCell = ({ value }) => {
  // 1. Convert the Firestore timestamp to a usable JS Date object
  const readyDate = convertTimestampToDate(value);

  // 2. Calculate the relative time remaining
  const relativeTime = useRelativeTime(readyDate);

  // 3. Determine if the ready date has passed
  const isReady = readyDate && readyDate < new Date();

  // If the target time has passed, the item is "Ready"
  if (isReady) {
    return (
      <Typography variant="body1" color="success.main">
        Ready
      </Typography>
    );
  }

  // If the item is not ready, display the time remaining
  // Note: relativeTime (from useRelativeTime) measures distance *from* targetDate *to* now.
  // We want to emphasize "remaining". A common pattern is to just show the short duration.
  return relativeTime;
};

export default ProcessingTimeCell;
