// file path: ~/DEVFOLD/SCRIPT-PITCHER/SRC/COMPONENTS/CARD/CARDITEMACTIONS.JS

import React from "react";
import styled from "@emotion/styled";
import { CardActions } from "@mui/material";

import { ActionIcon } from "../buttons/ActionIcon";

const Expand = styled((props) => {
  const { expand, ...other } = props;
  return (
    <ActionIcon
      iconName={"ExpandMore"}
      {...other}
      sx={{
        "& >*": {
          fontSize: "1.8rem",
          // display: "flex",
          // justifyContent: "center",
          // alignItems: "center",
          // scale: "1.2",
        },
      }}
    />
  );
})(({ theme, expand }) => ({
  transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
  marginLeft: "auto",

  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
  variants: [
    {
      props: ({ expand }) => !expand,
      style: {
        transform: "rotate(0deg)",
      },
    },
    {
      props: ({ expand }) => !!expand,
      style: {
        transform: "rotate(180deg)",
      },
    },
  ],
}));

export default function CardItemActions({ cardActions }) {
  const { expanded, handleExpandClick, actions } = cardActions;

  return (
    <CardActions disableSpacing {...cardActionProps}>
      {actions}

      <Expand
        expand={expanded}
        onClick={handleExpandClick}
        aria-expanded={expanded}
        aria-label="show more"
        sx={{ width: "3rem", height: "3rem" }}
      />
    </CardActions>
  );
}
const cardActionProps = {
  className: "card--actions",
  sx: {
    position: "absolute",
    // left: 0,
    // right: 0,
    bottom: 0,
    width: "100%",
    height: "3rem",
    // maxWidth: "4ch",
    display: "flex",
    // justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "inherit",
  },
};
