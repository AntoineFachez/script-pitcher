// file path: ~/DEVFOLD/SCRIPT-PITCHER/SRC/COMPONENTS/CARD/BASICCARD.JS

import { useState } from "react";
import Link from "next/link";
import Card from "@mui/material/Card";
import Collapse from "@mui/material/Collapse";

import CardItemHeader from "./CardItemHeader";
import CardItemActions from "./CardItemActions";
import CardItemMedia from "./CardItemMedia";

export default function BasicCard({
  cardActions,
  item,
  itemInFocus,
  collection,
  schemeDefinition,
  expandedCardContent,
  toggleDetails,
}) {
  const [expanded, setExpanded] = useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <Card
      {...cardProps}
      sx={{
        ...cardProps.sx,
        maxHeight: expanded ? "fit-content" : "22rem",
        border:
          item === itemInFocus ? `white 1px solid` : `transparent 1px solid`,
      }}
    >
      <Link
        key={item[schemeDefinition?.id]}
        href={`/${collection}/${item[schemeDefinition?.id]}`} // Use the correct path
        passHref
        onClick={() => cardActions.handleClickTitle(item)}
      >
        {toggleDetails && (
          <CardItemHeader cardActions={{ ...cardActions, item }} />
        )}
      </Link>

      {cardActions.showCardMedia && (
        <CardItemMedia cardActions={{ ...cardActions, item }} />
      )}
      <Collapse
        in={expanded}
        timeout="auto"
        unmountOnExit
        sx={{ width: "100%", p: 0, m: 0 }}
      >
        {expandedCardContent && expandedCardContent(item)}
      </Collapse>
      {toggleDetails && (
        <CardItemActions
          cardActions={{ ...cardActions, expanded, handleExpandClick }}
        />
      )}
    </Card>
  );
}
const cardProps = {
  sx: {
    position: "relative",
    maxWidth: {
      xs: "95%", // Mobile
      md: "25rem", // Example: Desktop limit
      lg: "400px", // Example: Desktop limit
    },
    height: "100%",
    maxHeight: {
      xs: "14rem", // Mobile
      md: "22rem", // Example: Desktop limit
      lg: "22rem", // Example: Desktop limit
    },

    // flex: "8 6 220px",
    flex: {
      xs: "8 6 220px",
      md: "4 2 220px",
      lg: "1 1 100%", // Overrides with "8 6 220px" from 'lg' screen up
    },
  },
};
