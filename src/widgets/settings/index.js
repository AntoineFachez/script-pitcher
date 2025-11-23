// file path: ~/DEVFOLD/SCRIPT-PITCHER/SRC/WIDGETS/SETTINGS/INDEX.JS

"use client";
import { useUi } from "@/context/UiContext";

import BasicDrawer from "@/components/drawer/Drawer";

import SettingsContent from "./Widget";
import { Settings } from "@mui/icons-material";

export default function SettingsIndex({ layoutContext }) {
  const { handleToggleDrawer, orientationDrawer } = useUi();
  return (
    <>
      {layoutContext === "navBar" ? (
        <>
          <BasicDrawer
            handleToggleDrawer={handleToggleDrawer}
            orientationDrawer={orientationDrawer}
            anchor="left"
            iconToOpen={<Settings />}
            element={<SettingsContent />}
          />
        </>
      ) : (
        <></>
      )}
    </>
  );
}
