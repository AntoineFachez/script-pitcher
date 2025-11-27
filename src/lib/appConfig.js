// file path: ~/DEVFOLD/SCRIPT-PITCHER/SRC/LIB/APPCONFIG.JS

import { Box, Divider } from "@mui/material";
import { styled } from "@mui/material/styles";
import { Add, ViewSidebar, ViewSidebarOutlined } from "@mui/icons-material";
import Fab from "@mui/material/Fab";

import NavBarButtonHome from "@/widgets/home";
import NavBarButtonDashboard from "@/widgets/dashboard";
import NavBarButtonMe from "@/widgets/meProfile";
import NavBarButtonProjects from "@/widgets/projectProfile";
import NavBarButtonSettings from "@/widgets/settings";
import NavBarButtonUsers from "@/widgets/userProfile";
import NavBarButtonLogout from "@/widgets/appAuth";

import QuickMenu from "@/components/menus/QuickMenu";
import BasicDrawer from "@/components/drawer/Drawer";
import SideNavBar from "@/components/sideBar/SideBar";
import AppHeader from "@/components/appHeader/AppHeader";

export const topNavActions = (
  appContext,
  handleToggleDrawer,
  orientationDrawer,
  currentWindowSize,
  isDesktop
) => {
  return [
    {
      key: "drawer-toggle",
      customNavBarButton: !isDesktop ? (
        <BasicDrawer
          handleToggleDrawer={handleToggleDrawer}
          orientationDrawer={orientationDrawer}
          anchor="left"
          iconToOpen={<ViewSidebarOutlined />}
          element={<SideNavBar />}
        />
      ) : (
        <>
          <Box
            className="standin"
            sx={{
              width: "4rem",
              height: "100%",
              backgroundColor: "page.title",
            }}
          />
        </>
      ),
    },
    {
      key: "app-header",
      customNavBarButton: <AppHeader title={appContext} />,
    },
    {
      key: "window-size",
      customNavBarButton: currentWindowSize,
    },

    {
      key: "settings",
      customNavBarButton: (
        <NavBarButtonSettings key="settings" layoutContext="navBar" />
      ),
    },
  ];
};
export const sidePanelActions = (
  appContext,
  showDataGrid,
  setToggleDetails,
  setShowDataGrid,
  handleOpenAddItem,
  toggleColorMode,
  handleLogout,
  isDesktop
) => {
  return [
    {
      customNavBarButton: <Divider key="dividerTop" sx={{ width: "100%" }} />,
    },
    {
      customNavBarButton: (
        <NavBarButtonHome key="home" layoutContext="navBar" />
      ),
    },
    {
      customNavBarButton: isDesktop && (
        <NavBarButtonProjects key="projects" layoutContext="navBar" />
      ),
    },
    {
      customNavBarButton: isDesktop && (
        <NavBarButtonDashboard key="dashboard" layoutContext="navBar" />
      ),
    },
    {
      customNavBarButton: <NavBarButtonMe key="me" layoutContext="navBar" />,
    },
    {
      customNavBarButton: (
        <NavBarButtonUsers key="users" layoutContext="navBar" />
      ),
    },
    {
      customNavBarButton: (
        <Divider key="dividerBottom" sx={{ width: "100%" }} />
      ),
    },
    {
      customNavBarButton: (
        <NavBarButtonLogout key="logout" layoutContext="navBar" />
      ),
    },
    // {
    //   key: crypto.randomUUID(),
    //   action: () => setShowDataGrid((prev) => !prev),
    //   iconName: showDataGrid ? "CreditCard" : "TableChart",
    //   label: "Show Table",
    //   asNavigationAction: true,
    // },
    // {
    //   key: crypto.randomUUID(),
    //   action: () => setToggleDetails((prev) => !prev),
    //   iconName: "Expand",
    //   label: "Show Details",
    //   asNavigationAction: true,
    // },
    // {
    //   key: crypto.randomUUID(),
    //   action: () => {
    //     handleOpenAddItem();
    //   },
    //   iconName: "Add",
    //   label: `Add ${appContext}`,
    //   asNavigationAction: true,
    //   size: "large",
    // },
    // { action: toggleColorMode, iconName: "LightMode" },

    // { action: handleLogout, iconName: "Logout", asNavigationAction: true },
  ];
};
export const bottomNavActions = (handleOpenAddItem) => {
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
      key: "dashboard",
      customNavBarButton: (
        <NavBarButtonDashboard key="dashboard" layoutContext="navBar" />
      ),
    },

    {
      key: "projects",
      customNavBarButton: (
        <NavBarButtonProjects key="projects" layoutContext="navBar" />
      ),
    },
    {
      key: "spacer",
      customNavBarButton: (
        // Wrapper to swallow props injected by BottomNavigation
        <Box sx={{ width: "3rem" }} component="span" />
      ),
    },
    {
      key: "quick-menu",
      customNavBarButton: <QuickMenu />,
    },

    {
      key: "add-fab",
      customNavBarButton: (
        <StyledFab
          color="secondary"
          aria-label="add"
          onClick={() => handleOpenAddItem("create")}
          // Prevent BottomNavigation props from reaching the DOM
          showLabel={undefined}
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

    {
      key: "me",
      customNavBarButton: <NavBarButtonMe key="me" layoutContext="navBar" />,
    },
  ];
};
