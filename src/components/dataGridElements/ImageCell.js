import { ImageListItem } from "@mui/material";
import Image from "next/image";
import React from "react";

export default function ImageCell({ avatarUrl, dataGridImageCellStyles }) {
  return (
    <ImageListItem
      key={avatarUrl}
      sx={{
        display: "block",
        // position: 'relative' is not needed here
      }}
    >
      {" "}
      {avatarUrl && (
        <Image
          width={500}
          height={500}
          src={avatarUrl}
          alt={avatarUrl}
          // 3. Add responsive styles
          style={{
            width: "100%", // This makes it fit the column
            height: dataGridImageCellStyles.sx.height, // This makes it scale with the correct aspect ratio
            objectFit: dataGridImageCellStyles.sx.objectFit,
          }}
        />
      )}
    </ImageListItem>
  );
}
