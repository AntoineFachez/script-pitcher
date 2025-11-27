import React from "react";
import Link from "next/link";
import {
  IconButton,
  Button,
  Tooltip,
  BottomNavigationAction,
} from "@mui/material";
import { iconMap } from "../../lib/maps/iconMap";

/**
 * A flexible button component that renders an icon, text, or both.
 * Replaces the deprecated `getButton` function.
 *
 * @param {Object} props
 * @param {string} props.iconName - Key from iconMap
 * @param {string} props.label - Tooltip text or button text
 * @param {function} props.onClick - Click handler
 * @param {string} props.href - URL for link behavior
 * @param {boolean} props.disabled - Disabled state
 * @param {object} props.sx - MUI system props
 * @param {string} props.variant - Button variant (text, outlined, contained)
 * @param {string} props.color - Button color
 * @param {string} props.size - Button size
 * @param {string} props.startIcon - Key from iconMap for start icon (if showLabel is true)
 * @param {boolean} props.showLabel - If true, renders as Button with text. If false, renders as IconButton with tooltip.
 * @param {boolean} props.asNavigationAction - If true, renders as BottomNavigationAction
 */
export const ActionIcon = ({
  iconName,
  label,
  onClick,
  href,
  disabled = false,
  sx = {},
  variant = "outlined",
  color,
  size,
  startIcon,
  showLabel = false,
  asNavigationAction = false,
  badgeCount, // Destructure to prevent passing to DOM
  ...props
}) => {
  const IconComponent = iconName ? iconMap[iconName] : null;
  const StartIconComponent = startIcon ? iconMap[startIcon] : null;

  if (!IconComponent && !showLabel && !asNavigationAction) {
    return null;
  }

  const isLink = Boolean(href);
  const linkProps = isLink ? { component: Link, href } : {};

  // 1. BottomNavigationAction
  if (asNavigationAction) {
    return (
      <BottomNavigationAction
        label={label}
        icon={IconComponent ? <IconComponent /> : null}
        onClick={onClick}
        disabled={disabled}
        sx={sx}
        {...linkProps}
        {...props}
      />
    );
  }

  // 2. Button (with text)
  if (showLabel) {
    return (
      <Button
        variant={variant}
        color={color}
        size={size}
        onClick={onClick}
        disabled={disabled}
        startIcon={StartIconComponent ? <StartIconComponent /> : null}
        sx={sx}
        {...linkProps}
        {...props}
      >
        {label}
        {/* If we want the icon as main content instead of startIcon, we could put it here too, 
            but usually showLabel implies we want the text. 
            If iconName is provided and showLabel is true, we might want to show it? 
            The original getButton logic was a bit mixed. 
            Let's assume if showLabel is true, we rely on label. 
            If iconName is ALSO passed, maybe we should render it? 
            For now, let's stick to standard Button props. */}
      </Button>
    );
  }

  // 3. IconButton (Icon only with Tooltip)
  const button = (
    <IconButton
      onClick={onClick}
      disabled={disabled}
      size={size}
      color={color}
      sx={{
        ...actionButtonStyles,
        "&.Mui-disabled": {
          background: "button.activeBackground",
          color: "button.active",
        },
        ...sx,
      }}
      {...linkProps}
      {...props}
    >
      {IconComponent ? <IconComponent /> : null}
    </IconButton>
  );

  if (label) {
    return <Tooltip title={label}>{button}</Tooltip>;
  }

  return button;
};

const actionButtonStyles = {
  width: 48,
  height: 48,
  p: 0,
  m: 0,
  color: "action.main",
  backgroundColor: "button.background",
  "&:hover": { color: "secondary.main", backgroundColor: "background.paper" },
  "& >*": { fontSize: "1.2rem" },
};
