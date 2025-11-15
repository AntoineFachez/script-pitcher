"use client";

import { useMemo } from "react";
import {
  Box,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Typography,
  Alert,
  Paper,
  ListItemAvatar,
  Avatar,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import Image from "next/image";

import { useDocument } from "@/context/DocumentContext"; // Import the custom hook

export default function StorageManager({ handleSetImageInFocus }) {
  // Get all data and functions directly from the context.
  // No more local state for files, loading, or error.
  const { documentData, handleDeleteElement, error, loading } = useDocument();

  // Derive the list of images from the documentData provided by the context.
  // useMemo ensures this only runs when documentData changes.
  const imageList = useMemo(() => {
    if (!documentData?.pages) return [];

    // Flatten the pages array to get a single list of all image elements
    return documentData.pages.flatMap((page) =>
      page.elements.filter((element) => element.type === "image")
    );
  }, [documentData]);

  // The loading state is now also handled by the context.
  if (loading) {
    return null; // Or a smaller loader, since the main view will have one.
  }

  return (
    <Paper elevation={3} sx={{ p: { xs: 2, md: 3 }, mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Extracted Image Manager
      </Typography>
      {error && <Alert severity="error">{error}</Alert>}
      {!error && (
        <List>
          {imageList.map((image, index) => (
            <ListItem
              key={image.src || index} // Use image.src as a unique key
              divider
              secondaryAction={
                <IconButton
                  edge="end"
                  aria-label="delete"
                  // Call the delete function from the context
                  onClick={() => handleDeleteElement(image.src)}
                >
                  <DeleteIcon />
                </IconButton>
              }
              // The handleSetImageInFocus prop is still passed from the parent page
              onClick={() =>
                handleSetImageInFocus && handleSetImageInFocus(image)
              }
              sx={{ cursor: "pointer" }}
            >
              <ListItemAvatar>
                <Avatar
                  variant="square"
                  sx={{
                    width: 64,
                    height: 64,
                    bgcolor: "grey.200",
                    position: "relative",
                  }}
                >
                  <Image
                    src={image.src} // Use the src directly from the element data
                    alt={image.src.split("/").pop()}
                    fill
                    style={{ objectFit: "contain" }}
                    unoptimized
                  />
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={image.src.split("/").pop()}
                // Find the page number this image belongs to for secondary text
                secondary={`Page ${
                  documentData.pages.findIndex((p) =>
                    p.elements.includes(image)
                  ) + 1
                }`}
                primaryTypographyProps={{ style: { fontWeight: "bold" } }}
              />
            </ListItem>
          ))}
          {imageList.length === 0 && (
            <Typography
              sx={{ textAlign: "center", color: "text.secondary", p: 2 }}
            >
              No images found in this document.
            </Typography>
          )}
        </List>
      )}
    </Paper>
  );
}
