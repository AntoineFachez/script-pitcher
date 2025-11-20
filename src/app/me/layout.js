// file path: ~/DEVFOLD/SCRIPT-PITCHER/SRC/APP/ME/LAYOUT.JS

import React from "react";
import { WidgetContext } from "../../widgets/meProfile/Context";

export default function ViewUMeLayout({ children }) {
  return <WidgetContext>{children}</WidgetContext>;
}
