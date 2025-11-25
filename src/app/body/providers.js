// file path: ~/DEVFOLD/SCRIPT-PITCHER/SRC/APP/BODY/PROVIDERS.JS

"use client";

import { Box, useMediaQuery, useTheme } from "@mui/material";

import { ThemeProvider } from "@/context/ThemeContext";
// import { SessionProvider } from "next-auth/react";
import { AuthProvider } from "@/context/AuthContext";
import { AppProvider } from "@/context/AppContext";
import { UiProvider } from "@/context/UiContext";
import { UserProvider } from "@/context/UserContext";
import { DataProvider } from "@/context/DataContext";
import { InFocusProvider } from "@/context/InFocusContext";

import AuthenticatedLayout from "./Body";
import { darkTheme } from "../../theme/theme";
import { CrudProvider } from "@/context/CrudItemContext";

export function Providers({ children, meData }) {
  //TODO: finish device dependancies
  const theme = useTheme();
  // 'up' means: true if the screen width is greater than or equal to the breakpoint.
  const isDesktop = useMediaQuery(theme.breakpoints.up("lg")); // Using MUI's 'lg' breakpoint (usually 1200px or 1024px depending on setup)

  // 'down' means: true if the screen width is less than or equal to the breakpoint.
  const isMobile = useMediaQuery(theme.breakpoints.down("md")); // Using MUI's 'md' breakpoint (usually 900px or 768px depending on setup)
  console.log("isDesktop", isDesktop, isMobile);

  return (
    <ThemeProvider>
      {/* <SessionProvider> */}
      <AuthProvider>
        <AppProvider>
          <UiProvider>
            <UserProvider meData={meData}>
              <DataProvider>
                <InFocusProvider>
                  <CrudProvider>
                    <Box
                      className="providers"
                      component="div" // Use div instead of body here
                      sx={{
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        flexDirection: "column",
                        overflow: "hidden",
                        bgcolor: "transparent",
                        color: "text.primary",
                        fontFamily: "sans-serif",
                        // backgroundColor: "secondary.main",
                      }}
                      theme={darkTheme === "dark" ? "dark" : "light"}
                    >
                      <AuthenticatedLayout children={children} />
                    </Box>
                  </CrudProvider>
                </InFocusProvider>
              </DataProvider>
            </UserProvider>
          </UiProvider>
        </AppProvider>
      </AuthProvider>
      {/* </SessionProvider> */}
    </ThemeProvider>
  );
}
