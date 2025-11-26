// file path: ~/DEVFOLD/SCRIPT-PITCHER/SRC/WIDGETS/DASHBOARD/WIDGET.JS

import React, { useEffect } from "react";
import { Box, Typography } from "@mui/material";

import { useApp } from "@/context/AppContext";
import { useData } from "@/context/DataContext";

import BasicRadar from "@/components/charts/BasicRadarChart";
import BasicGauge from "@/components/charts/BasicGauge";
import { widgetContainerProps, containerProps } from "@/theme/muiProps";
import BasicBars from "@/components/charts/BasicBarChart";

export default function DashboardContent() {
  const { setAppContext } = useApp();
  const { projects, users } = useData();
  useEffect(() => {
    setAppContext("dashboard");
    return () => {};
  }, []);
  console.log("projects", projects?.[3]);

  const gaugeData = [
    {
      label: "invitation accepted",
      value: users?.length,
      valueMin: 0,
      valueMax: 154,
    },
    {
      label: "file downloads",
      value: users?.length,
      valueMin: 0,
      valueMax: 17,
    },
  ];
  return (
    <>
      <Box {...widgetContainerProps}>
        <Box
          {...containerProps}
          sx={{
            ...containerProps.sx,
            height: "fit-content",
            display: "flex",
            flexFlow: "column nowrap",
            justifyContent: "flex-start",
            alignItems: "flex-start",
            padding: "6rem 5rem 0 5rem",
          }}
        >
          <Typography variant="h5">Lorem ipsum dolor sit amet.</Typography>
          <Typography variant="subtitle">
            Lorem ipsum dolor, sit amet consectetur adipisicing elit.
          </Typography>
          <Typography variant="body1">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatem
            aperiam dolores distinctio corrupti enim nulla officia ad,
            doloremque consequatur placeat temporibus nemo minus explicabo.
            Magni eius sit aspernatur porro, asperiores at sapiente enim ea id
            blanditiis nemo mollitia vitae aperiam, sequi fuga in adipisci modi
            esse laudantium perferendis maiores ab? Cumque nulla nisi numquam
            quidem quaerat quasi commodi ducimus fugiat eos dolores asperiores
            temporibus, assumenda placeat vitae minus illum nam quibusdam
            molestias consequuntur tempora, unde tempore saepe, reiciendis
            laborum! Quidem, ipsa! Debitis, nemo quam? Similique soluta
            consequuntur sapiente maiores? Deserunt repellat non distinctio qui
            amet officiis natus nihil sequi optio?
          </Typography>
        </Box>
        <Box
          sx={{ height: "100%", display: "flex", flexFlow: "row wrap", gap: 2 }}
        >
          <Box
            sx={{
              height: "fit-content",
              display: "flex",
              flexFlow: "row wrap",
            }}
          >
            <BasicRadar />
          </Box>
          <BasicGauge gaugeData={gaugeData} />
          <BasicBars />
        </Box>
      </Box>
    </>
  );
}
