// file path: ~/DEVFOLD/SCRIPT-PITCHER/SRC/COMPONENTS/SELECT/BASICSELECT.JS

import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import PropTypes from "prop-types"; // Import PropTypes for type checking

/**
 * Generic Select component designed to update a project status field.
 *
 * @param {object} props
 * @param {Array<{status: string}>} props.selectOptions - Array of objects with a 'status' key.
 * @param {object} props.crudProject - The current project state object.
 * @param {function} props.setCrudProject - The function to update the project state.
 */
export default function BasicSelect({
  selectOptions,
  crudProject,
  setCrudProject,
}) {
  // The current value is read directly from the parent state (crudProject)
  // Default to 'in developement' if status is not set.
  const currentValue = crudProject?.status || "in developement";

  const handleChange = (event) => {
    const newStatus = event.target.value;

    // Update the parent's crudProject state
    setCrudProject((prev) => ({
      ...prev,
      status: newStatus, // Update the 'status' field
    }));
  };

  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth variant="outlined">
        {" "}
        {/* Use fullWidth for better layout */}
        <InputLabel id="project-status-label">Project Status</InputLabel>
        <Select
          labelId="project-status-label"
          id="project-status-select"
          name="status" // Add name for better form handling, though not strictly needed here
          value={currentValue}
          onChange={handleChange}
          label="Project Status"
        >
          {/* Optional: Add a default 'None' or placeholder item */}
          <MenuItem value="in developement">
            <Typography
              variant="body1"
              sx={{ fontStyle: "italic", color: "text.secondary" }}
            >
              in developement (Default)
            </Typography>
          </MenuItem>

          {/* Map over the options provided by the parent component */}
          {selectOptions.map((option, index) => (
            <MenuItem
              key={index}
              value={option.status}
              // Optional: Highlight if the option is the current value
              selected={option.status === currentValue}
            >
              {option.status}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}

BasicSelect.propTypes = {
  selectOptions: PropTypes.arrayOf(
    PropTypes.shape({
      status: PropTypes.string.isRequired,
    })
  ).isRequired,
  crudProject: PropTypes.object.isRequired,
  setCrudProject: PropTypes.func.isRequired,
};
