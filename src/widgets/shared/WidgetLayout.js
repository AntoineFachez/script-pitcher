import React from "react";
import { ActionIcon } from "@/components/buttons/ActionIcon";

export const WidgetLayout = ({
  layoutContext,
  onNavBarClick,
  iconName,
  href,
  badgeCount = null,
  children,
}) => {
  if (layoutContext === "navBar") {
    return (
      <ActionIcon
        iconName={iconName}
        onClick={onNavBarClick}
        href={href}
        badgeCount={badgeCount}
      />
    );
  }
  return <>{children}</>;
};
