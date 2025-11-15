// src/app/page.js

"use client";
import { Box, Button, Paper, Typography } from "@mui/material";

import CircularProgress from "@/components/progress/CircularIndeterminate";
import { titleStyle, widgetContainerStyles } from "@/theme/muiProps";
import { useRouter } from "next/navigation";
import { useData } from "@/context/DataContext";
import { iconMap } from "@/lib/maps/iconMap";
import { Add, BackupTable, Group } from "@mui/icons-material";

export default function Home() {
  const { lastFile } = useData();

  const router = useRouter();
  const gotoDashboard = (goTo) => {
    router.push(`/${goTo}`);
  };
  const containerStyles = {
    sx: {
      width: "100%",
      height: "100%",
      display: "flex",
      flexFlow: "row nowrap",
      justifyContent: "center",
      alignItems: "center",
      gap: 2,
      backgroundColor: "background.background",
    },
  };
  const tileStyles = {
    sx: {
      width: "10rem",
      height: "10rem",
      border: "1px solid #777",
      backgroundColor: "background.paper",
    },
  };
  return (
    <Box sx={widgetContainerStyles.sx}>
      <Typography variant={titleStyle.variant} sx={titleStyle.sx}>
        Home
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexFlow: "column nowrap",
          justifyContent: "center",
          alignItems: "center",
          gap: 2,
        }}
      >
        <Box sx={containerStyles.sx}>
          <Button
            sx={tileStyles.sx}
            onClick={() => gotoDashboard("users")}
            startIcon={<Group />}
          >
            Users
          </Button>
          <Button
            sx={tileStyles.sx}
            onClick={() => gotoDashboard("projects")}
            startIcon={<BackupTable />}
          >
            Projects
          </Button>
        </Box>
        <Box sx={containerStyles.sx}>
          <Button
            sx={tileStyles.sx}
            onClick={() => gotoDashboard(`projects/${lastFile?.projectId}`)}
          >
            Last Touched {lastFile?.projectName}
          </Button>
          <Button
            sx={tileStyles.sx}
            onClick={() => gotoDashboard("projects/")}
            startIcon={<Add />}
          >
            New Project
          </Button>
        </Box>
      </Box>
      <Box sx={{ height: "100%" }}></Box>
    </Box>
  );
}
