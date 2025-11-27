import React from "react";
import { Share } from "@mui/icons-material";

import ShareButton from "@/components/share/ShareButton";
import { ActionIcon } from "@/components/buttons/ActionIcon";

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
      <ActionIcon iconName={"Favorite"} />
      <ShareButton
        recipient={recipient}
        subject={emailSubject}
        body={emailBody}
      >
        <Share />
      </ShareButton>
      {showToggle && onToggle && (
        <ActionIcon
          iconName={toggleIcon}
          onClick={onToggle}
          sx={{ color: toggleColor }}
        />
      )}
    </>
  );
};

export default StandardCardFooter;
