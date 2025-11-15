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

/**
 * A form for project owners to invite new users.
 * @param {object} props - Component props.
 * @param {string} props.crud - The operation mode (e.g., 'inviteUser').
 */
export default function InviteUserForm({ crud }) {
  const { firebaseUser } = useAuth();
  const { projectInFocus } = useInFocus(); // Get the current project ID

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

      setSuccess(`Successfully invited ${email} as a ${role}.`);
      setEmail(""); // Clear form
      setRole("viewer");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Paper
      component="form"
      onSubmit={handleSubmit}
      sx={{ width: "100%", maxWidth: "50ch", mx: "auto", p: 2 }}
    >
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
          {isUploading ? "Sending..." : "Send Invitation"}
        </Button>
      </Box>
    </Paper>
  );
}
