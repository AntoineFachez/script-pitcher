import React from "react";
import { IconButton } from "@mui/material";
import { Public, PublicOff } from "@mui/icons-material";
import ImageCell from "@/components/dataGridElements/ImageCell";
import RelativeTimeCell from "@/components/timeCells/RelativeTimeCell";
import { formatShortTime } from "@/hooks/useRelativeTime";
import { dataGridImageCellStyles, DEFAULT_COLUMN_WIDTHS } from "./constants";

export const createImageColumn = (field = "bannerUrl", headerName = "") => ({
  field,
  headerName,
  align: dataGridImageCellStyles.column.align,
  width: dataGridImageCellStyles.column.width,
  renderCell: (params) => {
    // Handle both direct url property or nested object property if needed,
    // but usually params.row[field] is the value.
    // However, the original code used params.row.bannerUrl or params.row.avatarUrl specifically.
    // We'll assume params.row[field] holds the URL string.
    const url = params.value;
    return (
      <ImageCell
        url={url}
        // Some existing code used 'avatarUrl' prop instead of 'url' for ImageCell in useFileConfig?
        // Checking useFileConfig: <ImageCell avatarUrl={avatarUrl} ... />
        // Checking useProjectConfig: <ImageCell url={bannerUrl} ... />
        // Checking useUserConfig: <ImageCell url={avatarUrl} ... />
        // We might need to standardize ImageCell usage or pass both if ImageCell supports it.
        // Assuming ImageCell takes 'url' as primary based on 2/3 usage.
        // If useFileConfig used avatarUrl, we might need to check ImageCell definition or just pass it as url.
        // For now, let's pass 'url' which seems standard.
        sx={dataGridImageCellStyles.sx}
      />
    );
  },
  disableColumnMenu: true,
});

export const createStatusColumn = (
  field = "published",
  headerName = "Published",
  isMobile = false,
  onToggle
) => ({
  field,
  headerName,
  align: "center",
  width: isMobile
    ? DEFAULT_COLUMN_WIDTHS.statusMobile
    : DEFAULT_COLUMN_WIDTHS.status,
  renderCell: (params) => {
    const { id } = params.row;
    const value = params.value;
    return (
      <IconButton
        aria-label="toggle status"
        onClick={(e) => {
          e.stopPropagation();
          e.defaultMuiPrevented = true;
          if (onToggle) {
            onToggle(id, value).catch((err) => {
              console.error("Failed to toggle status", err);
            });
          }
        }}
        color={value ? "success" : "default"}
      >
        {value ? <Public /> : <PublicOff />}
      </IconButton>
    );
  },
  disableColumnMenu: isMobile && true,
});

export const createRelativeTimeColumn = (
  field = "createdAt",
  headerName = "Created",
  isMobile = false
) => ({
  field,
  headerName,
  align: "center",
  width: isMobile
    ? DEFAULT_COLUMN_WIDTHS.statusMobile
    : DEFAULT_COLUMN_WIDTHS.status,
  renderCell: (params) => {
    // useFileConfig uses formatShortTime
    // useUserConfig uses RelativeTimeCell
    // We can try to standardize or provide options.
    // Let's use formatShortTime for consistency with the "ago" suffix pattern if that's what's desired,
    // or just return the component.
    // The user request example showed: export const relativeTimeColumn = (field = "createdAt") => ({ ... });

    // Let's try to support the simple string format first as seen in useFileConfig
    const value = params.value;
    if (!value) return null;

    // Check if we should use the component or the hook function
    // For now, let's stick to a simple text representation which is generic
    const relativeTime = formatShortTime(value);
    return <>{relativeTime} ago</>;
  },
  disableColumnMenu: isMobile && true,
});
