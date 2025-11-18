// file path: ~/DEVFOLD/SCRIPT-PITCHER/SRC/APP/INVITE/[PROJECTID]/[TOKEN]/PAGE.JS

"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Paper,
} from "@mui/material";
import { getAuth, onAuthStateChanged } from "firebase/auth"; // Client SDK

export default function InvitePage({ params }) {
  const { projectId, token } = React.use(params); // Unwrap params in Next.js 15
  const router = useRouter();

  const [status, setStatus] = useState("idle"); // idle, loading, success, error
  const [errorMsg, setErrorMsg] = useState("");
  const [user, setUser] = useState(null);

  // Check Auth State
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleAccept = async () => {
    if (!user) {
      // Force login redirect if not logged in
      // Adjust this path to your actual login route
      router.push(`/login?redirect=/invite/${projectId}/${token}`);
      return;
    }

    setStatus("loading");
    try {
      const idToken = await user.getIdToken();

      const res = await fetch("/api/invitations/accept", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({ projectId, token }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Something went wrong");

      setStatus("success");

      // Redirect to the projects dashboard after short delay
      setTimeout(() => {
        router.push("/projects");
      }, 2000);
    } catch (err) {
      setStatus("error");
      setErrorMsg(err.message);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        p: 3,
      }}
    >
      <Paper elevation={3} sx={{ p: 4, maxWidth: 500, textAlign: "center" }}>
        <Typography variant="h5" gutterBottom>
          Project Invitation
        </Typography>

        {status === "idle" && (
          <>
            <Typography sx={{ mb: 3 }}>
              You have been invited to join a project.
              {!user && " Please log in to accept."}
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={handleAccept}
              disabled={!user && false} // You might want to link to login if !user
            >
              {user ? "Accept Invitation" : "Log in to Accept"}
            </Button>
          </>
        )}

        {status === "loading" && (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
            }}
          >
            <CircularProgress />
            <Typography>Joining project...</Typography>
          </Box>
        )}

        {status === "success" && (
          <Box>
            <Typography variant="h6" color="success.main" gutterBottom>
              Success!
            </Typography>
            <Typography>
              You are now a member. Redirecting to dashboard...
            </Typography>
          </Box>
        )}

        {status === "error" && (
          <Box>
            <Typography variant="h6" color="error.main" gutterBottom>
              Error
            </Typography>
            <Typography color="error">{errorMsg}</Typography>
            <Button sx={{ mt: 2 }} onClick={() => setStatus("idle")}>
              Try Again
            </Button>
          </Box>
        )}
      </Paper>
    </Box>
  );
}
