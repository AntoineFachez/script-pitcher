import { Avatar } from "@mui/material";
import React from "react";

export default function BasicAvatar({ url, styles }) {
  return (
    <>
      <Avatar
        src={url}
        sx={{
          position: "absolute",
          left: styles.leftMargin,
          width: 72,
          height: 72,
          alignSelf: "center",
        }}
      />
    </>
  );
}
