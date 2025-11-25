import React from "react";
import { Avatar, Box } from "@mui/material";
import { styled } from "@mui/material/styles";
import { stringAvatar } from "@/utils/colorHelpers";

export default function BasicAvatar({
  className,
  url,
  itemName = "",
  sx = { width: "100%", height: "100%", p: 0, m: 0 },
}) {
  // We combine the passed-in sx with the dynamic styles from AvatarBase
  return (
    <>
      <Avatar
        className={className}
        src={url}
        sx={sx}
        alt={stringAvatar(itemName).children}
      />
    </>
  );
}
