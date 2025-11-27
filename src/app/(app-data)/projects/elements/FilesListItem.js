// file path: ~/DEVFOLD/SCRIPT-PITCHER/SRC/APP/PROJECTS/ELEMENTS/FILESLISTITEM.JS

"use client";

import React from "react";
import { Box, Button, ListItem, Typography } from "@mui/material";
import Image from "next/image";

import { useRelativeTime } from "@/hooks/useRelativeTime";


export default function FilesListItem({ i, file }) {
  const customSubTitleItem = useRelativeTime(file?.createdAt);

  return (
    <ListItem
      key={i}
      className="filesListItem"
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexGrow: 1,
        flexShrink: 3,
        flexFlow: "row wrap",
        justifyContent: "space-around",
        alignItems: "center",
        gap: 1,
        overflowY: "scroll",
      }}
    >
      <Box
        component="header"
        sx={{
          width: "100%",
          display: "flex",
          flexFlow: "row nowrap",
          justifyContent: "space-between",
        }}
      >
        <Typography
          sx={{
            display: "flex",
            flexFlow: "column nowrap",
            fontSize: "0.7rem",
          }}
        >
          {customSubTitleItem}ago
        </Typography>
        <Typography
          sx={{
            display: "flex",
            flexFlow: "column nowrap",
            fontSize: "0.7rem",
          }}
        >
          version: {file?.version}
        </Typography>
      </Box>{" "}
      <Box
        sx={{
          width: "30ch",
          height: "15ch",
          display: "flex",
          position: "relative",
        }}
      >
        {file.imageUrl && (
          <Image
            fill
            src={file.imageUrl}
            alt={file.title}
            style={{ objectFit: "cover", objectPosition: "top" }}
          />
        )}
      </Box>
      <Button onClick={() => console.log("clicked")}>
        {file?.filePurpose}
      </Button>
    </ListItem>
  );
}
