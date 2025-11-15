import { Slider } from "@mui/material";
import React, { useState } from "react";

export default function PDFEditor({ customZIndex, setCustomZIndex }) {
  const handleChange = (event, newValue) => {
    setCustomZIndex(newValue);
  };
  return (
    <Slider
      orientation="vertical"
      sx={{
        position: "absolute",
        zIndex: 1000,
        top: 0,
        left: 0,
        height: "50%",
      }}
      value={customZIndex}
      onChange={handleChange}
    />
  );
}
