// file path: ~/DEVFOLD/SCRIPT-PITCHER/SRC/COMPONENTS/TABS/BASICTABS.JS

import { Box, List, Tab, Tabs, Typography } from "@mui/material";
import PropTypes from "prop-types";
import { useState } from "react";

// --- CustomTabPanel component remains the same ---
function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <Box
      className="tab--item--container"
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {/* 🛑 Adjusted: Only render children if value matches index */}
      {value === index && (
        <Box sx={{ height: "100%", overflow: "hidden" }}>{children}</Box>
      )}
    </Box>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

// --- Refactored BasicTabs Component ---

/**
 * Renders a dynamic tab component based on an array of tab data.
 * @param {Array<{label: string, content: React.ReactNode}>} tabsArray - Array of tab objects.
 */
export default function DynamicTabs({ tabsArray = [], containerRef }) {
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  if (!tabsArray.length) {
    return (
      <Typography color="text.secondary">No tab data provided.</Typography>
    );
  }

  return (
    <>
      <Tabs
        className="tab--selector"
        value={value}
        onChange={handleChange}
        aria-label="dynamic tabs example"
        // Optional: Make tabs scrollable if they don't fit
        variant="scrollable"
        scrollButtons="auto"
        sx={{
          position: "sticky",
          zIndex: 100,
          top: 0,
          backgroundColor: "background.nav",
        }}
      >
        {/* 1. Map over the array to create the Tab headers */}
        {tabsArray.map((tab, index) => (
          <Tab key={index} label={tab.label} {...a11yProps(index)} />
        ))}
      </Tabs>
      {/* 2. Map over the array to create the CustomTabPanel content */}
      {tabsArray.map((tab, index) => (
        <CustomTabPanel key={index} value={value} index={index}>
          {tab.content}
        </CustomTabPanel>
      ))}
    </>
  );
}

// Add PropTypes for the new prop
DynamicTabs.propTypes = {
  tabsArray: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      content: PropTypes.node,
    })
  ).isRequired,
};
