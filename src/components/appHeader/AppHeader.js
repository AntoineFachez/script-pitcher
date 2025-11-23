// file path: ~/DEVFOLD/SCRIPT-PITCHER/SRC/COMPONENTS/APPHEADER/APPHEADER.JS

import React from "react";
import { Typography } from "@mui/material";

import { pageTitleStyles } from "@/theme/muiProps";

export default function AppHeader({ title }) {
  return (
    <Typography variant={pageTitleStyles.variant} sx={pageTitleStyles.sx}>
      {title}
    </Typography>
  );
}
