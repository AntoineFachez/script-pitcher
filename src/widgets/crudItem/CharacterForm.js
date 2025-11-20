// file path: ~/DEVFOLD/SCRIPT-PITCHER/SRC/WIDGETS/CRUDITEM/CHARACTERFORM.JS

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
  Avatar,
} from "@mui/material";
import { Save } from "@mui/icons-material";
import { useAuth } from "@/context/AuthContext";
import { useInFocus } from "@/context/InFocusContext";
import AllProjectImages from "@/components/imageGallery/ImageGallery";

export default function CharacterForm({ crud }) {
  const { firebaseUser } = useAuth();
  const { characterInFocus } = useInFocus();

  const [formData, setFormData] = useState({
    name: "",
    archetype: "",
    description: "",
    imageUrl: "",
    avatarUrl: "",
    projectId: "", // <-- Store projectId
  });

  const [isUploading, setIsUploading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    if (crud === "update" && characterInFocus) {
      // Pre-fill form for editing
      setFormData({
        name: characterInFocus.name || "",
        archetype: characterInFocus.archetype || "",
        description: characterInFocus.description || "",
        imageUrl: characterInFocus.imageUrl || "",
        avatarUrl: characterInFocus.avatarUrl || "",
        projectId: characterInFocus.projectId || "", // <-- Get projectId
      });
    } else if (crud === "create") {
      // Clear form for creating
      // *** IMPORTANT: You need to get the CURRENT project's ID here.
      // I'll assume characterInFocus (which might be the project) has it.
      setFormData({
        name: "",
        archetype: "",
        description: "",
        imageUrl: "",
        avatarUrl: "",
        // This assumes your context provides the *current project's ID*
        // even when creating a new character.
        // Adjust this if you get the projectId differently.
        projectId: characterInFocus?.projectId || "",
      });
    }
  }, [crud, characterInFocus]);

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
    if (!formData.name) {
      setError("Character Name is required.");
      return;
    }

    // --- FIX: Check for projectId ---
    if (!formData.projectId && crud === "create") {
      setError("Error: Project ID is missing. Cannot create character.");
      return;
    }

    setIsUploading(true);
    setError("");
    setSuccess("");

    // --- FIX: Use the new /api/characters endpoint ---
    let url = "/api/characters";
    let method = "POST";

    // Prepare the data payload
    const dataToSend = {
      name: formData.name,
      archetype: formData.archetype,
      description: formData.description,
      avatarUrl: formData.avatarUrl,
      imageUrl: formData.imageUrl,
      projectId: formData.projectId, // Send projectId in the body
    };

    if (crud === "update") {
      // --- FIX: Use characterInFocus.id, not .uid ---
      const characterId = characterInFocus?.id;

      if (!characterId) {
        setError("Error: Character ID is missing. Cannot update.");
        setIsUploading(false);
        return;
      }

      url = `/api/characters/${characterId}`; // New endpoint
      method = "PUT";
    }

    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${await firebaseUser.getIdToken()}`,
        },
        body: JSON.stringify(dataToSend), // Body is the same for create/update
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || `Failed to ${crud} character.`);
      }

      const result = await response.json();
      setSuccess(
        crud === "create"
          ? "Successfully created character!"
          : "Successfully updated character!"
      );
      console.log(result);
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
        width: "100%",
        maxWidth: "50ch",
        mx: "auto",
        p: 2,
      }}
    >
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 100 }}>
        {crud === "create" ? "Create Character" : "Edit Character"}
      </Typography>

      {/* The Image Gallery passes the URL to setFormData */}
      <Box
        sx={{
          width: "100%",
          height: "100%",
          maxHeight: "50vh",
          overflowY: "scroll",
        }}
      >
        <AllProjectImages setFormData={setFormData} imageType="avatarUrl" />
      </Box>

      <Box
        sx={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          gap: 2,
          mt: 2,
        }}
      >
        {/* This Avatar will now update when you click an image */}
        <Avatar
          src={formData.avatarUrl || formData.imageUrl}
          sx={{ width: 56, height: 56, alignSelf: "center" }}
        />

        <TextField
          label="Character Name"
          name="name" // Corrected from 'displayName'
          value={formData.name}
          onChange={handleChange}
          required
        />
        <TextField
          label="Arche Type"
          name="archetype"
          value={formData.archetype}
          onChange={handleChange}
        />
        <TextField
          label="Description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          multiline
          rows={3}
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
