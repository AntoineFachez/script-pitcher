// File: src/components/dataGridElements/ExpirationTimeCell.js

import React from "react";
import { Typography } from "@mui/material";
import { useRelativeTime } from "@/hooks/useRelativeTime";

/**
 * Utility function to convert Firebase Timestamp to JS Date or string.
 * @param {object | string} timestampOrDate The value from Firestore.
 * @returns {Date | null} A JavaScript Date object or null.
 */
const convertTimestampToDate = (timestampOrDate) => {
  if (!timestampOrDate) return null;

  // Check if it's a Firestore Timestamp object (has a toDate method)
  if (typeof timestampOrDate.toDate === "function") {
    return timestampOrDate.toDate();
  }

  // Check if it's already a standard date string or ISO string
  if (
    typeof timestampOrDate === "string" ||
    typeof timestampOrDate === "number"
  ) {
    return new Date(timestampOrDate);
  }

  // Handle serialized Firestore Timestamps (which appear as objects with _seconds)
  if (timestampOrDate._seconds) {
    // Create a Date object from milliseconds
    return new Date(
      timestampOrDate._seconds * 1000 + timestampOrDate._nanoseconds / 1000000
    );
  }

  return null;
};

const ExpirationTimeCell = ({ value }) => {
  // ⭐ CRITICAL CHANGE: Convert the Firebase Timestamp here
  const dateValue = convertTimestampToDate(value);

  const relativeTime = useRelativeTime(dateValue);

  // You can add conditional styling here based on urgency (e.g., expired)
  const isExpired = dateValue && dateValue < new Date();

  if (isExpired) {
    return (
      <Typography
        variant="body2"
        color="error.main"
        sx={{ fontVariantNumeric: "tabular-nums" }}
      >
        Expired
      </Typography>
    );
  }

  return (
    <Typography
      variant="body2"
      sx={{
        fontVariantNumeric: "tabular-nums",
        fontWeight: 600,
      }}
    >
      {relativeTime}
    </Typography>
  );
};

export default ExpirationTimeCell;
