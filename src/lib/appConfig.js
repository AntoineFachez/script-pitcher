// file path: ~/DEVFOLD/SCRIPT-PITCHER/SRC/LIB/APPCONFIG.JS

import { Box } from "@mui/material";
import { styled } from "@mui/material/styles";
import { Add } from "@mui/icons-material";
import Fab from "@mui/material/Fab";

import NavBarButtonDashboard from "@/widgets/dashboard";
import NavBarButtonMe from "@/widgets/meProfile";
import NavBarButtonProjects from "@/widgets/projectProfile";

import QuickMenu from "@/components/menus/QuickMenu";
import BasicDrawer from "@/components/drawer/Drawer";
import SideNavBar from "@/components/sideNavBar/SideNavBar";

export const sidePanelActions = (
  toggleColorMode,
  handleLogout,
  handleSetNewAppContext,
  handleToggleDrawer,
  orientationDrawer
) => {
  console.log(handleLogout);
  return [
    // {
    //   customNavBarButton: (
    //     <BasicDrawer
    //       handleToggleDrawer={handleToggleDrawer}
    //       orientationDrawer={orientationDrawer}
    //       anchor="left"
    //     />
    //   ),
    // },
    // {
    //   action: () => handleSetNewAppContext("home", setAppContext),
    //   iconName: "Home",
    //   href: "/",
    //   prop: "home",
    // },
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
    // {
    //   customNavBarButton: (
    //     <NavBarButtonProjects
    //       key="projects"
    //       handleSetNewAppContext={handleSetNewAppContext}
    //       layoutContext="navBar"
    //     />
    //   ),
    // },
    // {
    //   customNavBarButton: (
    //     <NavBarButtonMe
    //       key="me"
    //       handleSetNewAppContext={handleSetNewAppContext}
    //       layoutContext="navBar"
    //     />
    //   ),
    // },
    // { action: toggleColorMode, iconName: "LightMode" },
    { action: handleLogout, iconName: "Logout", asNavigationAction: true },
  ];
};
export const topNavActions = (
  toggleColorMode,
  handleLogout,
  handleSetNewAppContext,
  handleToggleDrawer,
  orientationDrawer
) => {
  return [
    {
      customNavBarButton: (
        <BasicDrawer
          handleToggleDrawer={handleToggleDrawer}
          orientationDrawer={orientationDrawer}
          anchor="left"
          element={<SideNavBar />}
        />
      ),
    },
    // {
    //   action: () => handleSetNewAppContext("home", setAppContext),
    //   iconName: "Home",
    //   href: "/",
    //   prop: "home",
    // },
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
    // {
    //   customNavBarButton: (
    //     <NavBarButtonProjects
    //       key="projects"
    //       handleSetNewAppContext={handleSetNewAppContext}
    //       layoutContext="navBar"
    //     />
    //   ),
    // },
    // {
    //   customNavBarButton: (
    //     <NavBarButtonMe
    //       key="me"
    //       handleSetNewAppContext={handleSetNewAppContext}
    //       layoutContext="navBar"
    //     />
    //   ),
    // },
    // { action: toggleColorMode, iconName: "LightMode" },
    // { action: handleLogout, iconName: "Logout" },
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
        <NavBarButtonDashboard
          key="dashboard"
          handleSetNewAppContext={handleSetNewAppContext}
          layoutContext="navBar"
        />
      ),
    },
    // {
    //   iconName: "Home",
    //   action: () => handleSetNewAppContext("home", setAppContext),
    //   href: "/",
    //   prop: "home",
    //   // asNavigationAction: true,
    //   label: "Home",
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
      customNavBarButton: <Box sx={{ width: "3rem" }} />,
    },
    {
      customNavBarButton: <QuickMenu />,
    },
    // {
    //   action: () => setShowDataGrid((prev) => !prev),
    //   iconName: showDataGrid ? "CreditCard" : "TableChart",
    //   label: "Show Table",
    //   asNavigationAction: true,
    // },
    // {
    //   action: () => setToggleDetails((prev) => !prev),
    //   iconName: "Expand",
    //   label: "Show Details",
    //   asNavigationAction: true,
    // },
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
