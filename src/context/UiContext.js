// file path: ~/DEVFOLD/SCRIPT-PITCHER/SRC/CONTEXT/UICONTEXT.JS

"use client";
import { createContext, useContext, useState, useEffect, useMemo } from "react";

// 1. Create the context
const UiContext = createContext(null);

// 2. Create the Provider component
export function UiProvider({ documentId, children }) {
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

  const handleOpenAddItem = () => {
    setOpenModal(true);
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
      handleOpenAddItem,
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
