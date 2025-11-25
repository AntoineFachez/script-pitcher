import React from "react";
import { Avatar, Box } from "@mui/material";
import { styled } from "@mui/material/styles";
import { stringAvatar } from "@/utils/colorHelpers";

export default function BasicAvatar({ url, itemName = "" }) {
  // We combine the passed-in sx with the dynamic styles from AvatarBase
  return (
    <>
      <Avatar
        src={url}
        sx={{ width: "100%", height: "100%", p: 0, m: 0 }}
        alt={stringAvatar(itemName).children}
      />
    </>
  );
}
