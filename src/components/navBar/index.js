// file path: ~/DEVFOLD/SCRIPT-PITCHER/SRC/COMPONENTS/NAVBAR/INDEX.JS

"use client";
import React, { useContext, useState } from "react";
import NavBar from "./NavBar";
import { ContextProvider } from "./Context";

export default function Index({ spaceProps }) {
  return (
    <>
      <ContextProvider>
        <NavBar spaceProps={spaceProps} />
      </ContextProvider>
    </>
  );
}
