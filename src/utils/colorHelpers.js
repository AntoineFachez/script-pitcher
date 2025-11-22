// file path: ~/DEVFOLD/SCRIPT-PITCHER/SRC/UTILS/COLORHELPERS.JS

/**
 * Generates an acronym from a multi-word phrase.
 * E.g., "Federal Emergency Management Agency" => "FEMA"
 *
 * NOTE: This assumes stringToColor and getContrastColor functions are defined elsewhere.
 */
export function stringAvatar(phrase) {
  // Handle cases where phrase might be null, undefined, or empty string
  if (!phrase || typeof phrase !== "string" || phrase.trim() === "") {
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

  // 1. Split the phrase into words
  const words = phrase.trim().split(/\s+/); // Splits by one or more spaces

  // 2. Collect the first letter of each word
  const acronym = words
    .map((word) => {
      // Return the first character if the word is not empty
      return word.length > 0 ? word[0] : "";
    })
    .join("") // Join the array of letters into a single string
    .toUpperCase(); // Ensure the result is uppercase

  // If the acronym is empty (e.g., phrase was "   "), fallback to '?'
  const childrenAcronym = acronym || "?";

  // --- Styling (assumes stringToColor and getContrastColor are available) ---
  // Generate background color based on the full phrase
  const bgColor = stringToColor(phrase);
  // Generate contrasting text color
  const textColor = getContrastColor(bgColor);

  return {
    sx: {
      bgcolor: bgColor,
      color: textColor,
      fontWeight: 400,
      fontSize: "2rem",
      // Set letter spacing if needed for better visualization of longer acronyms
      letterSpacing: acronym.length > 4 ? "0.05em" : undefined,
    },
    children: childrenAcronym,
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
