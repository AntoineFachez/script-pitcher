// file path: ~/DEVFOLD/SCRIPT-PITCHER/SRC/COMPONENTS/NAVBAR/INDEX.JS

"use client";
import React, { useContext, useState } from "react";
import AppBar from "./AppBar";
import { ContextProvider } from "./Context";

export default function Index({ spaceProps }) {
  return (
    <>
      <ContextProvider>
        <AppBar spaceProps={spaceProps} />
      </ContextProvider>
    </>
  );
}
