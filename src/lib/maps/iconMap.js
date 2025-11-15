// file path: ~/DEVFOLD/SCRIPT-PITCHER/SRC/LIB/MAPS/ICONMAP.JS

import { iconButtonStyles } from "@/theme/muiProps";
import Link from "next/link";
import {
  BottomNavigationAction,
  Button,
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  AccountTree,
  AccountCircle,
  Add,
  Analytics,
  Apps,
  ArrowForward,
  Article,
  Chat,
  CheckCircleOutline,
  ContentCopy,
  Dashboard,
  CreditCard,
  Delete,
  DensityLarge,
  DensityMedium,
  DensitySmall,
  Edit,
  Expand,
  Favorite,
  Forward,
  Gavel,
  Group,
  Home,
  LightMode,
  Logout,
  MoreVert,
  Notifications,
  Person,
  PersonOff,
  Public,
  PublicOff,
  Remove,
  Restore,
  Settings,
  Share,
  Storage,
  TableChart,
  Warning,
  //# SoMe
  Facebook,
  Twitter,
  YouTube,
  Instagram,
} from "@mui/icons-material";

// A single mapping object for all icons
export const iconMap = {
  AccountTree: AccountTree,
  Account: AccountCircle,
  Add: Add,
  Analytics: Analytics,
  Apps: Apps,
  Article: Article,
  Chat: Chat,
  CheckCircleOutline: CheckCircleOutline,
  ContentCopy: ContentCopy,
  Dashboard: Dashboard,
  CreditCard: CreditCard,
  Database: Storage,
  Delete: Delete,
  DensityLarge: DensityLarge,
  DensityMedium: DensityMedium,
  DensitySmall: DensitySmall,
  Edit: Edit,
  Expand: Expand,
  Favorite: Favorite,
  Forward: ArrowForward,
  Gavel: Gavel,
  Group: Group,
  Home: Home,
  LightMode: LightMode,
  Logout: Logout,
  MoreVert: MoreVert,
  Notifications: Notifications,
  Person: Person,
  PersonOff: PersonOff,
  Public: Public,
  PublicOff: PublicOff,
  Remove: Remove,
  Restore: Restore,
  Share: Share,
  Settings: Settings,
  TableChart: TableChart,
  Warning: Warning,

  //# SoMe
  bluesky:
    "https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://bsky.app&size=256",
  facebook: Facebook,
  instagram: Instagram,
  truth_social: Public,
  x: "https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://x.com&size=256",
  youtube:
    "https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://youtube.com&size=256",
};
export const getButton = (
  i,
  iconName = "",
  onClick,
  disabled = false,
  sx = iconButtonStyles.sx,
  variant = "outlined",
  href = null,
  label = "",
  toolTip,
  asNavigationAction = false,
  asTextButton = false,
  startIcon = null
) => {
  // console.log("sx", sx);

  const IconComponent = iconName ? iconMap[iconName] : null;
  const StartIcon = iconMap[startIcon];
  const BaseComponent = asNavigationAction
    ? BottomNavigationAction
    : asTextButton
    ? Button
    : IconButton;
  const isLink = Boolean(href);
  const actionProps = asNavigationAction
    ? {
        label: label,
        icon: <IconComponent />,
      }
    : asTextButton
    ? { children: label }
    : {
        children: (
          <Tooltip title={toolTip}>
            <IconComponent />
          </Tooltip>
        ),
      };
  return IconComponent ? (
    <BaseComponent
      key={i}
      component={isLink ? Link : "button"}
      href={href}
      onClick={onClick}
      disabled={disabled}
      sx={sx}
      // startIcon={asTextButton && startIcon ? <StartIcon /> : null}
      variant={
        BaseComponent === IconButton || asTextButton ? variant : undefined
      }
      {...actionProps}
    />
  ) : null;
};
