// file path: ~/DEVFOLD/SCRIPT-PITCHER/SRC/THEME/THEME.JS

"use client";

import { createTheme } from "@mui/material/styles";
import { sharedComponents } from "./muiProps";

// --- Dark Theme ---
export const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#5c6b73",
      dark: "#0e1929",
      light: "#9ccae9ff",
    }, //["0e1929","c2dfe3","9db4c0","5c6b73","253237"]
    secondary: { main: "#ffd400", dark: "#8F7700", light: "#d2ddab" }, //["ffd400","d2ddab","c2dfe3","95aeb5","0e1929"]
    action: { main: "#63e7ebdd", dark: "#0b886fff", light: "#d2ddab" }, //["ffd400","d2ddab","c2dfe3","95aeb5","0e1929"]
    success: { main: "#06ac59ff", dark: "#0b886fff", light: "#d2ddab" }, //["ffd400","d2ddab","c2dfe3","95aeb5","0e1929"]
    warning: { main: "#e1931dff", dark: "#e1931dff", light: "#e1931dff" }, //["ffd400","d2ddab","c2dfe3","95aeb5","0e1929"]
    button: {
      inactive: "#6d7075ff",
      active: "hotpink",
      activeBackground: "#dbdde2ff",
      // background: "#4a4c4a0d",
      background: "transparent",
      hover: "#91949152",
    },
    input: "#00000080",
    randomeRainbow:
      "#ff0000 0%, #ff9a00 10%, #d0de21 20%, #4fdc4a 30%, #3fdad8 40%, #2fc9e2 50%, #1c7fee 60%, #5f15f2 70%, #ba0cf8 80%, #fb07d9 90%, #ff0000 100%",
    background: {
      primary: "#181c22ff",
      contrast: "#b4c8e56e",
      nav: "#131417ff",
      paper: "#1f2329db",
      background: "#2424257e",
      gridItem: "#353536ad",
      alpha: "#0e1929cc",
      shadow: "#00000033",
    },
    visited: {
      item: "#25282ccc",
      link: "",
    },
    text: {
      primary: "#e5e7eb", // Light text
      secondary: "#9ca3af", // Muted text
      contrast: "#000",
    },
  },
  border: {
    borderRadius: "5px",
    borderWidth: "5px",
    borderColor: "#fff",
  },

  border: "5px solid #fff",
  typography: {
    fontFamily: "sans-serif",
    h4: {
      fontSize: "1.5rem",
      fontWeight: 700,
    },
    h5: {
      fontSize: "1.25rem",
      fontWeight: 600,
    },
  },
  components: {
    ...sharedComponents,
  },
  transitions: { duration: { shortest: 200 } },
});

// --- Bright Theme ---
export const brightTheme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#0d9488" },
    action: { main: "#63e7ebdd", dark: "#0b886fff", light: "#d2ddab" },
    input: "#ffffffff",
    success: { main: "#06ac59ff", dark: "#0b886fff", light: "#d2ddab" }, //["ffd400","d2ddab","c2dfe3","95aeb5","0e1929"]
    button: {
      inactive: "#a4acb9ff",
      active: "hotpink",
      // background: "#4a4c4a0d",
      background: "transparent",
      activeBackground: "#515050b3",
      hover: "#4a4c4a52",
    },
    background: {
      nav: "#f9fafb",
      default: "#f9fafb",
      paper: "#e5e3e3db",
      gridItem: "#c4c4cead",
      shadow: "#00000033",
    },
    text: {
      primary: "#1f2937",
      secondary: "#6b7280",
      contrast: "#fff",
    },
  },
  typography: {
    fontFamily: "sans-serif",
    h4: {
      fontSize: "1.5rem",
      fontWeight: 700,
      color: "#1f2937",
    },
    h5: {
      fontSize: "1.25rem",
      fontWeight: 600,
      color: "#1f2937",
    },
  },
  components: {
    ...sharedComponents,
  },
  transitions: { duration: { shortest: 200 } },
});
