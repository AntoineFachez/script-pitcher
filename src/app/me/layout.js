// file path: ~/DEVFOLD/SCRIPT-PITCHER/SRC/APP/ME/LAYOUT.JS

import React from "react";
import { WidgetContext } from "../../widgets/me/Context";

export default function ViewUMeLayout({ children }) {
  return <WidgetContext>{children}</WidgetContext>;
}
