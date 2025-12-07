// file path: ~/DEVFOLD/SCRIPT-PITCHER/SRC/LIB/APPCONFIG.JS

import { Box, Divider, Typography } from "@mui/material";
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
  isDesktop,
  SIDEBAR_WIDTH
) => {
  return [
    {
      key: "drawer-toggle",
      customNavBarButton: (
        <Box
          key="drawer-toggle-box"
          sx={{
            width: "3rem",
            height: "3rem",
            display: "flex",
            // flexFlow: "row nowrap",
            // justifyContent: "space-between",
            // justifyContent: "flex-start",
            // alignItems: "center",
            backgroundColor: "inherit",
            // p: 0,
            // m: 0,
          }}
        >
          {!isDesktop && (
            <BasicDrawer
              handleToggleDrawer={handleToggleDrawer}
              orientationDrawer={orientationDrawer}
              anchor="left"
              iconToOpen={"ViewSidebarOutlined"}
              iconVariant="outlined"
              element={<SideNavBar />}
              SIDEBAR_WIDTH={SIDEBAR_WIDTH}
            />
          )}
        </Box>
      ),
    },
    {
      key: "app-header",
      customNavBarButton: (
        <AppHeader key="app-header-component" title={appContext} />
      ),
    },
    {
      key: "window-size",
      customNavBarButton: (
        <Typography
          key="window-size-text"
          variant="body2"
          sx={{ width: "2ch", p: 0, m: 0 }}
        >
          {currentWindowSize}
        </Typography>
      ),
    },

    {
      key: "settings",
      customNavBarButton: (
        <NavBarButtonSettings key="settings" layoutContext="navBar" />
      ),
    },
  ];
};
export const sidePanelActions = (isDesktop) => {
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
      customNavBarButton: (
        <Divider key="dividerMiddle" sx={{ width: "100%" }} />
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
      customNavBarButton: (
        <NavBarButtonUsers key="users" layoutContext="navBar" />
      ),
    },
    {
      customNavBarButton: (
        <Divider key="dividerBottom" sx={{ width: "100%", p: 0, m: 0 }} />
      ),
    },
    {
      customNavBarButton: <NavBarButtonMe key="me" layoutContext="navBar" />,
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
  const StyledFab = styled(Fab, {
    shouldForwardProp: (prop) => prop !== "showLabel",
  })({
    position: "absolute",
    zIndex: 1,
    top: -30,
    left: 0,
    right: 0,
    margin: "0 auto",
  });
  const StyledBox = styled(Box, {
    shouldForwardProp: (prop) => prop !== "showLabel",
  })({});
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
        <StyledBox key="spacer-box" sx={{ width: "3rem" }} component="span" />
      ),
    },
    {
      key: "quick-menu",
      customNavBarButton: <QuickMenu key="quick-menu-component" />,
    },

    {
      key: "add-fab",
      customNavBarButton: (
        <StyledFab
          key="add-fab-btn"
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
