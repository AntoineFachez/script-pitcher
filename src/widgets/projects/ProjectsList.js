// file path: ~/DEVFOLD/SCRIPT-PITCHER/SRC/APP/PROJECTS/PROJECTSLIST.JS

import React from "react";
import { Box, IconButton, List } from "@mui/material";
import { Add, Favorite, Public, PublicOff, Share } from "@mui/icons-material";

import { useUi } from "@/context/UiContext";

import BasicCard from "@/components/card/BasicCard";
import KebabMenu from "@/components/menus/KebabMenu";
import ShareButton from "@/components/share/ShareButton";

import FilesListItem from "../../app/projects/elements/FilesListItem";

import { flexListStyles } from "@/theme/muiProps";
import { useInFocus } from "@/context/InFocusContext";

export default function ProjectsList({
  data,
  schemeDefinition,
  handleClickAvatar,
  handleClickTitle,
  handleClickSubTitle,
  handleClickEdit,
  handleAddFile,
  handleTogglePublishProject,
  genreInFocus,
  emailSubject,
  emailBody,
}) {
  const { showCardMedia, toggleDetails } = useUi();
  const { projectInFocus } = useInFocus();

  const CustomList = ({ project }) => {
    return (
      <Box
        sx={{ width: "100%", backgroundColor: "primary.dark" }}
        className="customList"
      >
        <Box
          component="nav"
          sx={{ width: "100%", display: "flex", justifyContent: "flex-end" }}
        >
          <IconButton onClick={() => handleAddFile(project)}>
            <Add />
          </IconButton>
        </Box>
        <List
          sx={{ width: "100%", backgroundColor: "primary.dark" }}
          className="filesList"
        >
          {project?.files?.map((file, i) => {
            return <FilesListItem key={i} file={file} />;
          })}
        </List>
      </Box>
    );
  };

  return (
    <>
      <List sx={{ ...flexListStyles.sx, alignItems: "flex-start" }}>
        {data?.map((project) => {
          const footerActions = () => (
            <>
              <IconButton aria-label="add to favorites">
                <Favorite />
              </IconButton>

              <ShareButton
                recipient="friend@example.com"
                subject={emailSubject}
                body={emailBody}
              >
                <Share />
              </ShareButton>
              <IconButton
                aria-label="publish"
                onClick={() => handleTogglePublishProject(project)}
                color="success"
                sx={{
                  color: project?.published ? "success.main" : "",
                }}
              >
                {project?.published ? <Public /> : <PublicOff />}
              </IconButton>
            </>
          );
          const actions = footerActions();
          const kebabActions = [
            {
              action: () => handleClickEdit(project),
              icon: "Edit",
              loading: false,
            },
            {
              action: () => handleTogglePublishProject(project),
              icon: project.published ? "Public" : "PublicOff",
              loading: false,
            },
          ];
          const cardProps = {
            schemeDefinition,
            handleClickAvatar,
            handleClickTitle,
            handleClickSubTitle,
            showCardMedia,
            subTitleInFocus: genreInFocus,
            headerActions: <KebabMenu actions={kebabActions} />,
            actions,
          };
          return (
            <BasicCard
              key={project.id}
              cardProps={cardProps}
              item={project}
              itemInFocus={projectInFocus}
              collection={"projects"}
              disablePadding
              schemeDefinition={schemeDefinition}
              customItem={<CustomList project={project} />}
              toggleDetails={toggleDetails}
            />
          );
        })}
      </List>
    </>
  );
}
