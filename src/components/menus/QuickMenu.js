import * as React from "react";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Box } from "@mui/material";
import { getButton } from "@/lib/maps/iconMap";
import { useUi } from "@/context/UiContext";
import { useApp } from "@/context/AppContext";
import { useThemeContext } from "@/context/ThemeContext";

const ITEM_HEIGHT = 48;

export default function QuickMenu() {
  const { appContext } = useApp();
  const { toggleColorMode } = useThemeContext();
  const { showDataGrid, setToggleDetails, setShowDataGrid, handleOpenAddItem } =
    useUi();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const options = [
    {
      key: crypto.randomUUID(),
      action: () => setShowDataGrid((prev) => !prev),
      iconName: showDataGrid ? "CreditCard" : "TableChart",
      label: "Show Table",
      asNavigationAction: true,
    },
    {
      key: crypto.randomUUID(),
      action: () => setToggleDetails((prev) => !prev),
      iconName: "Expand",
      label: "Show Details",
      asNavigationAction: true,
    },
    {
      key: crypto.randomUUID(),
      action: () => {
        handleOpenAddItem();
      },
      iconName: "Add",
      label: `Add ${appContext}`,
      asNavigationAction: true,
      size: "large",
    },
    { action: toggleColorMode, iconName: "LightMode" },
  ];
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box>
      <IconButton
        aria-label="more"
        id="long-button"
        aria-controls={open ? "long-menu" : undefined}
        aria-expanded={open ? "true" : undefined}
        aria-haspopup="true"
        onClick={handleClick}
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        id="long-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        slotProps={{
          paper: {
            style: {
              maxHeight: ITEM_HEIGHT * 4.5,
              width: "20ch",
            },
          },
          list: {
            "aria-labelledby": "long-button",
          },
        }}
      >
        {options.map((option, i) => (
          <MenuItem
            key={option}
            selected={option === "Pyxis"}
            onClick={handleClose}
          >
            {getButton(
              i, // i,
              option.iconName, // iconName = "",
              option.action, // onClick,
              option.disabled, // disabled = false,
              (option.size = {}), // sx = iconButtonStyles.sx,
              option.variant, // variant = "outlined",
              option.href, // href = null,
              option.buttonText, // label = "",
              false, // toolTip,
              true, // asNavigationAction = false,
              false, // asTextButton = false,
              false // startIcon = null
            )}
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
}
