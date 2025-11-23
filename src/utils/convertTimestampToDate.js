// file path: ~/DEVFOLD/SCRIPT-PITCHER/SRC/UTILS/CONVERTTIMESTAMPTODATE.JS

/**
 * Utility function to convert Firebase Timestamp to JS Date or string.
 * @param {object | string} timestampOrDate The value from Firestore.
 * @returns {Date | null} A JavaScript Date object or null.
 */
export const convertTimestampToDate = (timestampOrDate) => {
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
