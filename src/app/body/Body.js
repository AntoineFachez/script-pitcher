// file path: ~/DEVFOLD/SCRIPT-PITCHER/SRC/APP/BODY/BODY.JS

"use client";

import React, { useState } from "react";
import { Box, Button, Typography, CircularProgress } from "@mui/material"; // ✅ ADDED: CircularProgress

import { useAuth } from "@/context/AuthContext";

import NavBar from "@/components/navBar/index";
import LoginForm from "@/components/auth/appAuth/LogInForm";
import SignUpForm from "@/components/auth/appAuth/SignUpForm";
import CustomBottomNav from "@/components/bottomNav/CustomBottomNav";

import { containerStyles } from "@/theme/muiProps";

export default function Body({ children }) {
  // ✅ PULLING OUT THE RE-INTRODUCED isUserLoading
  const { firebaseUser, isUserLoading } = useAuth();
  const [isSigningUp, setIsSigningUp] = useState(false);

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
          ...containerStyles.sx,
          // backgroundColor: "background.paper",
        }}
      >
        <NavBar />
        <Box
          component="main"
          sx={{
            width: "100%",
            height: "100%",
            overflow: "auto",
          }}
        >
          {children}
        </Box>
        <CustomBottomNav />
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
