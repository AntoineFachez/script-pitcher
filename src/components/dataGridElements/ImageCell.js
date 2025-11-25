import { ImageListItem } from "@mui/material";
import Image from "next/image";
import React from "react";

export default function ImageCell({ url, dataGridImageCellStyles }) {
  return (
    <>
      {" "}
      {url && (
        <Image
          fill={true}
          // width={500}
          // height={500}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          src={url}
          alt={url}
          style={{ ...dataGridImageCellStyles.sx, width: null }}
          // 3. Add responsive styles
          objectPosition="center"
        />
      )}
    </>
  );
}
