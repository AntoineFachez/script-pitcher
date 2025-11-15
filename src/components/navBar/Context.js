// file path: ~/DEVFOLD/SCRIPT-PITCHER/SRC/COMPONENTS/NAVBAR/CONTEXT.JS

"use client";
import React, { useCallback, useEffect, useRef } from "react";
import { createContext, useContext, useState } from "react";

const Context = createContext();

export const ContextProvider = ({ children }) => {
  return <Context.Provider value={{}}>{children}</Context.Provider>;
};
export default Context;
export const ContextState = () => {
  return useContext(Context);
};
