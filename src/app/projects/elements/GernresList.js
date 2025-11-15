// file path: ~/DEVFOLD/SCRIPT-PITCHER/SRC/APP/PROJECTS/ELEMENTS/GERNRESLIST.JS

"use client";

import { getButton } from "@/lib/maps/iconMap";
import { Box, Button } from "@mui/material";
import React from "react";

export default function GernresList({
  uniqueGenres,
  genreInFocus,
  clearFilter,
  handleGenreClick,
}) {
  return (
    <Box sx={{ marginBottom: 3, display: "flex", gap: 1, flexWrap: "wrap" }}>
      {uniqueGenres?.map((genre, i) => {
        return (
          <Box key={i}>
            {/* {getButton(
              i,
              null,
              () => handleGenreClick(genre),
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
              onClick={() => handleGenreClick(genre)}
              sx={{
                borderColor:
                  genreInFocus === genre ? "button.active" : "button.inactive",
                backgroundColor: "button.background",
              }}
            >
              {genre}
            </Button>
          </Box>
        );
      })}
      <Button variant="contained" onClick={clearFilter}>
        Show All
      </Button>
    </Box>
  );
}
