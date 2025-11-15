import { Box, Slider } from "@mui/material";
import Image from "next/image";
import React, { useState } from "react";
import PDFEditor from "./PDFEditor";

export default function PDFImage({ pageIndex, element, scale, style }) {
  const [customZIndex, setCustomZIndex] = useState(0);
  const full_pos = element.position; // The full, un-cropped size
  const visible_pos = element.crop;
  // --- FINAL CROPPING LOGIC ---
  // 1. The outer container is positioned and sized to the VISIBLE area.
  //    overflow: hidden will perform the crop.
  let container_style = {
    position: "absolute",
    left: `${visible_pos.x0 * scale}px`,
    top: `${visible_pos.y0 * scale}px`,
    width: `${(visible_pos.x1 - visible_pos.x0) * scale}px`,
    height: `${(visible_pos.y1 - visible_pos.y0) * scale}px`,
    zIndex: element.zIndex * customZIndex || "auto",
    // zIndex: element.zIndex,
    overflow: "hidden",
  };

  // 2. The inner Box is sized to the FULL, un-cropped dimensions
  //    and then shifted so the correct part is visible.
  let image_wrapper_style = {
    position: "absolute",
    width: `${(full_pos.x1 - full_pos.x0) * scale}px`,
    height: `${(full_pos.y1 - full_pos.y0) * scale}px`,
    left: `${(full_pos.x0 - visible_pos.x0) * scale}px`,
    top: `${(full_pos.y0 - visible_pos.y0) * scale}px`,
  };

  const transforms = [];
  // Check if rotation is a number (this will include 0)
  if (typeof element.rotation === "number") {
    // Apply your test rotation
    transforms.push(`rotate(${element.rotation}deg)`);
  }
  if (element.isFlippedHorizontal) {
    transforms.push("scaleX(-1)");
  }
  if (element.isFlippedVertical) {
    transforms.push("scaleY(-1)");
  }

  if (transforms.length > 0) {
    image_wrapper_style.transform = transforms.join(" ");
    image_wrapper_style.transformOrigin = "center center";
  }

  return (
    <Box sx={container_style} className="pdf-page__image">
      {/* <PDFEditor
        customZIndex={customZIndex}
        setCustomZIndex={setCustomZIndex}
      /> */}

      <Box sx={image_wrapper_style}>
        <Image
          src={element.src}
          alt={`Image on page ${pageIndex + 1}`}
          fill
          unoptimized
          style={{ objectFit: "cover" }}
        />
      </Box>
    </Box>
  );
}
