// file path: ~/DEVFOLD/SCRIPT-PITCHER/SRC/APP/BODY/BODY.JS

"use client";

import React, { useState } from "react";
import {
  Box,
  Button,
  Typography,
  CircularProgress,
  Divider,
} from "@mui/material"; // ✅ ADDED: CircularProgress

import { useApp } from "@/context/AppContext";
import { useAuth } from "@/context/AuthContext";

import CustomBottomNav from "@/components/bottomNav/CustomBottomNav";
import LoginForm from "@/components/auth/appAuth/LogInForm";
import SideNavBar from "@/components/sideNavBar/SideNavBar";
import SignUpForm from "@/components/auth/appAuth/SignUpForm";
import NavBar from "@/components/navBar/index";

import { useUi } from "@/context/UiContext";

import { containerStyles, pageStyles } from "@/theme/muiProps";

export default function Body({ children }) {
  const { appContext } = useApp();
  const { firebaseUser, isUserLoading } = useAuth();
  const { currentWindowSize, isDesktop, isMobile } = useUi();
  const [isSigningUp, setIsSigningUp] = useState(false);
  const NAV_HEIGHT = isMobile ? "48px" : "48px"; // Typical MUI AppBar height on desktop
  const BOTTOM_NAV_HEIGHT = isDesktop ? 0 : "56px"; // Typical MUI BottomNavigation height

  const toggleAuthMode = () => {
    setIsSigningUp((prev) => !prev);
  };

  // 1. Show a loading spinner while the NextAuth session status is resolving.
  // This is CRITICAL for a smooth UX and preventing a flicker of the login form.
  if (isUserLoading) {
    return (
      <Box
        sx={{
          ...containerStyles.sx,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <CircularProgress />
        <Typography variant="body1" sx={{ ml: 2 }}>
          Loading user session...
        </Typography>
      </Box>
    );
  }

  // 2. When the user is logged in (firebaseUser is successfully set via onIdTokenChanged),
  // show the main application layout
  if (firebaseUser) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column", // Stack children vertically
          height: "100vh", // Crucial: Use the full viewport height
          overflow: "hidden", // Prevent the whole app from scrolling
        }}
      >
        {/* 1. Top Nav (Takes defined space) */}
        <NavBar spaceProps={{ height: NAV_HEIGHT }} />

        {/* 2. Sidebar Nav (if isDesktop) */}
        <Box
          sx={{
            display: "flex",
            flexFlow: isDesktop ? "row nowrap" : "column nowrap", // Stack children vertically
            // height: "100vh", // Crucial: Use the full viewport height
            height: "100%", // Crucial: Use the full viewport height
            // overflow: "hidden",
          }}
        >
          {isDesktop && (
            <>
              <SideNavBar />
              <Divider orientation="vertical" />
            </>
          )}

          {/* 3. Main Content (Takes all the remaining space) */}
          <Box
            component="main"
            sx={{ ...pageStyles.sx, pb: BOTTOM_NAV_HEIGHT }}
          >
            {children}
          </Box>

          {/* 4. Bottom Nav (Takes defined space) */}
          {!isDesktop && appContext !== "home" ? (
            <CustomBottomNav sx={{ height: BOTTOM_NAV_HEIGHT }} />
          ) : null}
        </Box>
      </Box>
    );
  }

  // 3. When the user is definitively logged out (not loading, no firebaseUser),
  // show the authentication forms
  return (
    <Box sx={pageStyles.sx}>
      <Typography variant="h4" component="h1">
        {isSigningUp ? "Create Account" : "Welcome Back"}
      </Typography>

      {isSigningUp ? <SignUpForm /> : <LoginForm />}

      <Button
        onClick={toggleAuthMode}
        variant="text"
        size="small"
        sx={{ textTransform: "none", mt: 1 }}
      >
        {isSigningUp
          ? "Already have an account? Log In"
          : "Don't have an account? Sign Up"}
      </Button>
    </Box>
  );
}
