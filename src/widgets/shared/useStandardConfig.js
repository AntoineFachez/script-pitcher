import React from "react";
import { Public, PublicOff, Edit, Delete, Add } from "@mui/icons-material";
import KebabMenu from "@/components/menus/KebabMenu";
import StandardCardFooter from "./StandardCardFooter";

export function useStandardConfig() {
  const createRowActions = ({
    canAdd = true,
    canDelete = true,
    canToggle = true,
    onAdd,
    onDelete,
    onToggle,
    toggleLabel = (published) =>
      published ? "Hide Project" : "Publish Project",
    toggleIcon = (published) => (published ? "Public" : "PublicOff"), // String for KebabMenu?
  } = {}) => {
    return {
      header: "",
      width: 40,
      disableColumnMenu: true,
      menu: (param) => {
        const actions = [];

        if (canAdd) {
          actions.push({
            id: "addDocument",
            name: "Add Document",
            icon: "Add",
            action: () => onAdd && onAdd(param),
          });
        }

        if (canDelete) {
          actions.push({
            id: "deleteCollection",
            name: "Delete Collection",
            icon: "Delete",
            action: () => onDelete && onDelete(param),
          });
        }

        if (canToggle) {
          const isPublished = param.published; // Assuming 'published' is the field
          actions.push({
            id: "toggleStatus",
            name: toggleLabel(isPublished),
            icon: toggleIcon(isPublished),
            sx: isPublished ? { color: "success.main" } : { color: "#aaa" },
            action: () => onToggle && onToggle(param),
          });
        }

        return <KebabMenu actions={actions} />;
      },
    };
  };

  return {
    createRowActions,
    StandardCardFooter,
  };
}
