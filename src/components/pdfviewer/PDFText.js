import { Box } from "@mui/material";
import React, { useState } from "react";
import PDFEditor from "./PDFEditor";

export default function PDFText({ element, style, styleMap, scale }) {
  const textBaseStyle = styleMap[element.styleId] || {};

  const finalTextStyle = {
    ...style,
    fontFamily: textBaseStyle.fontFamily,
    color: textBaseStyle.color,
    fontSize: `${textBaseStyle.fontSize * scale}px`, // Scale the font size
    whiteSpace: "pre",
    // textAlign: element.textAlign || "justify",
    textAlign: "justify",
    backgroundColor: "transparent",
    zIndex: element.isParagraph ? 100 : element.zIndex,
    // backgroundColor: "pink",
  };

  return (
    <>
      <Box sx={finalTextStyle} className="pdf-page__text">
        {element.content}
      </Box>
    </>
  );
}
