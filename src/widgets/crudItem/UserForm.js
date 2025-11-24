"use client";

import { useEffect, useState } from "react";
import {
  Box,
  TextField,
  Typography,
  Alert,
  Button,
  LinearProgress,
  Paper,
} from "@mui/material";
import { Save } from "@mui/icons-material";
import { useAuth } from "@/context/AuthContext";
import { useInFocus } from "@/context/InFocusContext";
import {
  formFieldsGroupStyles,
  formFieldStyles,
  formStyles,
  formTitleStyles,
} from "@/theme/muiProps";

/**
 * Form for creating or editing a user document in Firestore.
 * @param {string} crud - 'create' or 'update'
 */
export default function UserForm({ crud }) {
  const { firebaseUser } = useAuth();
  const { userInFocus } = useInFocus(); // Get the user being edited

  // This form manages its own local state
  const [formData, setFormData] = useState({
    displayName: "",
    email: "",
  });
  const [isUploading, setIsUploading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState(null);

  // Pre-fill form for 'update' or 'create'
  useEffect(() => {
    if (crud === "update" && userInFocus) {
      // Editing an existing user, pre-fill from context
      setFormData({
        displayName: userInFocus.displayName || "",
        email: userInFocus.email || "",
      });
    } else if (crud === "create" && firebaseUser) {
      // Creating a new user, pre-fill with auth data
      setFormData({
        displayName: firebaseUser.displayName || "",
        email: firebaseUser.email || "",
      });
    }
  }, [crud, userInFocus, firebaseUser]);

  // This handler updates the local form data
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!firebaseUser) {
      setError("You must be logged in.");
      return;
    }
    if (!formData.displayName) {
      setError("Display Name is required.");
      return;
    }

    setIsUploading(true);
    setError("");
    setSuccess("");

    let url = "/api/users";
    let method = "POST";
    let body = JSON.stringify({
      uid: firebaseUser.uid, // Required for 'create'
      email: formData.email,
      displayName: formData.displayName,
    });

    if (crud === "update") {
      // Switch to update (PUT) mode
      url = `/api/users/${userInFocus.uid}`; // Assumes userInFocus has the uid
      method = "PUT";
      body = JSON.stringify({
        // Only send fields that can be updated
        displayName: formData.displayName,
      });
    }

    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${await firebaseUser.getIdToken()}`,
        },
        body: body,
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Failed to save user.");
      }

      const result = await response.json();
      setSuccess(
        crud === "create"
          ? "Successfully created user!"
          : "Successfully updated user!"
      );
      console.log(result);

      // You would typically close the modal here via a context call
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
      sx={{
        ...formStyles.sx,
        // width: "100%",
        // minWidth: {
        //   xs: "100%",
        //   sm: "15ch",
        //   md: "15ch",
        // },
        // maxWidth: "50ch",
        // mx: "auto",
      }}
    >
      <Typography
        variant={formTitleStyles.variant}
        gutterBottom
        sx={formTitleStyles.sx}
      >
        {crud === "create" ? "Create User Profile" : "Edit User Profile"}
      </Typography>
      <Box className="formfields--group" sx={formFieldsGroupStyles.sx}>
        <TextField
          sx={formFieldStyles.sx}
          label="Display Name"
          name="displayName"
          value={formData.displayName}
          onChange={handleChange}
          required
        />
        <TextField
          sx={formFieldStyles.sx}
          label="Email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          disabled={crud === "update"} // Don't allow email changes on update
        />

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
          startIcon={<Save />}
        >
          {isUploading ? "Saving..." : "Save Changes"}
        </Button>
      </Box>
    </Paper>
  );
}
