// file path: ~/DEVFOLD/SCRIPT-PITCHER/SRC/WIDGETS/HOME/WIDGET.JS

import React, { useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Box, Button, Typography, alpha } from "@mui/material";
import { Add, BackupTable, Group, History } from "@mui/icons-material";

import { useApp } from "@/context/AppContext";
import { useData } from "@/context/DataContext";

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
    <Box
      sx={{
        position: "relative",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #181c22ff 0%, #0e1929cc 100%)", // Subtle background gradient
        overflow: "auto",
        // p: 2,
      }}
    >
      <Box
        sx={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexFlow: "column wrap",
          justifyContent: "center",
          alignItems: "center",
          gap: { xs: 2, sm: 3, md: 4 },
        }}
      >
        <Box sx={rowStyles}>
          <Button
            onClick={() => gotoDashboard("projects")}
            sx={(theme) => ({
              ...tileBaseStyles,
              background: theme.palette.tileButtons?.ne?.background,
              color: "white",
              "&:hover": {
                background: "linear-gradient(135deg, #009efd 0%, #2af598 100%)",
                transform: "translateY(-4px)",
                boxShadow: "0 10px 20px rgba(0, 158, 253, 0.4)",
              },
            })}
          >
            <Box sx={contentWrapperStyles}>
              <BackupTable sx={{ fontSize: { xs: 40, md: 50 }, mb: 1 }} />
              <Typography
                variant={{ xs: "body1", sm: "body1", md: "h6" }}
                fontWeight="bold"
              >
                Projects
              </Typography>
            </Box>
          </Button>

          <Button
            onClick={() => gotoDashboard("users")}
            sx={(theme) => ({
              ...tileBaseStyles,
              background: theme.palette.tileButtons?.nw?.background,
              color: "white",
              borderColor: theme.palette.randomeRainbow,
              "&:hover": {
                background: "linear-gradient(135deg, #764ba2 0%, #667eea 100%)",
                transform: "translateY(-4px)",
                boxShadow: "0 10px 20px rgba(118, 75, 162, 0.4)",
              },
            })}
          >
            <Box sx={contentWrapperStyles}>
              <Group sx={{ fontSize: { xs: 40, md: 50 }, mb: 1 }} />
              <Typography
                variant={{ xs: "body1", sm: "body1", md: "h6" }}
                fontWeight="bold"
              >
                Contacts
              </Typography>
            </Box>
          </Button>
        </Box>

        {/* <Box sx={rowStyles}>
          <Button
            onClick={() => gotoDashboard(`projects/${lastFile?.projectId}`)}
            sx={{
              ...tileBaseStyles,
              position: "relative",
              overflow: "hidden",
              backgroundColor: "background.paper",
              border: !lastFile ? "2px dashed #ccc" : "none",
              "&:hover": {
                transform: "translateY(-4px)",
                boxShadow: "0 10px 20px rgba(0,0,0,0.15)",
                borderColor: "primary.main",
              },
            }}
            disabled={!lastFile}
          >
            {!lastFile ? (
              <Box sx={{ ...contentWrapperStyles, opacity: 0.6 }}>
                <History
                  sx={{
                    color: "text.primary",
                    fontSize: { xs: 40, md: 50 },
                    mb: 1,
                  }}
                />
                <Typography
                  variant="body1"
                  fontWeight="medium"
                  sx={{ color: "text.primary", opacity: 0.6 }}
                >
                  No recent file
                </Typography>
              </Box>
            ) : (
              <>
                <Image
                  fill
                  src={lastFile.bannerUrl}
                  alt={lastFile.projectName}
                  style={{ objectFit: "cover", opacity: 0.9 }}
                />
                <Box
                  sx={(theme) => ({
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    width: "100%",
                    p: 1,
                    background: theme.palette.tileButtons?.sw?.background,
                    // color: "white",
                    textAlign: "center",
                  })}
                >
                  <Typography
                    variant="subtitle2"
                    noWrap
                    sx={{
                      textShadow: "0 2px 4px rgba(0,0,0,0.5)",
                      color: "text.contrast",
                    }}
                  >
                    {lastFile.projectName}
                  </Typography>
                </Box>
              </>
            )}
          </Button>

          <Button
            onClick={() => gotoDashboard("projects/")}
            sx={(theme) => ({
              ...tileBaseStyles,
              background: theme.palette.tileButtons?.se?.background,
              color: "text.contrast",
              border: "2px dashed",
              borderColor: theme.palette.primary.light,
              "&:hover": {
                backgroundColor: alpha(theme.palette.primary.light, 0.05),
                borderColor: theme.palette.primary.main,
                transform: "translateY(-4px)",
                boxShadow: "0 10px 20px rgba(168, 168, 168, 0.12)",
              },
            })}
          >
            <Box sx={contentWrapperStyles}>
              <Add
                sx={{
                  fontSize: { xs: 40, md: 50 },
                  mb: 1,
                  color: "text.contrast",
                }}
              />
              <Typography
                variant="body1"
                fontWeight="medium"
                sx={{ color: "text.contrast" }}
              >
                New Project
              </Typography>
            </Box>
          </Button>
        </Box> */}
      </Box>
    </Box>
  );
}

const rowStyles = {
  display: "flex",
  flexFlow: "row nowrap",
  gap: { xs: 2, sm: 3, md: 4 },
};

const tileBaseStyles = {
  width: { xs: "100px", sm: "120px", md: "160px" },
  height: { xs: "100px", sm: "120px", md: "160px" },
  borderRadius: 4,
  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  transition: "all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)",
  textTransform: "none",
  p: 0,
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
};

const contentWrapperStyles = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  width: "100%",
  height: "100%",
  zIndex: 1,
};
