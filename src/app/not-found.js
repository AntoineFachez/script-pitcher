// file path: ~/DEVFOLD/SCRIPT-PITCHER/SRC/APP/NOT-FOUND.JS

"use client";

import { Box, Typography } from "@mui/material";
import Link from "next/link";
import { containerProps, titleProps } from "@/theme/muiProps";

export default function NotFound() {
  return (
    <Box {...containerProps}>
      <Typography {...titleProps}>404</Typography>
      <Typography {...titleProps}>This page could not be found.</Typography>

      <Link
        href="/"
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          fontSize: "14px",
          fontWeight: "600",
          border: "1px solid transparent",
          borderRadius: "6px",
          cursor: "pointer",
          color: "#0070f3",
          textDecoration: "none",
          transition: "background-color 0.2s",
        }}
      >
        Go back home
      </Link>
    </Box>
  );
}
