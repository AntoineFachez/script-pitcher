import React from "react";
import { ActionIcon } from "@/components/buttons/ActionIcon";
import { useApp } from "@/context/AppContext";

export const WidgetLayout = ({
  widgetConfig,
  layoutContext,
  onNavBarClick,
  badgeCount = null,
  children,
}) => {
  const { appContext, setAppContext } = useApp();
  const config = widgetConfig?.widgetConfig;

  if (layoutContext === "navBar") {
    return (
      <>
        <ActionIcon
          iconName={config?.iconName}
          onClick={onNavBarClick}
          // onClick={() => onNavBarClick(null, setAppContext)}
          href={config?.href}
          badgeCount={badgeCount}
          variant="outlined"
          disabled={appContext === config?.context}
          label={config?.title}
        />
      </>
    );
  }
  return <>{children}</>;
};
