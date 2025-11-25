// file path: ~/DEVFOLD/SCRIPT-PITCHER/SRC/COMPONENTS/NAVBAR/WIDGET.JS

"use client";

import React, { useCallback, useContext, useEffect, useState } from "react";
import { Box, Button, Stack, Typography } from "@mui/material";
import { Check, ContentCopy, GroupAdd } from "@mui/icons-material";

import AppContext from "@/context/AppContext";
import DataContext from "@/context/DataContext";
import InFocusContext from "@/context/InFocusContext";
import SearchContext from "@/context/SearchContext";

import WidgetIndexTemplate from "../../uiItems/widgetItems/WidgetIndexTemplate";

import Context from "./Context";
import NavBar from "./AppBar";

export default function Widget({ spaceProps }) {
  const {
    appContext,
    setAppContext,
    gridMapKey,
    setGridMapKey,
    widget,
    uiContext,
    startUpWidgetLayout,
    contextToolBar,
    styled,
  } = spaceProps;
  const { dataContextProps } = useContext(DataContext);
  const { inFocusContextProps } = useContext(InFocusContext);

  const { paginationData, setPaginationData } = dataContextProps;
  const { personInFocus, setPersonInFocus, setLatestItemInFocus } =
    inFocusContextProps;
  const { setActiveSearchTerm } = useContext(SearchContext);
  const {} = useContext(Context);
  const [selectedWidgetLayout, setSelectedWidgetLayout] = useState(
    widget?.startUpWidgetLayout
  );
  // --- State for Copy Button ---
  const collection = "chats";
  const widgetProps = {
    ...spaceProps,
    ...dataContextProps,
    ...inFocusContextProps,
    iconButton: <Typography sx={styled?.iconButton}>{"{...}"}</Typography>,
    // widgetTitle: "CSV - JSON converter Tool",
    dropWidgetName: collection,
    appContext: appContext,
    gridMapKey: gridMapKey,
    setGridMapKey: setGridMapKey,
    widgetLayout: selectedWidgetLayout,
    contextToolBar: contextToolBar,
    hasWidgetMenu: true,

    hasQuickMenu: uiContext === "widget" ? true : false,
    quickMenuButtonArray: [
      {
        tooltip_title: "",
        // onClickHandler: () => handleOpenNewItem(setShowNewItem, collection),
        // icon: <Add />,
      },
    ],
    selectedWidgetLayout: selectedWidgetLayout,
    setSelectedWidgetLayout: setSelectedWidgetLayout,
    setActiveSearchTerm: setActiveSearchTerm,
  };

  // const toolProps = {
  //   ...widgetProps,
  //   csvInputString: csvInputString,
  //   setCsvInputString: setCsvInputString,
  //   jsonData: jsonData,
  //   setJsonData: setJsonData,
  //   isLoading: isLoading,
  //   handleInputChange: handleInputChange,
  //   handleParseCsv: handleParseCsv,
  //   parsingError: parsingError,
  // };
  // useEffect(() => {
  //   setPaginationData({
  //     ...toolProps,
  //     title: "CSV / JSON Converted",
  //     data: jsonData,
  //     // error: processingError,
  //     // emptyMessage: !processingError
  //     //   ? "No items were successfully enriched."
  //     //   : "Processing error occurred.",
  //   });
  //   return () => {};
  // }, []);
  // useEffect(() => {
  //   setPaginationData(jsonData);

  //   return () => {};
  // }, [jsonData]);
  return (
    <>
      <WidgetIndexTemplate
        // widget={widget}
        widgetProps={widgetProps}
        soloWidget={<NavBar spaceProps={widgetProps} />}
      />
    </>
  );
}
