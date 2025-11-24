// file path: ~/DEVFOLD/SCRIPT-PITCHER/SRC/WIDGETS/HOME/WIDGET.JS

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useApp } from "@/context/AppContext";
import { useData } from "@/context/DataContext";

import {
  containerStyles,
  tileButtonStyles,
  titleStyle,
  widgetContainerStyles,
} from "@/theme/muiProps";
import { Box, Button } from "@mui/material";
import { Add, BackupTable, Group } from "@mui/icons-material";

export default function HomeContent() {
  const { setAppContext } = useApp();
  const { lastFile } = useData();

  const router = useRouter();
  const gotoDashboard = (goTo) => {
    setAppContext(goTo);
    router.push(`/${goTo}`);
  };
  useEffect(() => {
    setAppContext("home");
    return () => {};
  }, []);

  // pageStyles;

  return (
    <Box sx={widgetContainerStyles.sx}>
      <Box
        className="tile--buttons"
        sx={{
          display: "flex",
          flexFlow: "column nowrap",
          justifyContent: "center",
          alignItems: "center",
          gap: 2,
        }}
      >
        <Box
          sx={{
            ...containerStyles.sx,
            display: "flex",
            flexFlow: "row nowrap",
            justifyContent: "center",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Button
            sx={tileButtonStyles.sx}
            onClick={() => gotoDashboard("users")}
            startIcon={<Group />}
          >
            Users
          </Button>
          <Button
            sx={tileButtonStyles.sx}
            onClick={() => gotoDashboard("projects")}
            startIcon={<BackupTable />}
          >
            Projects
          </Button>
        </Box>
        <Box sx={containerStyles.sx}>
          <Button
            sx={tileButtonStyles.sx}
            onClick={() => gotoDashboard(`projects/${lastFile?.projectId}`)}
          >
            Last Touched {lastFile?.projectName}
          </Button>
          <Button
            sx={tileButtonStyles.sx}
            onClick={() => gotoDashboard("projects/")}
            startIcon={<Add />}
          >
            New Project
          </Button>
        </Box>
      </Box>
      {/* <Box sx={{ height: "100%" }}></Box> */}
    </Box>
  );
}
