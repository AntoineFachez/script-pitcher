// file path: ~/DEVFOLD/SCRIPT-PITCHER/SRC/APP/PAGE.JS

"use client";

import NavBarButton from "@/components/navBar/navBarButton/NavBarButton";

import { handleSetNewAppContext } from "@/lib/actions/appActions";
import Widget from "./Widget";

export default function HomeIndex({ layoutContext }) {
  return (
    <>
      {layoutContext === "navBar" ? (
        <>
          <NavBarButton
            iconName="Home"
            href="/"
            prop="home"
            badgeCount={null}
            handleSetNewAppContext={handleSetNewAppContext}
          />{" "}
        </>
      ) : (
        <>
          <Widget />
        </>
      )}
    </>
  );
}
