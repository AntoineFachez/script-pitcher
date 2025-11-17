// file path: ~/DEVFOLD/SCRIPT-PITCHER/SRC/APP/PROJECTS/PAGE.JS

"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Box, Typography } from "@mui/material";

// Global Contexts
import { useApp } from "@/context/AppContext";
import { useData } from "@/context/DataContext";
import { useInFocus } from "@/context/InFocusContext";
import { useUi } from "@/context/UiContext";

// Components
import BasicModal from "@/components/modal/Modal";

// Widgets
import CrudItem from "@/widgets/crudItem";
import ProjectsWidget from "@/widgets/projects";

// Server Actions
import { toggleProjectPublishState } from "@/lib/actions/projectActions";

// Local elements
import Menu from "./elements/Menu";
import GernresList from "./elements/GernresList";

// Styles
import { pageStyles, titleStyle } from "@/theme/muiProps";

export default function ProjectsPage({ initialData }) {
  const { appContext, setAppContext } = useApp();
  const {
    modalContent,
    setModalContent,
    openModal,
    setOpenModal,
    toggleDetails,
    showPublishedProjects,
    setShowPublishedProjects,
  } = useUi();

  const { setProjectInFocus, genreInFocus, setGenreInFocus } = useInFocus();

  // 1. Get MASTER data from the global DataContext
  // This 'projects' is the object from your user's summary doc.
  const {
    projects,
    users,
    setInitialData,
    isLoading: isDataLoading,
  } = useData();

  // 2. Manage all LOCAL UI state here
  const [filteredData, setFilteredData] = useState([]);

  // 3. The 'projects' from context is already an array. No conversion needed.
  const projectsList = useMemo(() => projects || [], [projects]);

  // 4. Perform all filtering here, in the page
  const uniqueGenres = useMemo(() => {
    const allGenres = projectsList?.flatMap(
      (project) => project.genres?.map((g) => g.genre) || []
    );
    return [...new Set(allGenres)];
  }, [projectsList]);

  const displayedData = useMemo(() => {
    let data = projectsList;
    if (showPublishedProjects) {
      data = data.filter((project) => project.published === true);
    }
    if (genreInFocus) {
      data = data.filter((project) =>
        project.genres?.some((g) => g.genre === genreInFocus)
      );
    }
    return data;
  }, [projectsList, showPublishedProjects, genreInFocus]);

  // --- 5. Define all handlers here ---

  const handleGenreClick = (genre) => {
    setGenreInFocus(genre);
  };

  const clearFilter = () => {
    setGenreInFocus(null);
  };

  const handleFilterByPublish = () => {
    setShowPublishedProjects((prev) => !prev);
  };

  // This is now an async Server Action
  const handleTogglePublish = async (project) => {
    // We call the action and trust it will revalidate the data
    await toggleProjectPublishState(project.id, !project.published);
    // The onSnapshot listener in DataContext will update the UI automatically.
  };

  const menuActions = [
    {
      action: handleFilterByPublish,
      label: showPublishedProjects ? "Show All" : "Only Published",
      startIcon: showPublishedProjects ? null : "Public",
    },
  ];

  useEffect(() => {
    setModalContent(<CrudItem context={appContext} crud="create" />);

    return () => {};
  }, [appContext, setModalContent]);
  useEffect(() => {
    // On initial render, populate the DataContext with server-fetched data
    if (initialData) {
      setInitialData(initialData.projects, initialData.users);
    }
    // The empty dependency array ensures this runs only once on mount.
  }, [initialData, setInitialData]);

  useEffect(() => {
    setAppContext("projects");
    return () => {};
  }, [setAppContext]);

  return (
    <Box sx={{ ...pageStyles.sx }}>
      <Typography variant={titleStyle.variant} sx={titleStyle.sx}>
        Projects
      </Typography>
      <Menu menuActions={menuActions} />
      {toggleDetails && (
        <GernresList
          uniqueGenres={uniqueGenres}
          genreInFocus={genreInFocus}
          clearFilter={clearFilter}
          handleGenreClick={handleGenreClick}
        />
      )}
      <BasicModal
        content={modalContent}
        open={openModal}
        setOpen={setOpenModal}
      />
      {/* Pass all data and handlers down to the "dumb" widget.
        We rename the `index.js` wrapper to `ProjectsWidget` for clarity.
      */}
      <Box sx={{ height: "100%" }}>
        <ProjectsWidget
          data={displayedData}
          filteredData={filteredData}
          setFilteredData={setFilteredData}
          isLoading={isDataLoading}
          // Pass handlers
          // onAddFile={handleAddFile}
          // onEditProject={handleClickEdit}
          onTogglePublish={handleTogglePublish}
          onSetGenreFocus={handleGenreClick}
          // ...pass other handlers like onAvatarClick etc.
        />
      </Box>
    </Box>
  );
}
