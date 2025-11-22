// src/components/forms/BaseCrudForm.js
"use client";
import {
  Box,
  Paper,
  Typography,
  Button,
  LinearProgress,
  Alert,
} from "@mui/material";
import { Save } from "@mui/icons-material";
import { useUi } from "@/context/UiContext";
import BasicDrawer from "@/components/drawer/Drawer";
import AllProjectImages from "@/components/imageGallery/ImageGallery";
import ProfileHeaderForm from "./ProfileHeaderForm";
import { useState } from "react";

export default function BaseCrudForm({
  title,
  formData, // The current data object (must have avatarUrl/imageUrl)
  setFormData, // To update avatar/image from the drawer
  onSubmit, // Function to run on save
  loading,
  error,
  success,
  submitButtonText,
  children, // The specific inputs (TextFields) go here
}) {
  const { orientationDrawer, handleToggleDrawer } = useUi();

  // Shared Image Selection Logic
  const [selectedImageUrlContext, setSelectedImageUrlContext] = useState([]);

  const drawerContent = (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        maxHeight: "50vh",
        overflowY: "scroll",
      }}
    >
      <AllProjectImages
        setFormData={setFormData}
        imageType={selectedImageUrlContext}
      />
    </Box>
  );

  return (
    <Paper
      component="form"
      onSubmit={onSubmit}
      sx={{
        display: "flex",
        flexFlow: "column nowrap",
        width: "100%",
        mx: "auto",
        p: 2,
      }}
    >
      {/* 1. Header Title */}
      <Box sx={{ width: "100%", mb: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: 100 }}>
          {title}
        </Typography>
      </Box>

      <Box sx={{ display: "flex", flexWrap: "wrap", width: "100%" }}>
        {/* 2. Visual Header (Avatar/Banner) */}
        <ProfileHeaderForm
          formData={formData}
          setSelectedImageUrlContext={setSelectedImageUrlContext}
          handleToggleDrawer={handleToggleDrawer}
        />

        {/* 3. The Specific Inputs (Injected via Children) */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            pt: "3rem",
          }}
        >
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {children}

            {/* 4. Shared Feedback & Actions */}
            {loading && <LinearProgress sx={{ mt: 1 }} />}
            {error && <Alert severity="error">{error}</Alert>}
            {success && <Alert severity="success">{success}</Alert>}

            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              sx={{ mt: 2 }}
              startIcon={<Save />}
            >
              {loading ? "Saving..." : submitButtonText || "Save Changes"}
            </Button>
          </Box>
        </Box>
      </Box>

      <BasicDrawer
        handleToggleDrawer={handleToggleDrawer}
        orientationDrawer={orientationDrawer}
        element={drawerContent}
      />
    </Paper>
  );
}
