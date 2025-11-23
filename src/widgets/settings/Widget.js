// file path: ~/DEVFOLD/SCRIPT-PITCHER/SRC/WIDGETS/SETTINGS/WIDGET.JS

"use client";

import React, { useEffect, useRef, useState } from "react";

import { useApp } from "@/context/AppContext";

export default function SettingsContent({}) {
  const { appContext, setAppContext } = useApp();

  useEffect(() => {
    return () => {};
  }, [appContext]);

  return <>Settings</>;
}
