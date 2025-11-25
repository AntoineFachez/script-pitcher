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

import AppBar from "@/components/appBar/index";
import CustomBottomNav from "@/components/bottomNav/CustomBottomNav";
import LoginForm from "@/components/auth/appAuth/LogInForm";
import SideNavBar from "@/components/sideNavBar/SideNavBar";
import SignUpForm from "@/components/auth/appAuth/SignUpForm";

import { useUi } from "@/context/UiContext";

import { containerStyles, pageStyles } from "@/theme/muiProps";
import CircularIndeterminate from "@/components/progress/CircularIndeterminate";

export default function Body({ children }) {
  const { appContext } = useApp();
  const { firebaseUser, isUserLoading } = useAuth();
  const { currentWindowSize, isDesktop, isMobile } = useUi();
  const [isSigningUp, setIsSigningUp] = useState(false);
  const NAV_HEIGHT = isMobile ? "48px" : "48px"; // Typical MUI AppBar height on desktop
  const SIDEBAR_WIDTH = isDesktop ? "72px" : 0; // Typical MUI AppBar height on desktop
  const BOTTOM_NAV_HEIGHT = isDesktop ? 0 : "48px"; // Typical MUI BottomNavigation height

  const toggleAuthMode = () => {
    setIsSigningUp((prev) => !prev);
  };

  // 1. Show a loading spinner while the NextAuth session status is resolving.
  // This is CRITICAL for a smooth UX and preventing a flicker of the login form.
  if (isUserLoading) {
    return (
      <>
        <CircularIndeterminate color="secondary" />
        <Typography variant="subtitile1" sx={{ pt: 4, ml: "1ch" }}>
          Loading user session...
        </Typography>
      </>
    );
  }

  // 2. When the user is logged in (firebaseUser is successfully set via onIdTokenChanged),
  // show the main application layout
  if (firebaseUser) {
    return (
      <>
        {/* 1. Top Nav (Takes defined space) */}
        <AppBar spaceProps={{ height: NAV_HEIGHT }} />

        {/* 2. Sidebar Nav (if isDesktop) */}
        <Box
          className="app--main"
          component="main"
          sx={{
            width: "100%",
            height: `100%`,

            display: "flex",
            // justifyContent: "center",
            // alignItems: "center",
            flexFlow: isDesktop ? "row nowrap" : "column nowrap", // Stack children vertically
            overflow: "hidden",
            padding: `${NAV_HEIGHT} 0 ${BOTTOM_NAV_HEIGHT} 0`,
          }}
        >
          {isDesktop && (
            <>
              <SideNavBar SIDEBAR_WIDTH={SIDEBAR_WIDTH} />
              {/* <Divider orientation="vertical" /> */}
            </>
          )}

          {/* 3. Main Content (Takes all the remaining space) */}
          <Box
            className="app--floor"
            sx={{
              ...pageStyles.sx,
              width: `calc(100% - ${SIDEBAR_WIDTH})`,
              height: `100%`,
              // height: `calc(100% - ${NAV_HEIGHT})`,

              // pb: !isDesktop && appContext !== "home" ? BOTTOM_NAV_HEIGHT : 0,
              // padding: `${NAV_HEIGHT} 0 ${BOTTOM_NAV_HEIGHT} 0`,
              // pb: BOTTOM_NAV_HEIGHT,
            }}
          >
            {children}
          </Box>

          {/* 4. Bottom Nav (Takes defined space) */}
          {!isDesktop && appContext !== "home" ? (
            <CustomBottomNav sx={{ height: BOTTOM_NAV_HEIGHT }} />
          ) : null}
        </Box>
      </>
    );
  }

  // 3. When the user is definitively logged out (not loading, no firebaseUser),
  // show the authentication forms
  return (
    <>
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
    </>
  );
}
