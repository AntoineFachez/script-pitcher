// file path: ~/DEVFOLD/SCRIPT-PITCHER/SRC/COMPONENTS/NAVBAR/INDEX.JS

"use client";
import React, { useContext, useState } from "react";
import AppBar from "./AppBar";
import { ContextProvider } from "./Context";

export default function Index({ NAV_HEIGHT }) {
  return (
    <>
      <ContextProvider>
        <AppBar NAV_HEIGHT={NAV_HEIGHT} />
      </ContextProvider>
    </>
  );
}
