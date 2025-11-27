import React from "react";
import { IconButton } from "@mui/material";
import { Favorite, Share } from "@mui/icons-material";
import ShareButton from "@/components/share/ShareButton";

const StandardCardFooter = ({
  onToggle,
  toggleIcon,
  toggleColor,
  emailSubject,
  emailBody,
  recipient = "friend@example.com",
  showToggle = true,
}) => {
  return (
    <>
      <IconButton aria-label="add to favorites">
        <Favorite />
      </IconButton>
      <ShareButton
        recipient={recipient}
        subject={emailSubject}
        body={emailBody}
      >
        <Share />
      </ShareButton>
      {showToggle && onToggle && (
        <IconButton
          aria-label="toggle status"
          onClick={onToggle}
          sx={{ color: toggleColor }}
        >
          {toggleIcon}
        </IconButton>
      )}
    </>
  );
};

export default StandardCardFooter;
