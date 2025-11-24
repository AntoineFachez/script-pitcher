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

import QuickMenu from "@/components/menus/QuickMenu";
import BasicDrawer from "@/components/drawer/Drawer";
import SideNavBar from "@/components/sideNavBar/SideNavBar";
import AppHeader from "@/components/appHeader/AppHeader";

export const topNavActions = (
  appContext,
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
          iconToOpen={<ViewSidebarOutlined />}
          element={<SideNavBar />}
        />
      ),
    },
    {
      customNavBarButton: <AppHeader title={appContext} />,
    },

    {
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
  handleLogout
) => {
  return [
    {
      customNavBarButton: (
        <NavBarButtonHome key="home" layoutContext="navBar" />
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
      customNavBarButton: <Divider />,
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

    { action: handleLogout, iconName: "Logout", asNavigationAction: true },
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
      customNavBarButton: (
        <NavBarButtonDashboard key="dashboard" layoutContext="navBar" />
      ),
    },

    {
      customNavBarButton: (
        <NavBarButtonProjects key="projects" layoutContext="navBar" />
      ),
    },
    {
      customNavBarButton: <Box sx={{ width: "3rem" }} />,
    },
    {
      customNavBarButton: <QuickMenu />,
    },

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

    {
      customNavBarButton: <NavBarButtonMe key="me" layoutContext="navBar" />,
    },
  ];
};
