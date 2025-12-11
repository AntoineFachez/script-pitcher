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
import CircularIndeterminate from "@/components/progress/CircularIndeterminate";

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

      {
        /**
         //TODO: If success check userToUser_lookup if invitee and invitor are linked. 
         //! move that logic to the API route:        
         // If not add doc: 
          const data = await res.json(); 

          // 1. Construct a deterministic ID to prevent duplicates
          const myUid = user.uid;
          const otherUid = data.inviterId; // Returned from API
          const docId = [myUid, otherUid].sort().join("_"); 

          // 2. Reference the DB (assuming Firestore logic)
          const lookupRef = doc(db, "userToUser_lookup", docId);
          const docSnap = await getDoc(lookupRef);

          if (!docSnap.exists()) {
            // 3. Create the link
            await setDoc(lookupRef, {
              participants: [myUid, otherUid],
              origin: {
                source: "project_invite",
                projectId: projectId, // from params
                initiatedBy: otherUid,
              },
              createdAt: new Date(),
              status: "active"
            });
          } else {
            // Optional: Update interaction count or "last seen"
            await updateDoc(lookupRef, {
               interactionCount: increment(1),
               lastInteractionAt: new Date()
            });
          }

        {
            // --- PARTICIPANTS ---
            "participants": ["user_uid_A", "user_uid_B"], // Array for simple "array-contains" queries
            "users": {
              "user_uid_A": {
                "displayName": "Alice", // Optional: Denormalized for fast UI rendering
                "role": "inviter"      // Context of how the link started
              },
              "user_uid_B": {
                "displayName": "Bob",
                "role": "invitee"
              }
            },

            // --- RELATIONSHIP CONTEXT (From your script) ---
            "origin": {
              "source": "project_invite",   // How did they meet?
              "projectId": "proj_xyz123",   // The projectId from your params
              "initiatedBy": "user_uid_A",  // Who sent the invite
              "acceptedAt": "2023-10-27T10:00:00Z" // When the invite was accepted
            },

            // --- STATUS ---
            "status": "active", // active, blocked, muted
            "interactionCount": 1, // Increment this if they work on future projects together

            // --- METADATA ---
            "createdAt": "2023-10-27T10:00:00Z",
            "lastInteractionAt": "2023-10-27T10:00:00Z"
          }
         */
      }

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
            <CircularIndeterminate color="primary" />
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
