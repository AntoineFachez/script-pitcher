// file path: ~/DEVFOLD/SCRIPT-PITCHER/SRC/APP/NOT-FOUND.JS

"use client";

import { Box, Typography } from "@mui/material";
import Link from "next/link";


export default function NotFound() {
  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Typography
        variant="h1"
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          fontWeight: 300,
          fontSize: {
            xs: "1.2rem",
            sm: "1.2rem",
            md: "1.5rem",
            lg: "2rem",
            xl: "2rem",
          },
        }}
      >
        404
      </Typography>
      <Typography
        variant="h1"
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          fontWeight: 300,
          fontSize: {
            xs: "1.2rem",
            sm: "1.2rem",
            md: "1.5rem",
            lg: "2rem",
            xl: "2rem",
          },
        }}
      >
        This page could not be found.
      </Typography>

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
