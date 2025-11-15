"use client";

import { Box, Button, Typography } from "@mui/material";
import { useEffect } from "react";

export default function Error({ error, reset }) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <Box
      sx={{
        fontFamily:
          'system-ui, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji"',
        height: "100%",
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <style jsx global>{`
        body {
          margin: 0;
        }
      `}</style>
      <Box sx={{ lineHeight: "48px" }}>
        <Typography
          variant="h2"
          sx={{
            display: "inline-block",
            borderRight: "1px solid rgba(0, 0, 0, .3)",
            margin: 0,
            marginRight: "20px",
            padding: "10px 23px 10px 0",
            fontSize: "24px",
            fontWeight: "500",
            verticalAlign: "top",
          }}
        >
          Error
        </Typography>
        <Box
          sx={{
            display: "inline-block",
            textAlign: "left",
            lineHeight: "49px",
            height: "49px",
            verticalAlign: "middle",
          }}
        >
          <Typography
            variant="h3"
            sx={{
              fontSize: "14px",
              fontWeight: "normal",
              lineHeight: "inherit",
              margin: 0,
              padding: 0,
            }}
          >
            Something went wrong.
          </Typography>
        </Box>
      </Box>
      <Typography sx={{ color: "#666", marginTop: "20px" }} variant="body1">
        We`ve logged the issue and will look into it.
      </Typography>
      <Button
        onClick={
          // Attempt to recover by trying to re-render the segment
          () => reset()
        }
        sx={{
          marginTop: "20px",
          padding: "10px 20px",
          fontSize: "14px",
          fontWeight: "600",
          border: "1px solid #ccc",
          borderRadius: "6px",
          cursor: "pointer",
          backgroundColor: "#fff",
          transition: "background-color 0.2s",
        }}
        onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#f0f0f0")}
        onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#fff")}
      >
        Try Again
      </Button>
    </Box>
  );
}
