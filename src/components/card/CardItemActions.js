// file path: ~/DEVFOLD/SCRIPT-PITCHER/SRC/COMPONENTS/CARD/CARDITEMACTIONS.JS

import React from "react";
import styled from "@emotion/styled";
import { CardActions } from "@mui/material";

import { ActionIcon } from "../buttons/ActionIcon";

const Expand = styled((props) => {
  const { expand, ...other } = props;
  return <ActionIcon iconName={"ExpandMore"} {...other} />;
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
        sx={{}}
      />
    </CardActions>
  );
}
const cardActionProps = {
  className: "card--actions",
  sx: {
    // width: "4ch",
    // maxWidth: "4ch",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
};
