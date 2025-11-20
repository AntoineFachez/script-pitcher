// file path: ~/DEVFOLD/SCRIPT-PITCHER/SRC/APP/PROJECTS/PROJECTSCLIENTPAGE.JS

"use client";

import React, { useEffect, useMemo, useState, useOptimistic } from "react";
import { Box } from "@mui/material";

// Global Contexts
import { useApp } from "@/context/AppContext";
import { useInFocus } from "@/context/InFocusContext";
import { useUi } from "@/context/UiContext";
// ⭐️ DELETED: useUser() is no longer needed to get projects

// Components
import BasicModal from "@/components/modal/Modal";
import CrudItem from "@/widgets/crudItem";
import ProjectsWidget from "@/widgets/projects/ProjectsList";

// Server Actions
import { toggleProjectPublishState } from "@/lib/actions/projectActions";

// Local elements
import Menu from "./elements/Menu";
import GernresList from "./elements/GernresList";
// ⭐️ DELETED: useUser import

// Styles
// import { pageStyles, titleStyle } from "@/theme/muiProps";

// We receive the server-fetched data as props
export default function ProjectsClientPage({ serverProjects, serverUsers }) {
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
  // ⭐️ DELETED: const { myProjects } = useUser();
  const { setProjectInFocus, genreInFocus, setGenreInFocus } = useInFocus();

  // 1. --- START FIX ---
  // Use 'serverProjects' (from props) as the initial state for 'useOptimistic'
  const [optimisticProjects, setOptimisticProjects] = useOptimistic(
    serverProjects || [], // 👈 USE THE PROP HERE
    (currentProjects, { projectId, newPublishedState }) => {
      // This is the "optimistic" update function
      return currentProjects.map((p) =>
        p.id === projectId ? { ...p, published: newPublishedState } : p
      );
    }
  );
  // --- END FIX ---

  // 2. Use 'serverUsers' (from props) for the initial user state
  const [users, setUsers] = useState(serverUsers || []);
  const [filteredData, setFilteredData] = useState([]);

  // 3. Perform all filtering here, using the OPTIMISTIC data
  const uniqueGenres = useMemo(() => {
    const allGenres = optimisticProjects?.flatMap(
      (project) => project.genres?.map((g) => g.genre) || []
    );
    return [...new Set(allGenres)];
  }, [optimisticProjects]);

  const displayedData = useMemo(() => {
    let data = optimisticProjects;
    if (showPublishedProjects) {
      data = data.filter((project) => project.published === true);
    }
    if (genreInFocus) {
      data = data.filter((project) =>
        project.genres?.some((g) => g.genre === genreInFocus)
      );
    }
    return data;
  }, [optimisticProjects, showPublishedProjects, genreInFocus]);

  // --- 4. Define all handlers here ---

  const handleGenreClick = (genre) => setGenreInFocus(genre);
  const clearFilter = () => setGenreInFocus(null);
  const handleFilterByPublish = () => setShowPublishedProjects((prev) => !prev);

  // This Server Action handler is correct
  const handleTogglePublish = async (project) => {
    const newPublishedState = !project.published;

    // 1. Instantly update the UI
    setOptimisticProjects({
      projectId: project.id,
      newPublishedState: newPublishedState,
    });

    // 2. Call the server action
    await toggleProjectPublishState(project.id, newPublishedState);
  };

  const menuActions = [
    {
      action: handleFilterByPublish,
      label: showPublishedProjects ? "Show All" : "Only Published",
      startIcon: showPublishedProjects ? null : "Public",
    },
  ];

  // 5. Set app context
  useEffect(() => {
    setAppContext("projects");
    return () => {};
  }, [setAppContext]);

  // 6. Set modal content
  useEffect(() => {
    setModalContent(<CrudItem context={appContext} crud="create" />);
  }, [appContext, setModalContent]);

  return (
    <>
      {/* All client-side UI and interactivity lives here */}
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

      <ProjectsWidget
        data={displayedData}
        filteredData={filteredData}
        setFilteredData={setFilteredData}
        isLoading={false} // Data is pre-fetched
        onTogglePublish={handleTogglePublish}
        onSetGenreFocus={handleGenreClick}
      />
    </>
  );
}
