// file path: ~/DEVFOLD/SCRIPT-PITCHER/SRC/COMPONENTS/PDFVIEWER/PDFIMAGE.JS

import React, { useRef, useState } from "react";
import { Box, Slider } from "@mui/material";
import Image from "next/image";
import { motion } from "framer-motion"; // <--- Import
import PDFEditor from "./PDFEditor";

export default function PDFImage({ pageIndex, element, scale, style }) {
  const [customZIndex, setCustomZIndex] = useState(0);
  const ref = useRef(null);

  const full_pos = element.position; // The full, un-cropped size (AABB)
  const visible_pos = element.crop || element.position;

  if (!visible_pos || !full_pos) return null;

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
    // border: "1px solid red", // DEBUG: Show crop container
  };

  // 2. The inner Box is sized to the UNROTATED dimensions
  //    and then shifted so the correct part is visible.
  let image_wrapper_style = {};

  if (element.layout) {
    // New precise logic using unrotated dimensions and center point
    const { width, height, centerX, centerY } = element.layout;
    image_wrapper_style = {
      position: "absolute",
      width: `${width * scale}px`,
      height: `${height * scale}px`,
      // Calculate top/left relative to the crop container
      // left = (center_x - width/2) - crop_x0
      left: `${(centerX - width / 2 - visible_pos.x0) * scale}px`,
      top: `${(centerY - height / 2 - visible_pos.y0) * scale}px`,
    };
  } else {
    // Fallback for old data (using AABB)
    image_wrapper_style = {
      position: "absolute",
      width: `${(full_pos?.x1 - full_pos?.x0) * scale}px`,
      height: `${(full_pos?.y1 - full_pos?.y0) * scale}px`,
      left: `${(full_pos?.x0 - visible_pos?.x0) * scale}px`,
      top: `${(full_pos?.y0 - visible_pos?.y0) * scale}px`,
    };
  }

  const transforms = [];
  // Check if rotation is a number (this will include 0)
  if (typeof element.rotation === "number") {
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
    <Box ref={ref} sx={container_style} className="pdf-page__image">
      {/* <PDFEditor
        customZIndex={customZIndex}
        setCustomZIndex={setCustomZIndex}
      /> */}

      {/* <Box
        sx={image_wrapper_style}
        component={motion.div}
        style={{ ...image_wrapper_style }} // Apply Framer Motion 'y' here
      >
        <Image
          src={element.src}
          alt={`Image on page ${pageIndex + 1}`}
          fill
          unoptimized
          style={{ objectFit: "cover" }}
        />
      </Box> */}
      <Box
        sx={{ ...image_wrapper_style }}
        // sx={{
        //   // position: "absolute",
        //   left: `${element.position.x0}px`,
        //   top: `${element.position.y0}px`,
        //   width: `${element.position.width}px`,
        //   height: `${element.position.height}px`,
        //   overflow: "hidden",
        //   zIndex: element.zIndex,
        // }}
      >
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
