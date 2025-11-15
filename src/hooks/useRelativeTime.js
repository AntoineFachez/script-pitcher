import { useState, useEffect } from "react";
import { formatDistanceStrict } from "date-fns";

/**
 * Formats a date to a short, human-readable string (e.g., "3h", "2m").
 * @param {string | Date | number} date The date to format.
 * @returns {string} The formatted string.
 */
export const formatShortTime = (date) => {
  if (!date) return "";

  const result = formatDistanceStrict(new Date(date), new Date(), {
    addSuffix: false,
  });

  const [value, unit] = result.split(" ");

  switch (unit) {
    case "year":
    case "years":
      return `${value}y`;
    case "month":
    case "months":
      return `${value}mo`;
    case "week":
    case "weeks":
      return `${value}w`;
    case "day":
    case "days":
      return `${value}d`;
    case "hour":
    case "hours":
      return `${value}h`;
    case "minute":
    case "minutes":
      return `${value}m`;
    case "second":
    case "seconds":
      return `${value}s`;
    default:
      return result;
  }
};

/**
 * A custom hook that returns a dynamically updated relative time string.
 * @param {string | Date | number} date The date to format.
 * @param {number} [intervalInMs=60000] The interval to update the time in milliseconds. Defaults to 1 minute.
 * @returns {string} The formatted relative time string.
 */
export const useRelativeTime = (date, intervalInMs = 60000) => {
  const [formattedTime, setFormattedTime] = useState(() =>
    formatShortTime(date)
  );

  useEffect(() => {
    // Only start the interval if a valid date is provided
    if (!date) return;

    const interval = setInterval(() => {
      setFormattedTime(formatShortTime(date));
    }, intervalInMs);

    // Cleanup function to clear the interval when the component unmounts
    return () => clearInterval(interval);
  }, [date, intervalInMs]);

  return formattedTime;
};
