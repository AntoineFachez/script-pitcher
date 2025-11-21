// hooks/useDeviceDetection.js

import { useState, useEffect } from "react";

const DESKTOP_BREAKPOINT = 1024; // Tailwind's 'lg' or a custom value

/**
 * Custom hook to detect the current device type based on window width.
 * @returns {object} An object containing boolean flags for device types.
 */
export function useDeviceDetection() {
  const [deviceType, setDeviceType] = useState("desktop");
  const [width, setWidth] = useState(0);

  useEffect(() => {
    // Function to calculate and set the device type
    const handleResize = () => {
      const currentWidth = window.innerWidth;
      setWidth(currentWidth);

      if (currentWidth < DESKTOP_BREAKPOINT) {
        // You could add another breakpoint here for 'tablet' (e.g., < 768)
        setDeviceType("mobile");
      } else {
        setDeviceType("desktop");
      }
    };

    // Set initial state
    handleResize();

    // Attach event listener for window resizing
    window.addEventListener("resize", handleResize);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []); // Empty dependency array ensures this runs only once on mount

  return {
    isMobile: deviceType === "mobile",
    isDesktop: deviceType === "desktop",
    width,
  };
}
