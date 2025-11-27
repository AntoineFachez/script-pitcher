// file path: ~/DEVFOLD/SCRIPT-PITCHER/SRC/COMPONENTS/AUTH/APPAUTH/LOGINFORM.JS

"use client";

import React, { useState } from "react";
import { Box, Button, TextField } from "@mui/material";
import { useAuth } from "@/context/AuthContext"; // Import the custom hook

export default function LoginForm() {
  // Get all auth state and functions from the context
  const { handleLogin, authLoading, authError } = useAuth();

  // Local state for form inputs
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  /**
   * Handles the form submission by calling the context function.
   * @param {Event} e The form submission event.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Call the login function from the context
    await handleLogin(email, password);
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        display: "flex",
        flexFlow: "column nowrap",
        justifyContent: "flex-end",
        gap: 2,
      }}
    >
      <Box className="mb-6">
        <TextField
          label="Email Address"
          size="small"
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          fullWidth
          disabled={authLoading} // Disable form while loading
        />
      </Box>
      <Box className="mb-6">
        <TextField
          label="Password"
          size="small"
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          fullWidth
          disabled={authLoading} // Disable form while loading
        />
      </Box>

      {/* Display the error from the context */}
      {authError && (
        <Box className="mb-4 text-red-400 text-sm text-center">{authError}</Box>
      )}

      <Button
        type="submit"
        className="w-full bg-teal-600 text-white font-bold py-3 px-4 rounded-lg shadow-md hover:bg-teal-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-50"
        disabled={authLoading} // Use the loading state from context
        sx={{ width: "fit-content" }}
        variant="contained"
      >
        {authLoading ? "Logging in..." : "Log In"}
      </Button>
    </Box>
  );
}
