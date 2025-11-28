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
                      theme={darkTheme === "dark" ? "dark" : "light"}
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
                        backgroundColor: "page.background",
                      }}
                    >
                      <AuthenticatedLayout>{children}</AuthenticatedLayout>
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
