// file path: ~/DEVFOLD/SCRIPT-PITCHER/SRC/COMPONENTS/DATAGRIDELEMENTS/RELATIVETIMECELL.JS

import { useRelativeTime } from "@/hooks/useRelativeTime";
import React from "react";
const RelativeTimeCell = ({ firestoreTimestamp }) => {
  const jsDate = firestoreTimestamp?.toDate();

  const relativeTime = useRelativeTime(jsDate);

  return <span>{relativeTime}</span>;
};

export default RelativeTimeCell;
