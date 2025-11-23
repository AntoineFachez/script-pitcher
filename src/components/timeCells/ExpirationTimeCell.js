// file path: ~/DEVFOLD/SCRIPT-PITCHER/SRC/COMPONENTS/TIMECELLS/EXPIRATIONTIMECELL.JS

import { useRelativeTime } from "@/hooks/useRelativeTime";
import { convertTimestampToDate } from "@/utils/convertTimestampToDate";

const ExpirationTimeCell = ({ value }) => {
  // ⭐ CRITICAL CHANGE: Convert the Firebase Timestamp here
  const dateValue = convertTimestampToDate(value);

  const relativeTime = useRelativeTime(dateValue);

  // You can add conditional styling here based on urgency (e.g., expired)
  const isExpired = dateValue && dateValue < new Date();

  if (isExpired) {
    return "Expired";
  }

  return relativeTime;
};

export default ExpirationTimeCell;
