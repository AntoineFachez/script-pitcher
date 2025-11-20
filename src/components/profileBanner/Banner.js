import { Box } from "@mui/material";
import React from "react";

export default function Banner({ imageUrl }) {
  return (
    <Box
      sx={{
        // 1. Set the fixed dimensions of the banner
        width: "100%",
        height: 200, // Adjust the height as needed (e.g., 200px)

        // 2. Add the background image
        backgroundImage: `url(${imageUrl})`,

        // 3. Control how the image fills the space
        backgroundSize: "cover", // Scales the image to cover the box
        backgroundPosition: "center", // Centers the image in the box
        backgroundRepeat: "no-repeat", // Prevents tiling

        // Optional: Add a rounded top edge for a modern look
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
      }}
    />
  );
}
