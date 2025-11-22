// file path: ~/DEVFOLD/SCRIPT-PITCHER/SRC/COMPONENTS/CARD/BASICCARD.JS

import { useState } from "react";
import Link from "next/link";
import Card from "@mui/material/Card";
import Collapse from "@mui/material/Collapse";

import CardItemHeader from "./CardItemHeader";
import CardItemActions from "./CardItemActions";
import CardItemMedia from "./CardItemMedia";

import { flexListItemStyles } from "@/theme/muiProps";
import { Grid } from "@mui/material";

export default function BasicCard({
  cardProps,
  item,
  itemInFocus,
  collection,
  schemeDefinition,
  customItem,
  toggleDetails,
}) {
  const [expanded, setExpanded] = useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <Card
      sx={{
        // ...flexListItemStyles.sx,
        position: "relative",
        border:
          item === itemInFocus ? `white 1px solid` : `transparent 1px solid`,
      }}
    >
      {/* <Link
            key={item[schemeDefinition?.id]}
            href={`/${collection}/${item[schemeDefinition?.id]}`} // Use the correct path
            passHref
            onClick={() => cardProps.handleClickTitle(item)}
          > */}
      {toggleDetails && <CardItemHeader cardProps={{ ...cardProps, item }} />}
      {/* </Link> */}

      {cardProps.showCardMedia && (
        <CardItemMedia cardProps={{ ...cardProps, item }} />
      )}
      <Collapse
        in={expanded}
        timeout="auto"
        unmountOnExit
        sx={{ width: "100%", p: 0, m: 0 }}
      >
        {customItem}
      </Collapse>
      {toggleDetails && (
        <CardItemActions
          cardProps={{ ...cardProps, expanded, handleExpandClick }}
        />
      )}
    </Card>
  );
}
