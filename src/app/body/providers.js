// file path: ~/DEVFOLD/SCRIPT-PITCHER/SRC/APP/BODY/PROVIDERS.JS

"use client";

import { Box } from "@mui/material";

import { ThemeProvider } from "@/context/ThemeContext";
import { SessionProvider } from "next-auth/react";
import { AuthProvider } from "@/context/AuthContext";
import { AppProvider } from "@/context/AppContext";
import { UiProvider } from "@/context/UiContext";
import { UserProvider } from "@/context/UserContext";
import { DataProvider } from "@/context/DataContext";
import { InFocusProvider } from "@/context/InFocusContext";

import AuthenticatedLayout from "./Body";
import { darkTheme } from "../../theme/theme";
import { CrudProvider } from "@/context/CrudItemContext";

export function Providers({ children }) {
  return (
    <ThemeProvider>
      <SessionProvider>
        <AuthProvider>
          <AppProvider>
            <UiProvider>
              <UserProvider>
                <DataProvider>
                  <InFocusProvider>
                    <CrudProvider>
                      <Box
                        component="div" // Use div instead of body here
                        sx={{
                          width: "100%",
                          height: "100%",
                          bgcolor: "background.default",
                          color: "text.primary",
                          fontFamily: "sans-serif",
                          overflow: "hidden",
                          display: "flex",
                          flexDirection: "column",
                        }}
                        theme={darkTheme === "dark" ? "dark" : "light"}
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
      </SessionProvider>
    </ThemeProvider>
  );
}
