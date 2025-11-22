// file path: ~/DEVFOLD/SCRIPT-PITCHER/SRC/CONTEXT/UICONTEXT.JS

"use client";
import { createContext, useContext, useState, useEffect, useMemo } from "react";
// import useMediaQuery from "@mui/material/useMediaQuery";
// import { useTheme } from "@mui/material/styles";
import { useApp } from "./AppContext";
import CrudItem from "@/widgets/crudItem";
// 1. Create the context
const UiContext = createContext(null);

// 2. Create the Provider component
export function UiProvider({ documentId, children }) {
  const { appContext } = useApp();

  //TODO: finish device dependancies
  // const theme = useTheme();
  // // 'up' means: true if the screen width is greater than or equal to the breakpoint.
  // const isDesktop = useMediaQuery(theme.breakpoints.up("lg")); // Using MUI's 'lg' breakpoint (usually 1200px or 1024px depending on setup)

  // // 'down' means: true if the screen width is less than or equal to the breakpoint.
  // const isMobile = useMediaQuery(theme.breakpoints.down("md")); // Using MUI's 'md' breakpoint (usually 900px or 768px depending on setup)

  const [uiData, setUiData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showDataGrid, setShowDataGrid] = useState(false);
  const [showNewProject, setShowNewProject] = useState(false);
  const [showNewFile, setShowNewFile] = useState(false);

  const [openModal, setOpenModal] = useState(false);

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
  const value = useMemo(
    () => ({
      uiData,
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
