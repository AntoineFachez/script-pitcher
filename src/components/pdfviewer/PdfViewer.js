"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import Image from "next/image";
import { Box, Chip, Divider } from "@mui/material";
import { motion } from "framer-motion"; // <--- Import
import { useFile } from "@/context/FileContext";
import PDFPage from "./PDFPage";

// A simple loading spinner component
const Loader = () => (
  <Box className="flex justify-center items-center p-12">
    <Box className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></Box>
  </Box>
);

// The main viewer component
// The main viewer component
function PdfViewerContent({
  containerRef,
  onElementClick,
  viewMode = "hybrid",
}) {
  const { fileData, loading, error } = useFile();
  const page = 2;
  // console.log(fileData?.processedData?.pages[page]);
  // console.log(fileData?.processedData?.pages[page].elements[0].src);
  //
  const { isEditing, anchors } = useSoundtrack();
  const { playTrack } = useSpotifyPlayer();

  const [scale, setScale] = useState(0.1);

  // Memoize the style map for efficiency
  const styleMap = useMemo(() => {
    if (!fileData?.processedData?.stylesheet) return {};
    return Object.values(fileData?.processedData?.stylesheet).reduce(
      (acc, style) => {
        // Store the font size as a number so we can scale it
        acc[style.id] = {
          fontFamily: style.fontFamily,
          fontSize: style.fontSize,
          color: style.color,
        };
        return acc;
      },
      {}
    );
  }, [fileData]);

  const groupedPages = useMemo(() => {
    if (!fileData?.processedData?.pages) return [];

    return fileData.processedData.pages.map((page, pageIndex) => {
      const groupedElements = [];
      let currentParagraph = null;

      // Add a uniqueId to each element for the React key
      const elementsWithKeys = page.elements.map((el, i) => ({
        ...el,
        uniqueId: `p${pageIndex}-el${i}`,
      }));

      for (const element of elementsWithKeys) {
        // IF: it's a paragraph text span...
        if (element.type === "text" && element.isParagraph) {
          if (currentParagraph === null) {
            // Start a new paragraph
            currentParagraph = {
              type: "paragraph", // <-- Our new element type
              elements: [element],
              position: { ...element.position }, // Starts with first span's position
              zIndex: element.zIndex,
              textAlign: element.textAlign,
              uniqueId: `p${pageIndex}-para${groupedElements.length}`,
            };
          } else {
            // Add this span to the current paragraph
            currentParagraph.elements.push(element);

            // Expand the paragraph's bounding box to include this span
            currentParagraph.position.x0 = Math.min(
              currentParagraph?.position?.x0,
              element?.position?.x0
            );
            currentParagraph.position.y0 = Math.min(
              currentParagraph?.position?.y0,
              element?.position?.y0
            );
            currentParagraph.position.x1 = Math.max(
              currentParagraph?.position?.x1,
              element?.position?.x1
            );
            currentParagraph.position.y1 = Math.max(
              currentParagraph?.position?.y1,
              element?.position?.y1
            );
          }
        }
        // ELSE: it's an image, shape, line, or non-paragraph text...
        else {
          if (currentParagraph !== null) {
            // A paragraph was in progress. Finish it and push it.
            groupedElements.push(currentParagraph);
            currentParagraph = null; // Reset
          }
          // Push the current, non-paragraph element
          groupedElements.push(element);
        }
      }

      // After the loop, check if a paragraph is still open
      if (currentParagraph !== null) {
        groupedElements.push(currentParagraph);
      }

      return { ...page, elements: groupedElements };
    });
  }, [fileData]);

  // Effect to measure the container and set the scale
  useEffect(() => {
    const container = containerRef.current;

    // --- UPDATED LOGIC ---
    // Wait for the container AND the document data to be ready
    if (!container || !fileData?.processedData?.pages?.[0]) {
      return;
    }
    // --- END UPDATE ---

    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const newWidth = entry.contentRect.width;

        // --- UPDATED LOGIC ---
        // Ensure data exists before accessing it
        const firstPage = fileData?.processedData.pages[0];
        if (firstPage && firstPage.dimensions.width > 0) {
          setScale(newWidth / firstPage.dimensions.width);
        }
        // --- END UPDATE ---
      }
    });

    resizeObserver.observe(container);

    // Cleanup observer on component unmount
    return () => resizeObserver.disconnect();

    // --- UPDATED DEPENDENCY ARRAY ---
  }, [fileData]);

  // Keep track of the last triggered anchor to prevent duplicate plays
  const lastTriggeredRef = useRef(null);

  // Scroll Detection Logic
  useEffect(() => {
    if (isEditing || anchors.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const elementId = entry.target.getAttribute("data-id");
            const idToMatch =
              elementId || entry.target.id.replace("element-", "");

            const anchor = anchors.find((a) => a.elementId === idToMatch);

            if (anchor) {
              if (lastTriggeredRef.current !== anchor.elementId) {
                // console.log(`🎵 Switching track: "${anchor.trackName}" (Anchor: ${idToMatch})`);
                playTrack(anchor.trackUri, anchor.deviceId);
                lastTriggeredRef.current = anchor.elementId;
              } else {
                // console.log(`Skipping duplicate trigger for anchor: ${idToMatch}`);
              }
            }
          }
        });
      },
      {
        root: null,
        // Trigger when the element crosses the line 50% from the bottom (i.e., enters the top half of the screen)
        // Top margin -10% means we ignore the very top 10% (header area)
        rootMargin: "-10% 0px -50% 0px",
        threshold: 0,
      }
    );

    // Observe all anchored elements
    anchors.forEach((anchor) => {
      const element = document.getElementById(`element-${anchor.elementId}`);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, [anchors, isEditing, playTrack, loading, groupedPages]);

  const handleElementClick = (elementId) => {
    if (!isEditing) return;
    if (onElementClick) {
      onElementClick(elementId);
    }
  };

  if (loading) return <Loader />;
  if (error)
    return (
      <Box className="text-center text-red-500 p-8 bg-red-50 rounded-lg">
        {error}
      </Box>
    );
  if (!fileData)
    return (
      <Box className="text-center text-gray-500 p-8">
        No document data available.
      </Box>
    );

  return (
    // This outer Box is the responsive container we measure
    <>
      {groupedPages.map((page, pageIndex) => {
        const aspectRatio = `${page.dimensions.width} / ${page.dimensions.height}`;

        return (
          <Box
            key={pageIndex}
            className="pdf-page"
            component={motion.div} // <--- Animate the Page Container
            initial={{ opacity: 0.2 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.1 }} // Trigger when 10% of page is visible
            transition={{ duration: 0.5 }}
            sx={{
              width: "100%",
              aspectRatio: aspectRatio,
              position: "relative",
              marginBottom: 4, // Add some spacing between pages for better scroll feel
              // ... your other page styles
              // backgroundColor: "transparent",
            }}
          >
            {page.orientation && (
              // ... your Chip component (no changes)
              <Chip
                label={
                  page.orientation.charAt(0).toUpperCase() +
                  page.orientation.slice(1)
                }
                size="small"
                sx={{
                  position: "absolute",
                  top: 8,
                  right: 8,
                  zIndex: 9999,
                  backgroundColor: "rgba(0, 0, 0, 0.6)",
                  color: "white",
                }}
              />
            )}

            {/* Background Layer: Original PDF PNG */}
            {(viewMode === "hybrid" || viewMode === "original") &&
              page.pngUrl && (
                <img
                  src={page.pngUrl}
                  alt={`Page ${pageIndex + 1} Original Render`}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    zIndex: 0, // Base layer
                    opacity: 1,
                    pointerEvents: "none",
                    objectFit: "contain",
                  }}
                />
              )}

            {/* The elements array now contains grouped paragraphs */}
            {(viewMode === "hybrid" || viewMode === "extracted") &&
              page.elements.map((element) => {
                const isAnchored = anchors.some(
                  (a) => a.elementId === element.uniqueId
                );
                return (
                  <PDFPage
                    key={element.uniqueId} // <-- Use the new stable key
                    element={element}
                    scale={scale}
                    styleMap={styleMap}
                    pageIndex={pageIndex}
                    onElementClick={() => handleElementClick(element.uniqueId)}
                    isEditing={isEditing}
                    isAnchored={isAnchored}
                  />
                );
              })}
          </Box>
        );
      })}
      {/* {JSON.stringify(fileData?.processedData)} */}
    </>
  );
}

import { useSoundtrack } from "@/context/SoundtrackContext";
import { useSpotifyPlayer } from "@/lib/spotify/useSpotifyPlayer";

export default function PdfViewer(props) {
  return <PdfViewerContent {...props} />;
}
