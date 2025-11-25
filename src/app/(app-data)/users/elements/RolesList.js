import { getButton } from "@/lib/maps/iconMap";
import { Box, Button } from "@mui/material";
import React from "react";

export default function RolesList({
  uniqueRoles,
  roleInFocus,
  clearFilter,
  handleRoleClick,
}) {
  return (
    <Box sx={{ marginBottom: 3, display: "flex", gap: 1, flexWrap: "wrap" }}>
      {uniqueRoles?.map((genre, i) => {
        return (
          <>
            {/* {getButton(
              i,
              null,
              () => handleRoleClick(genre),
              null,
              {},
              "outlined",
              null,
              genre,
              false,
              true
            )} */}
            <Button
              key={genre}
              variant="outlined"
              onClick={() => handleRoleClick(genre)}
              sx={{
                borderColor:
                  roleInFocus === genre ? "button.active" : "button.inactive",
                backgroundColor: "button.background",
              }}
            >
              {genre}
            </Button>
          </>
        );
      })}
      <Button variant="contained" onClick={clearFilter}>
        Show All
      </Button>
    </Box>
  );
}
