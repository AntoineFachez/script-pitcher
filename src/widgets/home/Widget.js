// file path: ~/DEVFOLD/SCRIPT-PITCHER/SRC/WIDGETS/HOME/WIDGET.JS

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useApp } from "@/context/AppContext";
import { useData } from "@/context/DataContext";

import {
  containerStyles,
  tileButtonContainerStyles,
  tileButtonStyles,
  titleStyle,
  widgetContainerStyles,
} from "@/theme/muiProps";
import { Box, Button } from "@mui/material";
import { Add, BackupTable, Group } from "@mui/icons-material";
import BasicAvatar from "@/components/avatar/BasicAvatar";
import Image from "next/image";
import SecureImage from "@/components/secureImage/SecureImage";

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
      <Box className="tile--buttons" sx={{ ...tileButtonContainerStyles.sx }}>
        <Box sx={{ ...tileButtonContainerStyles.sx, flexFlow: "row nowrap" }}>
          <Button
            variant={tileButtonStyles.variant}
            sx={tileButtonStyles.sx}
            onClick={() => gotoDashboard("users")}
            startIcon={<Group />}
          >
            Users
          </Button>
          <Button
            variant={tileButtonStyles.variant}
            sx={tileButtonStyles.sx}
            onClick={() => gotoDashboard("projects")}
            startIcon={<BackupTable />}
          >
            Projects
          </Button>
        </Box>
        <Box sx={{ ...tileButtonContainerStyles.sx, flexFlow: "row nowrap" }}>
          <Button
            variant={tileButtonStyles.variant}
            sx={tileButtonStyles.sx}
            onClick={() => gotoDashboard(`projects/${lastFile?.projectId}`)}
          >
            {!lastFile ? (
              "No last touched file"
            ) : (
              <>
                {/* <BasicAvatar url={lastFile.bannerUrl} /> */}
                <Image
                  fill
                  src={lastFile.bannerUrl}
                  alt={lastFile.projectName}
                />
              </>
            )}
          </Button>
          <Button
            variant={tileButtonStyles.variant}
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
