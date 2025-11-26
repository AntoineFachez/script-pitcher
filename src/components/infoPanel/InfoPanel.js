import { Check } from "@mui/icons-material";
import { Alert, AlertTitle, Typography } from "@mui/material";
import React from "react";

export default function InfoPanel({ severity, message }) {
  return (
    <>
      <Alert
        sx={{ width: "fit-conent" }}
        severity={severity}
        icon={severity === "success" ? <Check fontSize="inherit" /> : null}
      >
        <AlertTitle>Info</AlertTitle>
        {message}
      </Alert>
    </>
  );
}
