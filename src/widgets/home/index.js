// file path: ~/DEVFOLD/SCRIPT-PITCHER/SRC/APP/PAGE.JS

"use client";
import { useRouter } from "next/navigation";
import { Box, Button, Paper, Typography } from "@mui/material";
import { Add, BackupTable, Group } from "@mui/icons-material";

import { iconMap } from "@/lib/maps/iconMap";

import { useData } from "@/context/DataContext";
import { useApp } from "@/context/AppContext";

import NavBarButton from "@/components/navBar/navBarButton/NavBarButton";

import { titleStyle, widgetContainerStyles } from "@/theme/muiProps";
import { handleSetNewAppContext } from "@/lib/actions/appActions";

export default function HomeIndex({ layoutContext }) {
  const { setAppContext } = useApp();
  const { lastFile } = useData();

  const router = useRouter();
  const gotoDashboard = (goTo) => {
    setAppContext(goTo);
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
    <>
      {layoutContext === "navBar" ? (
        <>
          <NavBarButton
            iconName="Home"
            href="/"
            prop="home"
            badgeCount={null}
            handleSetNewAppContext={handleSetNewAppContext}
          />{" "}
        </>
      ) : (
        <>
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
                  onClick={() =>
                    gotoDashboard(`projects/${lastFile?.projectId}`)
                  }
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
            {/* <Box sx={{ height: "100%" }}></Box> */}
          </Box>{" "}
        </>
      )}
    </>
  );
}
