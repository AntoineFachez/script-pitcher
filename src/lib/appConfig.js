// file path: ~/DEVFOLD/SCRIPT-PITCHER/SRC/LIB/APPCONFIG.JS

import NavBarButton from "@/widgets/me";

export const navActions = (
  toggleColorMode,
  handleLogout,
  handleSetNewAppContext
) => {
  return [
    {
      action: (context) => handleSetNewAppContext(context),
      icon: "Home",
      href: "/",
      prop: "home",
    },
    {
      action: (context) => handleSetNewAppContext(context),
      icon: "Dashboard",
      href: "/dashboard",
      prop: "dashboard",
    },
    {
      action: (context) => handleSetNewAppContext(context),
      icon: "Group",
      href: "/users",
      prop: "users",
    },
    {
      action: (context) => handleSetNewAppContext(context),
      icon: "Article",
      href: "/projects",
      prop: "projects",
    },
    {
      customNavBarButton: (
        <NavBarButton
          key="me"
          handleSetNewAppContext={handleSetNewAppContext}
          layoutContext="navBar"
        />
      ),
    },
    { action: toggleColorMode, icon: "LightMode" },
    { action: handleLogout, icon: "Logout" },
  ];
};
export const bottomNavActions = (
  setToggleDetails,
  showDataGrid,
  setShowDataGrid,
  handleOpenAddItem,
  appContext
) => {
  return [
    {
      action: () => setShowDataGrid((prev) => !prev),
      iconName: showDataGrid ? "CreditCard" : "TableChart",
      label: "Show Table",
      asNavigationAction: true,
    },
    {
      action: () => setToggleDetails((prev) => !prev),
      iconName: "Expand",
      label: "Show Details",
      asNavigationAction: true,
    },
    {
      action: (state) => handleOpenAddItem(state),
      iconName: "Add",
      label: `Add ${appContext}`,
      asNavigationAction: true,
      size: "large",
    },
    { iconName: "Favorite", label: "Favorites", asNavigationAction: true },
  ];
};
