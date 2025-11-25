// file path: ~/DEVFOLD/SCRIPT-PITCHER/SRC/COMPONENTS/NAVBAR/NAVBARBUTTON/INDEX.JS

import React from "react";
import NavBarButton from "./NavBarButton";

export default function Index({
  appContext,
  widgetLayout,
  onClick,
  iconButton,
  styled,
}) {
  return (
    <>
      {" "}
      <NavBarButton
        appContext={appContext}
        widgetLayout={widgetLayout}
        onClick={onClick}
        iconButton={iconButton}
        styled={styled}
      />
    </>
  );
}
