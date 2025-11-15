import { Box, List, ListItem, Typography } from "@mui/material";
import React from "react";

export default function ListCustom({ array, schemeDefinition }) {
  return (
    <List>
      {array?.map((item) => (
        <ListItem key={item[schemeDefinition.id]}>
          <Typography variant="h5">{item[schemeDefinition.title]}</Typography>
        </ListItem>
      ))}
    </List>
  );
}
