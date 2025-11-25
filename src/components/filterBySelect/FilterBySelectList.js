import { getButton } from "@/lib/maps/iconMap";
import { pageMenuStyles } from "@/theme/muiProps";
import { Box, Button } from "@mui/material";
import React from "react";

export default function FilterBySelectList({
  array,
  itemInFocus,
  clearFilter,
  handleClickFilter,
}) {
  return (
    <Box sx={pageMenuStyles.sx}>
      {array?.map((item, i) => {
        return (
          <>
            {/* {getButton(
              i,
              null,
              () => handleClickFilter(item),
              null,
              {},
              "outlined",
              null,
              item,
              false,
              true
            )} */}
            <Button
              key={item}
              variant="outlined"
              onClick={() => handleClickFilter(item)}
              sx={{
                borderColor:
                  itemInFocus === item ? "button.active" : "button.inactive",
                backgroundColor: "button.background",
              }}
            >
              {item}
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
