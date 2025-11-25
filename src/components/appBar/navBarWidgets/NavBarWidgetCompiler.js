// NavBarWidgetList.js
import React, { Fragment } from "react";
import { NavBarWidget } from "./NavBarWidget"; // Assuming NavBarWidget is a function returning an element

export default function NavBarWidgetList({
  navBarProps,
  navBarWidgetList,
  styled,
}) {
  // Define the common props object passed to every widget instance
  const navBarWidgetProps = {
    ...navBarProps,
    contextToolBar: "navBar",
    styled: styled,
  };
  return (
    <>
      {navBarWidgetList?.map((button, i) => (
        // Use Fragment only if necessary, React 16+ handles arrays/fragments well
        // Pass the specific 'button' (block) and the 'navBarWidgetProps'
        // Directly call the function which returns the element
        <Fragment key={button._uid || i}>
          {NavBarWidget(button, navBarWidgetProps)}
        </Fragment>
      ))}
    </>
  );
}
