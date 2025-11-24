// file path: ~/DEVFOLD/SCRIPT-PITCHER/SRC/CONTEXT/UICONTEXT.JS

"use client";
import { createContext, useContext, useState, useEffect, useMemo } from "react";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { useApp } from "./AppContext";
import CrudItem from "@/widgets/crudItem";
// 1. Create the context
const UiContext = createContext(null);

// 2. Create the Provider component
export function UiProvider({ documentId, children }) {
  const { appContext } = useApp();
  const theme = useTheme();
  // 1. Define only the 'up' checks (>= breakpoints).
  // These are the only media queries you need to run.
  const isSmUp = useMediaQuery(theme.breakpoints.up("sm"));
  const isMdUp = useMediaQuery(theme.breakpoints.up("md"));
  const isLgUp = useMediaQuery(theme.breakpoints.up("lg"));
  const isXlUp = useMediaQuery(theme.breakpoints.up("xl"));
  const [currentWindowSize, setCurrentWindowSize] = useState("md");
  const [isDesktop, setIsDesktop] = useState(isLgUp);
  const [isMobile, setIsMobile] = useState(!isMdUp);

  const [uiData, setUiData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showDataGrid, setShowDataGrid] = useState(true);
  const [showNewProject, setShowNewProject] = useState(false);
  const [showNewFile, setShowNewFile] = useState(false);

  const [openModal, setOpenModal] = useState(true);

  const [modalContent, setModalContent] = useState(null);
  const [showPublishedProjects, setShowPublishedProjects] = useState(false);
  const [showActiveUsers, setShowActiveUsers] = useState(false);
  const [toggleDetails, setToggleDetails] = useState(true);
  const [showCardMedia, setShowCardMedia] = useState(true);
  const footerHeight = 60;

  const [orientationDrawer, setOrientationDrawer] = useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });

  const handleOpenAddItem = (crud = "create", itemInFocus = null) => {
    console.log("handleOpenAddItem", appContext, crud, itemInFocus);
    setModalContent(
      <CrudItem context={appContext} crud={crud} itemInFocus={itemInFocus} />
    );
    setOpenModal(true);
  };
  const handleToggleDrawer = (anchor, open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setOrientationDrawer({ ...orientationDrawer, [anchor]: open });
  };

  useEffect(() => {
    let size = "xs";

    // Check from largest to smallest to find the *active* breakpoint
    if (isXlUp) {
      size = "xl";
    } else if (isLgUp) {
      size = "lg";
    } else if (isMdUp) {
      size = "md";
    } else if (isSmUp) {
      size = "sm";
    }

    // A. Update the size string
    setCurrentWindowSize(size);

    // B. Update the booleans (using standard conventions)
    // Assuming Desktop is >= Lg and Mobile is < Md
    setIsDesktop(size === "lg" || size === "xl");
    setIsMobile(size === "xs" || size === "sm");

    console.log(`Viewport Change: ${size.toUpperCase()}`);
  }, [isSmUp, isMdUp, isLgUp, isXlUp]);

  const value = useMemo(
    () => ({
      uiData,
      currentWindowSize,
      isDesktop,
      isMobile,
      showDataGrid,
      setShowDataGrid,
      showNewProject,
      setShowNewProject,
      showNewFile,
      setShowNewFile,
      modalContent,
      setModalContent,
      openModal,
      setOpenModal,
      showPublishedProjects,
      setShowPublishedProjects,
      showActiveUsers,
      setShowActiveUsers,
      toggleDetails,
      setToggleDetails,
      showCardMedia,
      setShowCardMedia,
      footerHeight,
      orientationDrawer,
      handleOpenAddItem,
      handleToggleDrawer,
      loading,
      error,
    }),
    [
      uiData,
      currentWindowSize,
      isDesktop,
      isMobile,
      showDataGrid,
      setShowDataGrid,
      showNewProject,
      setShowNewProject,
      showNewFile,
      setShowNewFile,
      modalContent,
      setModalContent,
      openModal,
      setOpenModal,
      showPublishedProjects,
      setShowPublishedProjects,
      showActiveUsers,
      setShowActiveUsers,
      toggleDetails,
      setToggleDetails,
      showCardMedia,
      setShowCardMedia,
      footerHeight,
      orientationDrawer,
      handleToggleDrawer,
      loading,
      error,
    ]
  );

  return <UiContext.Provider value={value}>{children}</UiContext.Provider>;
}

export function useUi() {
  const context = useContext(UiContext);
  if (!context) {
    throw new Error("useUi must be used within a UiProvider");
  }
  return context;
}
