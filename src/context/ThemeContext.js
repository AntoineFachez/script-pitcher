// file path: ~/DEVFOLD/SCRIPT-PITCHER/SRC/CONTEXT/THEMECONTEXT.JS

"use client";

import React, { createContext, useState, useMemo, useContext } from "react";
import {
  ThemeProvider as MuiThemeProvider,
  createTheme,
} from "@mui/material/styles";
import { darkTheme } from "../theme/theme";
import { brightTheme } from "../theme/theme";

// Create the context
const ThemeContext = createContext({
  toggleColorMode: () => {},
});

// Create the provider component
export function ThemeProvider({ children }) {
  const [mode, setMode] = useState("dark"); // Default mode is 'dark'

  // The function to toggle the mode
  const toggleColorMode = () => {
    setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
  };

  // Memoize the theme creation to avoid re-calculating on every render
  const theme = useMemo(
    () => (mode === "light" ? brightTheme : darkTheme),
    [mode]
  );

  return (
    <ThemeContext.Provider value={{ toggleColorMode }}>
      <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>
    </ThemeContext.Provider>
  );
}

// Custom hook to easily use the context
export const useThemeContext = () => useContext(ThemeContext);
