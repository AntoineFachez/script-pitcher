// file path: ~/DEVFOLD/SCRIPT-PITCHER/SRC/COMPONENTS/APPHEADER/APPHEADER.JS

import React from "react";
import { Typography } from "@mui/material";

export default function AppHeader({ title }) {
  return <Typography {...pageTitleProps}>{title}</Typography>;
}
const pageTitleProps = {
  component: "",
  variant: "h2",
  sx: (theme) => ({
    width: "100%",
    height: "100%",
    display: "flex",
    // flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",

    // display: {
    //   xs: "none", // Element is completely hidden (no space) on small screens
    //   md: "block", // Element is visible and takes up space from 'md' up
    // },
    // borderRadius: "1rem",
    // m: 1,
    // padding: "0 4rem",
    // textAlign: "center",
    // verticalAlign: "middle",
    color: "text.primary",
    backgroundColor: "inherit",
    p: 0,
    m: 0,
    ...theme.typography.h2,
  }),
};
