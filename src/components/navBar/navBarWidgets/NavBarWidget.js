import React, { useContext } from "react";
import { Box } from "@mui/material";

import Profile from "../../../widgets/profile/Index";

import Events from "../../../widgets/events/Index";
import StockMarket from "../../../widgets/stockMarket/Index";
import Calendar from "../../../widgets/calendar/Index";
import Persons from "../../../widgets/persons/Index";
import Companies from "../../../widgets/companies/Index";
import Organizations from "../../../widgets/organizations/Index";
import Agencies from "../../../widgets/agencies/Index";
import ImageDropzone from "../../../widgets/imageDropZone/Index";
import CVS_Converter from "../../../widgets/csvDropZone/Index";
import Data_Enrichment_Tool from "../../../widgets/jsonDropZone/Index";
import ToolTipComponent from "../../tooltip/ToolTipComponent";

const Components = {
  Profile: Profile,
  Events: Events,
  StockMarket: StockMarket,
  Calendar: Calendar,
  Persons: Persons,
  Companies: Companies,
  Organizations: Organizations,
  Agencies: Agencies,
  // ImageDropzone: ImageDropzone,
  CVS_Converter: CVS_Converter,
  Data_Enrichment_Tool: Data_Enrichment_Tool,
};
export const NavBarWidget = (block, commonProps) => {
  // Destructure needed values from commonProps if they exist
  // (No change needed here)
  const { styled, contextToolBar /*, theme, colors, etc. */ } =
    commonProps || {};

  // Get the actual component type from the Components map
  const TargetComponent = Components[block.widget];

  // Check if the component type exists
  if (typeof TargetComponent !== "undefined") {
    // Prepare the props object for the TargetComponent
    // (No change needed here, but removed the 'key' prop as it's
    // usually handled by the parent mapping component)
    const spaceProps = {
      ...commonProps, // Pass all common props through
      block: block, // Pass the specific block configuration
      // key: block._uid || block.widget, // KEY typically handled in the parent's .map()
      widgetTitle: block.widget,
    };

    // console.log(
    //   `  Rendering component: ${block.widget} with props:`,
    //   spaceProps,
    // );

    // *** Use JSX to render the component ***
    // React requires component variables used in JSX to be Capitalized.
    // Since TargetComponent holds the imported component (e.g., Profile), it works.
    return (
      <>
        {/* <ToolTipComponent
          i={null}
          title={block.widget}
          placement="right"
          arrow={true}
          content={<TargetComponent spaceProps={spaceProps} />} // Spread the props onto  the component
        /> */}
        <TargetComponent spaceProps={spaceProps} />
      </>
    );
  } else {
    // Handle the case where the component is not found
    console.warn(
      `  Component "${block.widget}" not found in Components object.`
    );

    // *** Use JSX for the error message placeholder ***
    return (
      <div
        // key={block._uid || block.widget} // KEY typically handled in the parent's .map()
        style={{ color: "red" }}
      >
        Error: Widget `${block.widget}` not found.
      </div>
    );
  }
};
