// file path: ~/DEVFOLD/SCRIPT-PITCHER/SRC/COMPONENTS/PDFVIEWER/PDFPAGE.JS

import React from "react";
import { Box } from "@mui/material";
import Image from "next/image";
import { motion } from "framer-motion"; // <--- IMPORT THIS

import PDFImage from "./PDFImage";
import PDFText from "./PDFText";
import PDFEditor from "./PDFEditor";

const fadeInUp = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

export default function PDFPage({ element, scale, styleMap, pageIndex }) {
  const pos = element.position;

  const AnimationWrapper = ({ children, style }) => (
    <Box
      component={motion.div} // <--- Magic happens here
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }} // Triggers 50px before element hits bottom
      variants={fadeInUp}
      sx={style}
    >
      {children}
    </Box>
  );

  // Use a switch to handle different element types
  switch (element.type) {
    case "text": {
      const style = styleMap[element.styleId] || {};

      const elementStyles = {
        position: "absolute",
        left: `${pos.x0 * scale}px`,
        top: `${pos.y0 * scale}px`,
        // Use width/height for layout, but let font scaling handle the text size
        width: `${(pos.x1 - pos.x0) * scale}px`,
        height: `${(pos.y1 - pos.y0) * scale}px`,
        zIndex: element.zIndex,

        // Text-specific styles
        // fontFamily: style.fontFamily,
        // fontSize: `${style.fontSize * scale}px`,
        // color: style.color,
        // textAlign: element.textAlign,
        // // textAlign: "justify",
        // whiteSpace: "pre-wrap", // Respect whitespace from PDF
        lineHeight: 1.1, // A sensible default
      };
      // console.log(element.isParagraph ? "paragraph" : "no paragraph");
      return (
        <>
          <PDFText
            element={element}
            style={elementStyles}
            styleMap={styleMap}
            scale={scale}
          />
        </>
      );
    }
    // --- NEW: Handle the grouped paragraph ---
    case "paragraph": {
      const paraPos = element.position;

      // 1. Create the outer paragraph container
      // This is absolutely positioned on the page
      const paraContainerStyles = {
        position: "absolute",
        left: `${paraPos.x0 * scale}px`,
        top: `${paraPos.y0 * scale}px`,
        width: `${(paraPos.x1 - paraPos.x0) * scale}px`,
        // width: "100%",
        height: `${(paraPos.y1 - paraPos.y0) * scale}px`,
        zIndex: element.zIndex,
        backgroundColor: "transparent",
      };

      return (
        <AnimationWrapper style={paraContainerStyles}>
          {/* 2. Map over the child spans inside the paragraph */}
          {element.elements.map((span) => {
            const spanPos = span.position;

            // 3. Calculate the span's position *relative* to the paragraph container
            const spanRelativeStyles = {
              position: "absolute",
              left: `${(spanPos.x0 - paraPos.x0) * scale}px`, // <-- Relative Left
              top: `${(spanPos.y0 - paraPos.y0) * scale}px`, // <-- Relative Top
              height: `${(spanPos.y1 - spanPos.y0) * scale}px`,
              width: "100%",
              zIndex: span.zIndex, // zIndex should be relative to container, but this is fine
            };

            return (
              <>
                <PDFText
                  key={span.uniqueId}
                  element={span}
                  style={spanRelativeStyles}
                  styleMap={styleMap}
                  scale={scale}
                />
              </>
            );
          })}
        </AnimationWrapper>
      );
    }

    case "line": {
      const elementStyles = {
        position: "absolute",
        left: `${pos.x0 * scale}px`,
        top: `${pos.y0 * scale}px`,
        width: `${(pos.x1 - pos.x0) * scale}px`,
        height: `${(pos.y1 - pos.y0) * scale}px`,
        zIndex: element.zIndex,
        backgroundColor: element.strokeColor, // Python script puts line color here
      };
      return <Box sx={elementStyles} />;
    }

    case "shape": {
      const elementStyles = {
        position: "absolute",
        left: `${pos.x0 * scale}px`,
        top: `${pos.y0 * scale}px`,
        width: `${(pos.x1 - pos.x0) * scale}px`,
        height: `${(pos.y1 - pos.y0) * scale}px`,
        zIndex: element.zIndex,
        backgroundColor: element.backgroundColor,
        opacity: element.opacity,
      };
      return <Box sx={elementStyles} />;
    }

    case "image": {
      // The visible "window" on the page
      const cropPos = element.crop;
      // The full, un-cropped image's original dimensions/position
      const fullPos = element.position;

      // Outer wrapper: This is the "window".
      // It's positioned and sized according to the crop.
      // It clips everything outside of it.
      const windowStyles = {
        position: "absolute",
        left: `${cropPos.x0 * scale}px`,
        top: `${cropPos.y0 * scale}px`,
        width: `${(cropPos.x1 - cropPos.x0) * scale}px`,
        height: `${(cropPos.y1 - cropPos.y0) * scale}px`,
        zIndex: element.zIndex,
        overflow: "hidden",

        // Handle rotation and flipping
        transformOrigin: "center center",
        transform: [
          // element.rotation ? `rotate(${element.rotation}deg)` : null,
          element.isFlippedVertical ? "scaleX(-1)" : null, // Flips across Y-axis
          element.isFlippedHorizontal ? "scaleY(-1)" : null, // Flips across X-axis
        ]
          .filter(Boolean)
          .join(" "),
      };

      // Inner Image: This is the full image.
      // We scale it to its full size and then "pan" it
      // so the correct part is visible inside the "window".
      const imagePanX = (fullPos.x0 - cropPos.x0) * scale;
      const imagePanY = (fullPos.y0 - cropPos.y0) * scale;

      const imageStyles = {
        position: "absolute",
        left: `${imagePanX}px`,
        top: `${imagePanY}px`,
        width: `${(fullPos.x1 - fullPos.x0) * scale}px`,
        height: `${(fullPos.y1 - fullPos.y0) * scale}px`,
      };

      return (
        <>
          {/* <Box sx={windowStyles}> */}
          <PDFImage
            pageIndex={pageIndex}
            element={element}
            scale={scale}
            style={imageStyles}
          />
          {/* </Box> */}
        </>
      );
    }

    default:
      // Render nothing for unknown element types
      return null;
  }
}
