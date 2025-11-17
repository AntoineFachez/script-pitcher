// file path: ~/DEVFOLD/SCRIPT-PITCHER/SRC/APP/PROJECTS/PROJECTSCLIENTPAGE.JS
"use client";

import React, { useEffect, useMemo, useState, useOptimistic } from "react";
import { Box } from "@mui/material";

// Global Contexts
import { useApp } from "@/context/AppContext";
// ⭐️ We no longer need useData() for fetching projects/users
import { useInFocus } from "@/context/InFocusContext";
import { useUi } from "@/context/UiContext";

// Components
import BasicModal from "@/components/modal/Modal";
import CrudItem from "@/widgets/crudItem";
import ProjectsWidget from "@/widgets/projects";

// Server Actions
import { toggleProjectPublishState } from "@/lib/actions/projectActions";

// Local elements
import Menu from "./elements/Menu"; // Moved from parent
import GernresList from "./elements/GernresList";

// (Make sure to import your styles)
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

  const { setProjectInFocus, genreInFocus, setGenreInFocus } = useInFocus();

  // 1. Use 'useOptimistic' to manage the projects list
  // It will instantly show the "new" state, then revert if the action fails.
  const [optimisticProjects, setOptimisticProjects] = useOptimistic(
    serverProjects || [],
    (currentProjects, { projectId, newPublishedState }) => {
      // This is the "optimistic" update function
      return currentProjects.map((p) =>
        p.id === projectId ? { ...p, published: newPublishedState } : p
      );
    }
  );

  // 2. Manage all LOCAL UI state here (users are not mutated, so useState is fine)
  const [users, setUsers] = useState(serverUsers || []);
  const [filteredData, setFilteredData] = useState([]); // This seems for a different feature

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

  // This is our new Server Action handler
  const handleTogglePublish = async (project) => {
    const newPublishedState = !project.published;

    // 1. Instantly update the UI
    setOptimisticProjects({
      projectId: project.id,
      newPublishedState: newPublishedState,
    });

    // 2. Call the server action.
    // The server will revalidate the data, and Next.js will
    // merge the "real" data with your optimistic state.
    await toggleProjectPublishState(project.id, newPublishedState);
  };

  const menuActions = [
    {
      action: handleFilterByPublish,
      label: showPublishedProjects ? "Show All" : "Only Published",
      startIcon: showPublishedProjects ? null : "Public",
    },
  ];

  // 5. Cleanup Obsolete Effects
  // ❌ DELETED: useEffect for setModalContent (moved to where it's needed)
  // ❌ DELETED: useEffect for setInitialData (data now comes from props)

  useEffect(() => {
    setAppContext("projects");
    return () => {};
  }, [setAppContext]);

  return (
    <>
      {/* This <Menu> was in the server component, but since its actions
        depend on client state (showPublishedProjects), it belongs here.
      */}
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
      <Box sx={{ height: "100%" }}>
        <ProjectsWidget
          data={displayedData}
          filteredData={filteredData}
          setFilteredData={setFilteredData}
          isLoading={false} // Data is pre-fetched, so it's never loading here
          onTogglePublish={handleTogglePublish}
          onSetGenreFocus={handleGenreClick}
        />
      </Box>
    </>
  );
}
