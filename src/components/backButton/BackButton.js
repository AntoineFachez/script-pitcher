"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { Button, IconButton } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export default function BackButton({}) {
  const params = useParams();

  // Next.js automatically extracts 'projectId' if your folder is named [projectId]
  const projectId = params.projectId;

  // If we can't find the ID, don't render the button (or render a fallback)
  if (!projectId) return null;

  return (
    // Using Link is better for SEO and pre-fetching than router.push
    <Link
      href={`/projects/${projectId}`}
      passHref
      style={{ textDecoration: "none", ...backButtonProps.sx }}
    >
      <IconButton variant="outlined">
        <ArrowBackIcon />
      </IconButton>
    </Link>
  );
}
const backButtonProps = {
  className: "button--back",
  sx: { position: "absolute", zIndex: 100 },
};
