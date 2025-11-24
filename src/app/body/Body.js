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

import { useAuth } from "@/context/AuthContext";

import NavBar from "@/components/navBar/index";
import LoginForm from "@/components/auth/appAuth/LogInForm";
import SignUpForm from "@/components/auth/appAuth/SignUpForm";
import CustomBottomNav from "@/components/bottomNav/CustomBottomNav";

import { containerStyles } from "@/theme/muiProps";
import BasicDrawer from "@/components/drawer/Drawer";
import { useUi } from "@/context/UiContext";
import SideNavBar from "@/components/sideNavBar/SideNavBar";

export default function Body({ children }) {
  // ✅ PULLING OUT THE RE-INTRODUCED isUserLoading
  const { firebaseUser, isUserLoading } = useAuth();
  const {
    currentWindowSize,
    isDesktop,
    isMobile,
    modalContent,
    setModalContent,
    openModal,
    setOpenModal,
    orientationDrawer,
    handleToggleDrawer,
  } = useUi();
  const [isSigningUp, setIsSigningUp] = useState(false);
  const NAV_HEIGHT = isMobile ? 0 : "48px"; // Typical MUI AppBar height on desktop
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
          pt: NAV_HEIGHT,
        }}
      >
        {/* 1. Top Nav (Takes defined space) */}
        <NavBar />

        {/* 2. Main Content (Takes all the remaining space) */}
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

          <Box
            component="main"
            sx={{
              flexGrow: 1, // **Crucial**: This box expands to fill all available space
              width: "100%",
              // height: "100%",
              overflowY: "auto", // **Crucial**: This is where the scrollbar appears
              overflowX: "hidden",
            }}
          >
            {children}
          </Box>

          {/* 3. Bottom Nav (Takes defined space) */}
          {!isDesktop || currentWindowSize === "md" ? (
            <CustomBottomNav sx={{ height: BOTTOM_NAV_HEIGHT }} />
          ) : null}
        </Box>
      </Box>
    );
  }

  // 3. When the user is definitively logged out (not loading, no firebaseUser),
  // show the authentication forms
  return (
    <Box sx={containerStyles.sx}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 3,
          padding: 4,
          borderRadius: 2,
          boxShadow: 3,
          backgroundColor: "background.paper",
          maxWidth: "400px",
          width: "100%",
        }}
      >
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
    </Box>
  );
}
