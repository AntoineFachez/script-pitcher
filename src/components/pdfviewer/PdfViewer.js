"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import Image from "next/image";
import { Box, Chip, Divider } from "@mui/material";
import { useDocument } from "@/context/DocumentContext";
import PDFPage from "./PDFPage";

// A simple loading spinner component
const Loader = () => (
  <Box className="flex justify-center items-center p-12">
    <Box className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></Box>
  </Box>
);

// The main viewer component
export default function PdfViewer() {
  const { documentData, loading, error } = useDocument();
  const containerRef = useRef(null);
  const [scale, setScale] = useState(0.1);

  // Memoize the style map for efficiency
  const styleMap = useMemo(() => {
    if (!documentData?.processedData?.stylesheet) return {};
    return Object.values(documentData?.processedData?.stylesheet).reduce(
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
  }, [documentData]);

  const groupedPages = useMemo(() => {
    if (!documentData?.processedData?.pages) return [];

    return documentData.processedData.pages.map((page, pageIndex) => {
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
              currentParagraph.position.x0,
              element.position.x0
            );
            currentParagraph.position.y0 = Math.min(
              currentParagraph.position.y0,
              element.position.y0
            );
            currentParagraph.position.x1 = Math.max(
              currentParagraph.position.x1,
              element.position.x1
            );
            currentParagraph.position.y1 = Math.max(
              currentParagraph.position.y1,
              element.position.y1
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
  }, [documentData]);

  // Effect to measure the container and set the scale
  useEffect(() => {
    const container = containerRef.current;

    // --- UPDATED LOGIC ---
    // Wait for the container AND the document data to be ready
    if (!container || !documentData?.processedData?.pages?.[0]) {
      return;
    }
    // --- END UPDATE ---

    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const newWidth = entry.contentRect.width;

        // --- UPDATED LOGIC ---
        // Ensure data exists before accessing it
        const firstPage = documentData?.processedData.pages[0];
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
  }, [documentData]);

  if (loading) return <Loader />;
  if (error)
    return (
      <Box className="text-center text-red-500 p-8 bg-red-50 rounded-lg">
        {error}
      </Box>
    );
  if (!documentData)
    return (
      <Box className="text-center text-gray-500 p-8">
        No document data available.
      </Box>
    );

  return (
    // This outer Box is the responsive container we measure
    <Box
      ref={containerRef}
      className="pdf"
      sx={{
        position: "relative",
        width: "100%",
        height: "100%",
        display: "flex",
        flexFlow: "column nowrap",
        // justifyContent: "center",
        // alignItems: "center",

        overflow: "scroll",
        // backgroundColor: "pink",
        gap: 2,
      }}
    >
      {groupedPages.map((page, pageIndex) => {
        const aspectRatio = `${page.dimensions.width} / ${page.dimensions.height}`;

        return (
          <Box
            key={pageIndex}
            className="pdf-page"
            sx={{
              width: "100%",
              aspectRatio: aspectRatio,
              position: "relative",
              // ... your other page styles
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
            {/* The elements array now contains grouped paragraphs */}
            {page.elements.map((element) => {
              return (
                <PDFPage
                  key={element.uniqueId} // <-- Use the new stable key
                  element={element}
                  scale={scale}
                  styleMap={styleMap}
                  pageIndex={pageIndex}
                />
              );
            })}
          </Box>
        );
      })}
      {/* {JSON.stringify(documentData?.processedData)} */}
    </Box>
  );
}
