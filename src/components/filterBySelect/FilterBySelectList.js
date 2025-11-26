// file path: ~/DEVFOLD/SCRIPT-PITCHER/SRC/COMPONENTS/FILTERBYSELECT/FILTERBYSELECTLIST.JS

import React from "react";
import { Box, Button } from "@mui/material";

export default function FilterBySelectList({
  array,
  itemInFocus,
  clearFilter,
  handleClickFilter,
}) {
  return (
    <Box {...pageMenuProps}>
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
const pageMenuProps = {
  className: "page--menu__filterBySelect",
  component: "",
  sx: {
    marginBottom: 0,
    display: "flex",
    flexFlow: "row wrap",
    justifyContent: "center",
    alignItems: "center",
    gap: 1,
    backgroundColor: "primary.dark",
  },
};
