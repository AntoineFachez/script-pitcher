// file path: ~/DEVFOLD/SCRIPT-PITCHER/SRC/WIDGETS/CRUDITEM/EPISODESFORM.JS

"use client";

import { useEffect, useState } from "react";
import { TextField } from "@mui/material";

import { useInFocus } from "@/context/InFocusContext";
import { useUi } from "@/context/UiContext";

// Shared Architecture
import BaseCrudForm from "./BaseCrudForm";
import { useCrudSubmit } from "@/hooks/useCrudSubmit";

export default function EpisodeForm({ crud }) {
  const { episodeInFocus } = useInFocus();
  const { setOpenModal } = useUi();

  // 1. DATA STATE
  // We only manage the fields specific to an Episode here
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    imageUrl: "",
    avatarUrl: "",
  });

  // 2. ID LOGIC
  // Determine the Project ID and Entity ID based on the mode
  const projectId =
    crud === "create" ? episodeInFocus?.projectId : episodeInFocus?.projectId;
  const entityId = episodeInFocus?.id;

  // 3. API HOOK
  // Handles loading, error, success, and the actual Fetch call
  const { submit, loading, error, success } = useCrudSubmit(
    "/api/episodes",
    crud,
    entityId,
    projectId
  );

  // 4. PRE-FILL DATA
  useEffect(() => {
    if (crud === "update" && episodeInFocus) {
      // setFormData({
      //   title: episodeInFocus.title || "",
      //   description: episodeInFocus.description || "",
      //   imageUrl: episodeInFocus.imageUrl || "",
      //   avatarUrl: episodeInFocus.avatarUrl || "",
      // });
      setFormData({
        ...episodeInFocus,
      });
    }
  }, [crud, episodeInFocus]);

  // 5. HANDLERS
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isSuccess = await submit(formData);
    if (isSuccess) {
      // Optional: Close modal automatically after a short delay on success
      setTimeout(() => setOpenModal(false), 1000);
    }
  };

  return (
    <BaseCrudForm
      title={crud === "create" ? "Create Episode" : "Edit Episode"}
      formData={formData}
      setFormData={setFormData} // Allows the Base component's Drawer to update images
      onSubmit={handleSubmit}
      loading={loading}
      error={error}
      success={success}
    >
      {/* --- CONTENT SPECIFIC TO EPISODES --- */}
      <TextField
        label="Episode Title"
        name="title"
        value={formData.title}
        onChange={handleChange}
        required
      />

      <TextField
        label="Description"
        name="description"
        value={formData.description}
        onChange={handleChange}
        multiline
        rows={3}
      />
    </BaseCrudForm>
  );
}
