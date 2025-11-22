// file path: ~/DEVFOLD/SCRIPT-PITCHER/SRC/LIB/APPCONFIG.JS

import NavBarButtonMe from "@/widgets/meProfile";
import NavBarButtonProjects from "@/widgets/projectProfile";

import { styled } from "@mui/material/styles";
import Fab from "@mui/material/Fab";
import { Add } from "@mui/icons-material";

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
    // {
    //   action: (context) => handleSetNewAppContext(context),
    //   icon: "Dashboard",
    //   href: "/dashboard",
    //   prop: "dashboard",
    // },
    // {
    //   action: (context) => handleSetNewAppContext(context),
    //   icon: "Group",
    //   href: "/users",
    //   prop: "users",
    // },
    // {
    //   action: (context) => handleSetNewAppContext(context),
    //   icon: "Article",
    //   href: "/projects",
    //   prop: "projects",
    // },
    {
      customNavBarButton: (
        <NavBarButtonProjects
          key="projects"
          handleSetNewAppContext={handleSetNewAppContext}
          layoutContext="navBar"
        />
      ),
    },
    {
      customNavBarButton: (
        <NavBarButtonMe
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
  appContext,
  setAppContext,
  setToggleDetails,
  showDataGrid,
  setShowDataGrid,
  handleOpenAddItem,
  handleSetNewAppContext
) => {
  const StyledFab = styled(Fab)({
    position: "absolute",
    zIndex: 1,
    top: -30,
    left: 0,
    right: 0,
    margin: "0 auto",
  });
  return [
    {
      customNavBarButton: (
        <NavBarButtonProjects
          key="projects"
          handleSetNewAppContext={handleSetNewAppContext}
          layoutContext="navBar"
        />
      ),
    },

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
    // {
    //   action: () => {
    //     handleOpenAddItem();
    //   },
    //   iconName: "Add",
    //   label: `Add ${appContext}`,
    //   asNavigationAction: true,
    //   size: "large",
    // },
    {
      customNavBarButton: (
        <StyledFab
          color="secondary"
          aria-label="add"
          onClick={() => handleOpenAddItem("create")}
        >
          <Add />
        </StyledFab>
      ),
    },
    // {
    //   action: null,
    //   iconName: "Add",
    //   label: null,
    //   asNavigationAction: true,
    // },
    // {
    //   iconName: "FavoriteBorder",
    //   label: "Favorites",
    //   asNavigationAction: true,
    // },
    {
      customNavBarButton: (
        <NavBarButtonMe
          key="me"
          handleSetNewAppContext={handleSetNewAppContext}
          layoutContext="navBar"
        />
      ),
    },
  ];
};
