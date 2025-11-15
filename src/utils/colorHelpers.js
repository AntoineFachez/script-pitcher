export function stringAvatar(name) {
  // Handle cases where name might be null, undefined, or empty string
  if (!name || typeof name !== "string" || name.trim() === "") {
    return {
      sx: {
        bgcolor: "#bdbdbd", // Default grey background
        color: "#ffffff", // Default white text
        fontWeight: 400,
        fontSize: "2rem",
      },
      children: "?", // Default character
    };
  }

  const nameParts = name.trim().split(" ");
  const firstNameInitial = nameParts[0][0] || "";
  // Handle single-word names gracefully for initials
  const lastNameInitial = nameParts.length > 1 ? nameParts[1][0] || "" : "";
  const initials = `${firstNameInitial}${lastNameInitial}`.toUpperCase();

  const bgColor = stringToColor(name); // Generate background color
  const textColor = getContrastColor(bgColor); // Generate contrasting text color

  return {
    // All style properties should go inside the 'sx' object
    sx: {
      bgcolor: bgColor,
      color: textColor, // <-- Move color inside sx
      fontWeight: 400, // <-- Move fontWeight inside sx
      fontSize: "2rem",
    },
    // Children remains a top-level prop
    children: initials || "?", // Use initials, fallback to '?' if empty
  };
}

export function stringToColor(string) {
  let hash = 0;
  let i;

  /* eslint-disable no-bitwise */
  for (i = 0; i < string?.length; i += 1) {
    hash = string?.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = "#";

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value?.toString(16)}`.slice(-2);
  }
  /* eslint-enable no-bitwise */

  return color;
}
export const handleSetAvatar = (item, Avatar, styled) => ({
  // Parentheses for implicit return of object literal
  ...item, // Spread original item properties
  // Add the avatar property
  avatar: (
    <Avatar
      sx={{
        ...styled?.avatar,
        "& .MuiAvatar-colorDefault": {
          color: "white",
        },
      }}
      {...stringAvatar(item[item?.schemeDefinition?.title] || "N/A")}
    />
  ),
});
export function getContrastColor(hexColor) {
  // Convert hex color to RGB values
  const r = parseInt(hexColor?.slice(1, 3), 16);
  const g = parseInt(hexColor?.slice(3, 5), 16);
  const b = parseInt(hexColor?.slice(5, 7), 16);

  // Calculate luminance (brightness)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  // Return white (#fff) for dark backgrounds, or black (#000) for light backgrounds
  return luminance > 0.5 ? "#000" : "#fff";
}
