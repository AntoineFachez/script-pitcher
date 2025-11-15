// file path: ~/DEVFOLD/SCRIPT-PITCHER/SRC/WIDGETS/USERS/USERSLIST.JS

import React from "react";
import {
  Box,
  Chip,
  IconButton,
  List,
  ListItem,
  Typography,
} from "@mui/material";
import {
  flexListItemStyles,
  flexListStyles,
  subtitleStyles,
} from "@/theme/muiProps";

import FilesListItem from "../../app/projects/elements/FilesListItem";
import {
  Add,
  Favorite,
  Person,
  PersonOff,
  Public,
  PublicOff,
  Share,
} from "@mui/icons-material";
import BasicCard from "@/components/card/BasicCard";
import KebabMenu from "@/components/menus/KebabMenu";
import ShareButton from "@/components/share/ShareButton";

import { useUi } from "@/context/UiContext";
import { useInFocus } from "@/context/InFocusContext";
import { useData } from "@/context/DataContext";

export default function UsersList({
  data,

  schemeDefinition,
  handleClickAvatar,
  handleClickTitle,
  handleClickSubTitle,
  handleClickEdit,
  handleAddFile,
  handleToggleActiveUser,
  genreInFocus,
  emailSubject,
  emailBody,
}) {
  const { toggleDetails } = useUi();
  const { rolesInProjects } = useData();
  const { userInFocus } = useInFocus();

  const CustomList = ({ rolesInProjects }) => {
    return (
      <Box
        sx={{ width: "100%", backgroundColor: "primary.dark" }}
        className="customList"
      >
        <Box
          component="nav"
          sx={{ width: "100%", display: "flex", justifyContent: "flex-end" }}
        >
          <IconButton onClick={() => handleAddFile(rolesInProjects)}>
            <Add />
          </IconButton>
        </Box>
        <List
          sx={{ width: "100%", backgroundColor: "primary.dark" }}
          className="filesList"
        >
          {rolesInProjects?.files?.map((file, i) => {
            return <FilesListItem key={i} file={file} />;
          })}
        </List>
      </Box>
    );
  };

  return (
    <List sx={{ ...flexListStyles.sx, alignItems: "flex-start" }}>
      {data?.map((user, i) => {
        const customSubTitleItem = [
          <Chip
            key={user.userId}
            sx={subtitleStyles.sx}
            variant="body1"
            label={user.role}
          />,
        ];
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
              onClick={() => handleToggleActiveUser(user)}
              color="success"
              sx={{
                color: user?.userActive ? "success.main" : "warning.main",
              }}
            >
              {user?.userActive ? <Person /> : <PersonOff />}
            </IconButton>
          </>
        );
        const actions = footerActions();
        const kebabActions = [
          {
            action: () => handleClickEdit(user),
            icon: "Edit",
            loading: false,
          },
          {
            action: () => handleToggleActiveUser(user),
            icon: user.published ? "Person" : "PersonOff",
            loading: false,
          },
        ];
        const cardProps = {
          showCardMedia: false,
          schemeDefinition,
          handleClickAvatar,
          handleClickTitle,
          handleClickSubTitle,
          subTitleInFocus: genreInFocus,
          customSubTitleItem,
          headerActions: <KebabMenu actions={kebabActions} />,
          actions,
        };
        return (
          <>
            <BasicCard
              key={`${i}${user?.userId}`}
              item={user}
              itemInFocus={userInFocus}
              collection={"users"}
              disablePadding
              schemeDefinition={schemeDefinition}
              customItem={<CustomList rolesInProjects={rolesInProjects} />}
              cardProps={cardProps}
              toggleDetails={toggleDetails}
            />
          </>
        );
      })}
    </List>
  );
}
