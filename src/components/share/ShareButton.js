// components/ShareButton.js
"use client"; // This is a Client Component

import { IconButton } from "@mui/material";
import React from "react";

const ShareButton = ({ recipient = "", subject = "", body = "", children }) => {
  const handleShare = () => {
    // 1. Sanitize and encode the data for the URL
    const encodedSubject = encodeURIComponent(subject);
    const encodedBody = encodeURIComponent(body);

    // 2. Construct the mailto link
    // Note: \n is encoded as %0A for line breaks in the body
    const mailtoLink = `mailto:${recipient}?subject=${encodedSubject}&body=${encodedBody}`;

    // 3. Trigger the mail client
    window.location.href = mailtoLink;
  };

  return (
    <IconButton onClick={handleShare}>
      {children || "Share via Email"}
    </IconButton>
  );
};

export default ShareButton;
