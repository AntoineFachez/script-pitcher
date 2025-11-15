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

export default function FilesList({
  data,
  schemeDefinition,
  handleClickAvatar,
  handleClickTitle,
  handleClickSubTitle,
  handleClickEdit,
  handleAddFile,
  handleTogglePublishFile,
  genreInFocus,
  emailSubject,
  emailBody,
}) {
  const { showCardMedia, toggleDetails } = useUi();
  const { projectInFocus } = useInFocus();

  const CustomList = ({ file }) => {
    return (
      <Box
        sx={{ width: "100%", backgroundColor: "primary.dark" }}
        className="customList"
      >
        <Box
          component="nav"
          sx={{ width: "100%", display: "flex", justifyContent: "flex-end" }}
        >
          <IconButton onClick={() => handleAddFile(file)}>
            <Add />
          </IconButton>
        </Box>
        <List
          sx={{ width: "100%", backgroundColor: "primary.dark" }}
          className="filesList"
        >
          {/*
          //TODO: set to Users with access
           {project?.files?.map((file, i) => {
            return <FilesListItem key={i} file={file} />;
          })} */}
        </List>
      </Box>
    );
  };

  return (
    <>
      <List sx={{ ...flexListStyles.sx, alignItems: "flex-start" }}>
        {data?.map((file) => {
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
                onClick={() => handleTogglePublishFile(file)}
                color="success"
                sx={{
                  color: file?.published ? "success.main" : "",
                }}
              >
                {file?.published ? <Public /> : <PublicOff />}
              </IconButton>
            </>
          );
          const actions = footerActions();
          const kebabActions = [
            {
              action: () => handleClickEdit(file),
              icon: "Edit",
              loading: false,
            },
            {
              action: () => handleTogglePublishFile(file),
              icon: file.published ? "Public" : "PublicOff",
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
              key={file.id}
              cardProps={cardProps}
              item={file}
              itemInFocus={projectInFocus}
              collection={"projects"}
              disablePadding
              schemeDefinition={schemeDefinition}
              customItem={<CustomList file={file} />}
              toggleDetails={toggleDetails}
            />
          );
        })}
      </List>
    </>
  );
}
