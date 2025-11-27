// file path: ~/DEVFOLD/SCRIPT-PITCHER/SRC/WIDGETS/SETTINGS/INDEX.JS

"use client";
import { Settings } from "@mui/icons-material";
import { useUi } from "@/context/UiContext";

import BasicDrawer from "@/components/drawer/Drawer";

import Widget from "./Widget";

export default function SettingsIndex({ layoutContext }) {
  const { handleToggleDrawer, orientationDrawer } = useUi();
  return (
    <>
      {layoutContext === "navBar" ? (
        <>
          <BasicDrawer
            handleToggleDrawer={handleToggleDrawer}
            orientationDrawer={orientationDrawer}
            anchor="right"
            iconToOpen={"Settings"}
            element={<Widget />}
          />
        </>
      ) : (
        <></>
      )}
    </>
  );
}
