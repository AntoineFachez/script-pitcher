// file path: ~/DEVFOLD/SCRIPT-PITCHER/SRC/WIDGETS/HOME/WIDGET.JS

import React, { useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Box, Button } from "@mui/material";
import { Add, BackupTable, Group } from "@mui/icons-material";

import { useApp } from "@/context/AppContext";
import { useData } from "@/context/DataContext";

import { widgetcontainerProps } from "@/theme/muiProps";

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

  return (
    <Box {...widgetcontainerProps}>
      <Box
        sx={{
          display: "flex",
          flexFlow: "column nowrap",
          gap: { xs: 2.4, sm: 3, md: 4, lg: 5, xl: 6 },
        }}
      >
        <Box
          sx={{
            flexFlow: "row nowrap",
          }}
          {...tileButtonContainerProps}
        >
          <Button
            {...tileButtonProps}
            onClick={() => gotoDashboard("users")}
            startIcon={<Group />}
          >
            Users
          </Button>
          <Button
            {...tileButtonProps}
            onClick={() => gotoDashboard("projects")}
            startIcon={<BackupTable />}
          >
            Projects
          </Button>
        </Box>
        <Box
          sx={{
            flexFlow: "row nowrap",
          }}
          {...tileButtonContainerProps}
        >
          <Button
            {...tileButtonProps}
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
            {...tileButtonProps}
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
export const tileButtonContainerProps = {
  sx: {
    display: "flex",
    flexFlow: "row nowrap",
    justifyContent: "center",
    alignItems: "center",
    gap: { xs: 2.4, sm: 3, md: 4, lg: 5, xl: 6 },
  },
};
const tileButtonProps = {
  className: "tile--buttons",
  variant: "outlined",
  sx: {
    width: { xs: "8rem", sm: "10rem", md: "10rem", lg: "10rem", xl: "10rem" },
    height: { xs: "8rem", sm: "10rem", md: "10rem", lg: "10rem", xl: "10rem" },
    border: "1px solid #777",
    p: 1,
    m: 0,
    backgroundColor: "background.paper",
    "&:hover": {
      backgroundColor: "background.nav",
    },
  },
};
