// file path: ~/DEVFOLD/SCRIPT-PITCHER/SRC/WIDGETS/CRUDITEM/INDEX.JS

"use client";
import { useEffect } from "react";

import { useCrud } from "@/context/CrudItemContext";
import { useInFocus } from "@/context/InFocusContext";

import ProjectForm from "./ProjectForm";
import AddFileForm from "./AddFileForm";
import UserForm from "./UserForm";
import InviteUserForm from "./InviteUserForm";
import CharacterForm from "./CharacterForm";
import EpisodeForm from "./EpisodesForm";
/**
 * Main wrapper for the CRUD modal.
 * It selects the correct form based on context and crud props.
 * @param {string} context - 'newProject', 'newFile', or 'newUser'
 * @param {string} crud - 'create', 'update', or 'add'
 */
export default function CrudItem({ context, crud, itemInFocus, type }) {
  console.log("CrudItem", context, crud, itemInFocus);

  const { projectInFocus } = useInFocus(); // This wrapper only needs to know about projects
  const { setCrudProject } = useCrud();

  // Pre-fill form for 'update'
  useEffect(() => {
    // This effect is project-specific and will only run for project updates
    if (context === "projects" && crud === "update" && projectInFocus) {
      // When editing, load the projectInFocus data into the draft state
      setCrudProject(projectInFocus);
    }
  }, [context, crud, projectInFocus, setCrudProject]);

  // if (type === "bannerImage") {
  //   console.log("bannerImage");
  //   // 'create' or 'update' a project
  //   return;
  // }
  if (context === "projects") {
    // 'create' or 'update' a project
    return <ProjectForm crud={crud} projectInFocus={itemInFocus} />;
  }

  if (context === "files" && crud === "add") {
    // 'add' a file to an existing project
    return <AddFileForm />;
  }
  if (context === "characters") {
    // 'create' or 'update' a project
    return <CharacterForm crud={crud} />;
  }
  if (context === "episodes") {
    // 'create' or 'update' a project
    return <EpisodeForm crud={crud} />;
  }
  if (context === "users" && crud === "inviteUser") {
    // 'inviteUser' a user to a project
    return <InviteUserForm crud={crud} />;
  }
  if (context === "users" || context === "me") {
    // 'create' or 'update' a project
    return <UserForm crud={crud} />;
  }
  // if (context === "users" && crud === "create") {
  //   // 'create' or 'update' a project
  //   return <UserForm crud={crud} />;
  // }
  // if (context === "me" && crud === "update") {
  //   // 'create' or 'update' a project
  //   return <UserForm crud={crud} />;
  // }

  // <-- 2. ADD THE NEW CONTEXT BLOCK -->
  // if (context === "me") {
  //   // 'update' my profile
  //   return <UserForm crud={crud} />;
  // }

  return null; // Or some error/fallback UI
}
