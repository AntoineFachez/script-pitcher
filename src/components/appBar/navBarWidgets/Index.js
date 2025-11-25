import React, { useContext, useEffect } from "react";
import NavBarWidgetCompiler from "./NavBarWidgetCompiler";
import { List, Typography } from "@mui/material";
export default function Index({
  navBarProps,
  navBarWidgetList,

  // blurDashboard
}) {
  const { styled } = navBarProps;
  return (
    <>
      <>
        {/* <List
          className="navBar"
          sx={{ ...styled.navBarButtonList, flexFlow: "row nowrap" }}
        > */}
        <NavBarWidgetCompiler
          navBarProps={navBarProps}
          navBarWidgetList={navBarWidgetList}
        />
        {/* </List> */}
      </>
    </>
  );
}
