// file path: ~/DEVFOLD/SCRIPT-PITCHER/SRC/APP/PROJECTS/[PROJECTID]/PROJECTCLIENT.JS

"use client";
import React, { useEffect, useState } from "react";
import { Typography } from "@mui/material";
import { doc, onSnapshot, collection } from "firebase/firestore";

import { getFirebaseDb } from "@/lib/firebase/firebase-client";

import { useApp } from "@/context/AppContext";
import { useUi } from "@/context/UiContext";
import { useInFocus } from "@/context/InFocusContext";

import CrudItem from "@/widgets/crudItem";
import WidgetIndex from "@/widgets/projectProfile";

export default function ProjectClient({ initialProject, initialFiles }) {
  const projectId = initialProject?.id;
  const db = getFirebaseDb();

  const { appContext, setAppContext } = useApp();
  const { projectInFocus, setProjectInFocus } = useInFocus(initialProject);
  const { setModalContent } = useUi();

  const [files, setFiles] = useState(initialFiles);

  useEffect(() => {
    if (!projectInFocus?.id || !db) return;

    const projectRef = doc(db, "projects", projectInFocus?.id);

    const unsubscribe = onSnapshot(projectRef, (docSnap) => {
      if (docSnap.exists()) {
        setProjectInFocus({ id: docSnap.id, ...docSnap.data() });
      } else {
        setProjectInFocus(null);
      }
    });

    // Cleanup
    return () => unsubscribe();
  }, [db, projectInFocus?.id, setProjectInFocus]);

  useEffect(() => {
    if (initialProject && !projectInFocus) {
      setProjectInFocus(initialProject);
    }
  }, [initialProject, setProjectInFocus, projectInFocus]);

  useEffect(() => {
    setAppContext("projects");
    setProjectInFocus(initialProject);
    setModalContent(
      <CrudItem
        context={appContext}
        crud="inviteUser"
        profile={projectInFocus}
      />
    );

    return () => {};
  }, []);

  if (!projectId) {
    return <Typography>Project data error.</Typography>;
  }
  if (!projectInFocus) {
    return <Typography>Project not found.</Typography>;
  }
  return (
    <>
      <WidgetIndex
        initialProject={initialProject}
        initialFiles={initialFiles}
        projectInFocus={projectInFocus}
        files={files}
      />
    </>
  );
}
