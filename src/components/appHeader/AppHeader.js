// file path: ~/DEVFOLD/SCRIPT-PITCHER/SRC/COMPONENTS/APPHEADER/APPHEADER.JS

import React from "react";
import { Typography } from "@mui/material";

export default function AppHeader({ title }) {
  return <Typography {...pageTitleProps}>{title}</Typography>;
}
const pageTitleProps = {
  component: "",
  variant: "h2",
  sx: {
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    fontSize: {
      xs: "1.4rem", // Element is completely hidden (no space) on small screens
      sm: "1.8rem", // Element is visible and takes up space from 'md' up
      md: "1.8rem", // Element is visible and takes up space from 'md' up
      lg: "2rem", // Element is visible and takes up space from 'md' up
      xl: "2.2rem", // Element is visible and takes up space from 'md' up
    },
    // display: {
    //   xs: "none", // Element is completely hidden (no space) on small screens
    //   md: "block", // Element is visible and takes up space from 'md' up
    // },
    // borderRadius: "1rem",
    // m: 1,
    // padding: "0 4rem",
    // textAlign: "center",
    // verticalAlign: "middle",
    backgroundColor: "page.title",
  },
};
