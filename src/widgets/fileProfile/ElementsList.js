// file path: ~/DEVFOLD/SCRIPT-PITCHER/SRC/WIDGETS/FILEPROFILE/ELEMENTSLIST.JS

"use client";

import React, { useMemo } from "react";
import {
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Alert,
  Typography,
  ListSubheader,
} from "@mui/material";
// Import icons to represent element types
import DeleteIcon from "@mui/icons-material/Delete";
import NotesIcon from "@mui/icons-material/Notes";
import RectangleIcon from "@mui/icons-material/RectangleOutlined";
import HorizontalRuleIcon from "@mui/icons-material/HorizontalRule";
import ImageIcon from "@mui/icons-material/Image";
import { useFile } from "@/context/FileContext";
import SecureImage from "@/components/secureImage/SecureImage";
import Image from "next/image";
import CircularIndeterminate from "@/components/progress/CircularIndeterminate";

/**
 * A component that lists ALL processed elements (text, shapes, lines, images)
 * from the document and provides a delete button for image elements.
 */
export default function ElementList() {
  const { fileData, loading, error, handleDeleteElement } = useFile();

  // 1. Create a flat list of ALL elements
  const allElements = useMemo(() => {
    if (!fileData || !fileData?.processedData?.pages) {
      return [];
    }

    // Use flatMap to turn pages -> elements into a single array
    return fileData.processedData.pages.flatMap((page, pageIndex) =>
      page.elements.map((element, elIndex) => ({
        ...element,
        pageNumber: pageIndex + 1, // Add page number for context
        // Create a stable, unique key for React
        uniqueId: `p${pageIndex}-e${elIndex}`,
      }))
    );
  }, [fileData]);

  // 2. Handle Loading State
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" my={4}>
        <CircularIndeterminate color="secondary" />
      </Box>
    );
  }

  // 3. Handle Error State
  if (error) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        Error loading document: {error}
      </Alert>
    );
  }

  // 4. Handle Empty State
  if (allElements.length === 0) {
    return (
      <Alert severity="info" sx={{ m: 2 }}>
        There are no processed elements in this document.
      </Alert>
    );
  }

  // 5. Render the List
  return (
    <List
      subheader={<ListSubheader>All Elements</ListSubheader>} // <-- Updated title
      sx={{
        width: "100%", // <-- Made width flexible
        // maxWidth: "20rem", // <-- Added max-width
        height: "100%",
        display: "flex",
        flexFlow: "column nowrap",
        borderRadius: 1,
        overflowY: "auto", // <-- Added for scrolling
        gap: 1,
        backgroundColor: "background.paper",
      }}
    >
      {allElements.map((element) => {
        let icon = <NotesIcon />;
        let primaryText = `Page ${element.pageNumber}: ${element.type}`;
        let secondaryText = `ID: ${element.uniqueId}`;

        // Customize display based on element type
        switch (element.type) {
          case "image":
            icon = <ImageIcon />;
            primaryText = `Page ${element.pageNumber}: Image`;
            secondaryText = element.src; // Show the src
            break;
          case "text":
            icon = <NotesIcon />;
            primaryText = `Page ${element.pageNumber}: Text`;
            // Show a preview of the text content
            secondaryText = `"${element.content.substring(0, 40)}..."`;
            break;
          case "shape":
            icon = <RectangleIcon />;
            primaryText = `Page ${element.pageNumber}: Shape`;
            secondaryText = `Color: ${element.backgroundColor}`;
            break;
          case "line":
            icon = <HorizontalRuleIcon />;
            primaryText = `Page ${element.pageNumber}: Line`;
            secondaryText = `Color: ${element.strokeColor}`;
            break;
          default:
            break;
        }
        const getIsShape = (element) => {
          if (element.type === "shape") return element;
        };
        {
          /* console.log(JSON.stringify(getIsShape(element))); */
        }
        return (
          <>
            <ListItem
              key={element.uniqueId} // <-- Use new unique key
              divider
              // Use the 'secondaryAction' prop on ListItem
              secondaryAction={
                // **Only show delete button for images (elements with a 'src')**
                element.src ? (
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() => handleDeleteElement(element.src)}
                  >
                    <DeleteIcon />
                  </IconButton>
                ) : null // No delete button for text, shapes, etc.
              }
              sx={{ position: "relative", width: "100%" }}
            >
              <ListItemIcon>{icon}</ListItemIcon>
              {/* <SecureImage gcsPath={element.src} sx={{}} /> */}
              {element.src && (
                <Image
                  fill
                  src={element.src}
                  alt={element.src}
                  style={{ objectFit: "contain" }}
                />
              )}
              {element.type === "shape" && (
                <Box
                  sx={{
                    position: "absolute",
                    top: element.x0,
                    right: element.x1,
                    bottom: element.y0,
                    left: element.y1,
                    backgroundColor: element.backgroundColor,
                    opacity: element.opacity,
                    zIndex: element.zIndex,
                    // position: element.position,
                  }}
                />
              )}
              <ListItemText
                primary={primaryText}
                secondary={secondaryText}
                slotProps={{
                  secondary: {
                    style: {
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      maxWidth: "100%",
                    },
                  },
                }}
              />
            </ListItem>
          </>
        );
      })}
    </List>
  );
}
