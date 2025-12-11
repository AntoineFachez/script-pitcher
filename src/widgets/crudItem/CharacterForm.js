// file path: ~/DEVFOLD/SCRIPT-PITCHER/SRC/WIDGETS/CRUDITEM/CHARACTERFORM.JS

"use client";
import { useEffect, useState } from "react";
import { TextField } from "@mui/material";
import { useInFocus } from "@/context/InFocusContext";
import { useUi } from "@/context/UiContext"; // Still needed if you close modal on success
import BaseCrudForm from "./BaseCrudForm"; // The wrapper
import { useCrudSubmit } from "@/hooks/useCrudSubmit"; // The logic

export default function CharacterForm({ crud }) {
  const { characterInFocus } = useInFocus();
  const { setOpenModal } = useUi();

  // 1. Setup State
  const [formData, setFormData] = useState({
    name: "",
    archetype: "",
    description: "",
    imageUrl: "",
    avatarUrl: "",
  });

  // 2. Determine IDs
  // If creating, we assume characterInFocus holds the parent Project info, or we pass projectId as a prop
  const projectId =
    crud === "create"
      ? characterInFocus?.projectId
      : characterInFocus?.projectId;
  const entityId = characterInFocus?.id;

  // 3. Use the Logic Hook
  const { submit, loading, error, success } = useCrudSubmit(
    "/api/characters",
    crud,
    entityId,
    projectId
  );

  // 4. Pre-fill Data
  useEffect(() => {
    if (crud === "update" && characterInFocus) {
      setFormData({ ...characterInFocus });
    }
  }, [crud, characterInFocus]);

  // 5. Handle Handlers
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
      setTimeout(() => setOpenModal(false), 1000); // Close after delay
    }
  };

  return (
    <BaseCrudForm
      title={crud === "create" ? "Create Character" : "Edit Character"}
      formData={formData}
      setFormData={setFormData} // Allows Drawer to update this state
      onSubmit={handleSubmit}
      loading={loading}
      error={error}
      success={success}
    >
      {/* Only Specific Inputs live here now */}
      <TextField
        label="Character Name"
        name="name"
        value={formData.name || ""}
        onChange={handleChange}
        required
      />
      <TextField
        label="Archetype"
        name="archetype"
        value={formData.archetype || ""}
        onChange={handleChange}
      />
      <TextField
        label="Description"
        name="description"
        value={formData.description || ""}
        onChange={handleChange}
        multiline
        rows={3}
      />
    </BaseCrudForm>
  );
}
