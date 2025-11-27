import Image from "next/image";
import React from "react";

export default function ImageCell({ url, sx }) {
  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {url && (
        <Image
          fill={true}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          src={url}
          alt={url}
          style={{
            ...sx,
          }}
        />
      )}
    </div>
  );
}
