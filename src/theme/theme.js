// file path: ~/DEVFOLD/SCRIPT-PITCHER/SRC/THEME/THEME.JS

"use client";

import { createTheme } from "@mui/material/styles";

export const deviceLayout = {
  pageContentWidth: {
    mobile: "95%",
    desktop: "70%",
  },
  cardFlex: {
    mobile: "8 6 220px",
    desktop: "8 6 220px",
  },
};
const baseBorder = "3px #262626ff solid";

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
    randomeRainbow:
      "#ff0000 0%, #ff9a00 10%, #d0de21 20%, #4fdc4a 30%, #3fdad8 40%, #2fc9e2 50%, #1c7fee 60%, #5f15f2 70%, #ba0cf8 80%, #fb07d9 90%, #ff0000 100%",
    tileButtons: {
      nw: {
        background: "linear-gradient(135deg, #667eea91 0%, #764ba291 100%)",
      },
      ne: {
        background: "linear-gradient(135deg, #2af59a91 0%, #009cfdb7 100%)",
      },
      sw: {
        background: "linear-gradient(to top, #00000091 0%, #00000091 100%)",
      },
      se: {
        background: "linear-gradient(135deg, #ffffffc1 0%, #a5a3a391 100%)",
      },
    },
    button: {
      inactive: "#6d7075ff",
      disabled: "#6d7075ff",
      active: "#ff69b4",
      activeBackground: "#1f1f1fff",
      // background: "#4a4c4a0d",
      background: "transparent",
      hover: "#91949152",
    },
    input: "#00000080",
    background: {
      primary: "#181c22ff",
      contrast: "#b4c8e56e",
      paper: "#1f2329db",
      background: "#242425",
      gridItem: "#353536ad",
      alpha: "#0e1929cc",
      shadow: "#00000033",
    },
    bars: {
      app: "#131417",
      side: "#131417",
      bottom: "#131417",
      widget: "#131417",
      tool: "#131417",
    },
    page: {
      background: "#1e1e1e",
      header: "#1e1e1eff",
      title: "#131417",
    },
    card: {
      background: "#141414",
      actions: "#151515",
      hover: "#1f1f1f",
    },
    datagrid: {
      background: "#ffffff00",
      actions: "#151515",
      hover: "#1f1f1f",
      borderColor: "#ffffff00",
      border: baseBorder,
      columnHeader: "#ffffff00",
      main: "#ffffff00",
      footerContainer: "#ffffff00",
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
    h2: {
      fontSize: {
        xs: "1.4rem", // Element is completely hidden (no space) on small screens
        sm: "1.8rem", // Element is visible and takes up space from 'md' up
        md: "1.8rem", // Element is visible and takes up space from 'md' up
        lg: "2rem", // Element is visible and takes up space from 'md' up
        xl: "2.2rem", // Element is visible and takes up space from 'md' up
      },
      fontWeight: {
        xs: 100, // Element is completely hidden (no space) on small screens
        sm: 100, // Element is visible and takes up space from 'md' up
        md: 200, // Element is visible and takes up space from 'md' up
        lg: 300, // Element is visible and takes up space from 'md' up
        xl: 400, // Element is visible and takes up space from 'md' up
      },
    },
    h4: {
      fontSize: "1.5rem",
      fontWeight: 700,
    },
    h5: {
      fontSize: "1.25rem",
      fontWeight: 600,
    },
  },

  transitions: { duration: { shortest: 200 } },
  deviceLayout,
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
    page: {
      background: "#dadadaff",
      header: "#c2c0c0ff",
      title: "#aab6d8ff",
    },
    card: {
      background: "#e5e5e7",
      actions: "#c4c4ce",
      hover: "#c4c4ce",
    },
    text: {
      primary: "#1f2937",
      secondary: "#6b7280",
      contrast: "#fff",
    },
    tileButtons: {
      nw: { background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" },
      ne: { background: "linear-gradient(135deg, #2af598 0%, #009efd 100%)" },
      sw: {
        background:
          "linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 100%)",
      },
      se: {},
    },
  },
  typography: {
    fontFamily: "sans-serif",
    h2: {
      fontSize: {
        xs: "1.4rem", // Element is completely hidden (no space) on small screens
        sm: "1.8rem", // Element is visible and takes up space from 'md' up
        md: "1.8rem", // Element is visible and takes up space from 'md' up
        lg: "2rem", // Element is visible and takes up space from 'md' up
        xl: "2.2rem", // Element is visible and takes up space from 'md' up
      },
      fontWeight: 700,
      color: "#1f2937",
    },
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

  transitions: { duration: { shortest: 200 } },
  baseValues: { borderRadius: "0.5rem" },
  deviceLayout,
});
