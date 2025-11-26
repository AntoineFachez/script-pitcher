// file path: ~/DEVFOLD/SCRIPT-PITCHER/SRC/APP/(APP-DATA)/PROJECTS/PROJECTSCLIENTPAGE.JS

"use client";

import React, { useEffect, useMemo, useState, useOptimistic } from "react";
import { Box, Typography } from "@mui/material";

// Global Contexts
import { useApp } from "@/context/AppContext";
import { useData } from "@/context/DataContext";
import { useInFocus } from "@/context/InFocusContext";
import { useUi } from "@/context/UiContext";

// Components
import BasicModal from "@/components/modal/Modal";
import FilterBySelectList from "@/components/filterBySelect/FilterBySelectList";
import List from "@/widgets/projects/ProjectsList";

// Server Actions

// Configs
import { toggleProjectPublishState } from "@/lib/actions/projectActions";

// Local elements

import { pageMainProps, pageHeaderProps } from "@/theme/muiProps";

import config from "@/lib/widgetConfigs/projects.widgetConfig.json";
const { widgetConfig, schemeDefinition } = config;
// We receive the server-fetched data as props
export default function ProjectsClientPage({}) {
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
  const {
    projects,
    setProjects,
    setUsers,
    rolesInProjects,
    uniqueGenres,
    setUniqueGenres,
  } = useData();
  const { setProjectInFocus, genreInFocus, setGenreInFocus } = useInFocus();

  const [optimisticProjects, setOptimisticProjects] = useOptimistic(
    projects || [], // 👈 USE THE PROP HERE
    (currentProjects, { projectId, newPublishedState }) => {
      // This is the "optimistic" update function
      return currentProjects.map((p) =>
        p.id === projectId ? { ...p, published: newPublishedState } : p
      );
    }
  );

  const [filteredData, setFilteredData] = useState([]);

  // 3. Perform all filtering here, using the OPTIMISTIC data
  const extractUniqueGenres = useMemo(() => {
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
    setUniqueGenres(data);
    return data;
  }, [
    optimisticProjects,
    showPublishedProjects,
    genreInFocus,
    setUniqueGenres,
  ]);

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
  }, []);
  return (
    <>
      <Box
        {...pageHeaderProps}
        className={`${pageHeaderProps.className}__${widgetConfig.context}`}
      >
        {toggleDetails && (
          <FilterBySelectList
            array={extractUniqueGenres}
            itemInFocus={genreInFocus}
            clearFilter={clearFilter}
            handleClickFilter={handleGenreClick}
          />
        )}
      </Box>
      <Box
        {...pageMainProps}
        className={`${pageMainProps.className}__${widgetConfig.context}`}
      >
        <List
          data={displayedData}
          filteredData={filteredData}
          setFilteredData={setFilteredData}
          isLoading={false} // Data is pre-fetched
          onTogglePublish={handleTogglePublish}
          onSetGenreFocus={handleGenreClick}
        />
      </Box>
      <BasicModal
        content={modalContent}
        open={openModal}
        setOpen={setOpenModal}
      />{" "}
    </>
  );
}
