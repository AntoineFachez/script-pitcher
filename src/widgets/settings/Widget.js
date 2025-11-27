"use client";

import React, { useState } from "react"; // 1. Import useState
import { useApp } from "@/context/AppContext";
import {
  Box,
  FormControlLabel,
  FormGroup,
  MenuItem,
  Switch,
  ToggleButton,
  Typography,
} from "@mui/material";
import { useThemeContext } from "@/context/ThemeContext";
import { useUi } from "@/context/UiContext";
import { ActionIcon } from "@/components/buttons/ActionIcon";

export default function SettingsContent() {
  const { appContext } = useApp();
  const { toggleColorMode } = useThemeContext();
  const { showDataGrid, setToggleDetails, setShowDataGrid, handleOpenAddItem } =
    useUi();

  // 2. FIX: Turn 'settings' into React State
  // This ensures React re-renders when values change.
  const [settings, setSettings] = useState({ someSetting: true });

  // 3. Helper function to toggle state safely
  const switchSetting = (key) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const options = [
    {
      type: "toggle",
      label: "toggle something",
      value: false, // ToggleButton usually uses 'selected', not checked
      action: () => console.log("toggled something"),
    },
    {
      type: "switch",
      label: "switch something",
      // 4. FIX: Bind the 'checked' status to the state
      checked: settings.someSetting,
      // 5. FIX: Use the state setter in the handler
      change: () => switchSetting("someSetting"),
    },
    {
      key: crypto.randomUUID(),
      action: () => setShowDataGrid((prev) => !prev),
      iconName: showDataGrid ? "CreditCard" : "TableChart",
      label: "Show Table",
      asNavigationAction: true,
    },
    {
      key: crypto.randomUUID(),
      action: () => setToggleDetails((prev) => !prev),
      iconName: "Expand",
      label: "Show Details",
      asNavigationAction: true,
    },

    { action: toggleColorMode, iconName: "LightMode" },
  ];

  const componentMap = { toggle: ToggleButton, switch: Switch };

  return (
    <Box>
      <Typography variant="subtitle1">Settings {appContext}</Typography>
      <FormGroup>
        {options.map((option, i) => {
          const Component = componentMap[option.type];

          return option.iconName ? (
            <>
              <ActionIcon
                key={i}
                iconName={option.iconName}
                onClick={option.action}
                disabled={option.disabled}
                sx={option.size}
                variant={option.variant}
                href={option.href}
                label={option.buttonText || option.label}
                asNavigationAction={option.asNavigationAction}
              />
            </>
          ) : (
            <FormControlLabel
              key={i}
              // 6. FIX: Pass props specifically to the control component
              control={
                <Component
                  // Material UI Switch needs 'checked', ToggleButton needs 'selected'
                  checked={option.checked}
                  selected={option.checked}
                  onChange={option.change} // Use onChange for inputs
                  inputProps={
                    option.type === "switch"
                      ? { "aria-label": "controlled" }
                      : undefined
                  }
                />
              }
              label={option.label}
            />
          );
        })}
      </FormGroup>
    </Box>
  );
}
