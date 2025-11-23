// file path: ~/DEVFOLD/SCRIPT-PITCHER/SRC/LIB/APPCONFIG.JS

import { Box } from "@mui/material";
import { styled } from "@mui/material/styles";
import { Add, ViewSidebar, ViewSidebarOutlined } from "@mui/icons-material";
import Fab from "@mui/material/Fab";

import NavBarButtonHome from "@/widgets/home";
import NavBarButtonDashboard from "@/widgets/dashboard";
import NavBarButtonMe from "@/widgets/meProfile";
import NavBarButtonProjects from "@/widgets/projectProfile";
import NavBarButtonSettings from "@/widgets/settings";

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
export const sidePanelActions = (handleLogout) => {
  return [
    {
      customNavBarButton: (
        <NavBarButtonHome key="home" layoutContext="navBar" />
      ),
    },

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
