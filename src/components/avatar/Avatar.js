import React from "react";
import { Avatar } from "@mui/material";

export default function BasicAvatar({ url, styles }) {
  return (
    <>
      <Avatar src={url} sx={styles?.sx} />
    </>
  );
}
