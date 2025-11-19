// file path: ~/DEVFOLD/SCRIPT-PITCHER/SRC/WIDGETS/CRUDITEM/INVITEUSERFORM.JS

"use client";

import { useState } from "react";
import {
  Box,
  TextField,
  Typography,
  Alert,
  Button,
  LinearProgress,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { Send } from "@mui/icons-material";
import { useAuth } from "@/context/AuthContext";
import { useInFocus } from "@/context/InFocusContext";
import { useUser } from "@/context/UserContext";

/**
 * A form for project owners to invite new users.
 * @param {object} props - Component props.
 * @param {string} props.crud - The operation mode (e.g., 'inviteUser').
 */
export default function InviteUserForm({ crud }) {
  const { firebaseUser } = useAuth();
  const { projectInFocus } = useInFocus(); // Get the current project ID
  const { userProfile } = useUser(); // Get the current project ID

  const [email, setEmail] = useState("");
  const [role, setRole] = useState("viewer"); // Default role
  const [isUploading, setIsUploading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!firebaseUser) {
      setError("You must be logged in to send invitations.");
      return;
    }
    if (!projectInFocus?.id) {
      setError("Project context missing. Cannot send invitation.");
      return;
    }
    if (!email) {
      setError("Email is required.");
      return;
    }

    setIsUploading(true);
    setError("");
    setSuccess("");

    // Use projectInFocus.id which is available from context
    const url = `/api/projects/${projectInFocus.id}/invite`;
    const method = "POST";
    const body = JSON.stringify({ email, role });

    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          // Get the Firebase ID token for authorization in the API route
          Authorization: `Bearer ${await firebaseUser.getIdToken()}`,
        },
        body: body,
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Failed to send invitation.");
      }
      const data = await response.json();
      if (response.ok) {
        // ✅ MECHANIC: Build the URL client-side using the window object
        // This creates: https://your-app.com/invite/project_123/invitation_456
        const inviteUrl = `${window.location.origin}/invite/${data.projectId}/${data.token}`;

        // Now display this 'inviteUrl' to the user (e.g., put it in state to show a "Copy Link" box)

        if (inviteUrl)
          handleMailTo({ email: email, role: role, inviteUrl: inviteUrl });
      }
      setSuccess(`Successfully invited ${email} as a ${role}.`);
      setEmail(""); // Clear form
      setRole("viewer");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsUploading(false);
    }
  };
  const handleMailTo = (mailData) => {
    window.location.href = `mailto:${mailData.email}?subject=You got invited to ${projectInFocus.title}&body=Please click ${mailData.inviteUrl}`;
  };

  return (
    <Paper
      component="form"
      onSubmit={handleSubmit}
      sx={{ width: "100%", maxWidth: "50ch", mx: "auto", p: 2 }}
    >
      <Button onClick={() => handleMailTo({ email: email, role: role })}>
        send
      </Button>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 100 }}>
          Invite New Team Member
        </Typography>
        <TextField
          label="User Email"
          name="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <FormControl fullWidth>
          <InputLabel id="role-select-label">Role</InputLabel>
          <Select
            labelId="role-select-label"
            value={role}
            label="Role"
            onChange={(e) => setRole(e.target.value)}
          >
            <MenuItem value={"viewer"}>Viewer</MenuItem>
            <MenuItem value={"editor"}>Editor</MenuItem>
            <MenuItem value={"owner"}>Owner</MenuItem>
          </Select>
        </FormControl>

        {isUploading && (
          <Box sx={{ width: "100%", mt: 1 }}>
            <LinearProgress />
          </Box>
        )}
        {error && <Alert severity="error">{error}</Alert>}
        {success && <Alert severity="success">{success}</Alert>}

        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={isUploading}
          sx={{ mt: 2 }}
          startIcon={<Send />}
        >
          {isUploading ? "Creating..." : "Create Invitation"}
        </Button>
      </Box>
    </Paper>
  );
}
